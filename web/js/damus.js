
let DAMUS

const BOOTSTRAP_RELAYS = [
	"wss://relay.damus.io",
	"wss://nostr-relay.wlvs.space",
	"wss://nostr-pub.wellorder.net"
]

const DEFAULT_PROFILE = {
	name: "anon",
	display_name: "Anonymous",
}

function insert_event_sorted(evs, new_ev) {
        for (let i = 0; i < evs.length; i++) {
                const ev = evs[i]

                if (new_ev.id === ev.id) {
                        return false
                }

                if (new_ev.created_at > ev.created_at) {
                        evs.splice(i, 0, new_ev)
                        return true
                }
        }

        evs.push(new_ev)
        return true
}

function init_contacts() {
	return {
		event: null,
		friends: new Set(),
		friend_of_friends: new Set(),
	}
}

function init_timeline(name) {
	return {
		name,
		events: [],
		rendered: new Set(),
		depths: {},
		expanded: new Set(),
	}
}

function init_home_model() {
	return {
		done_init: {},
		notifications: 0,
		max_depth: 2,
		all_events: {},
		reactions_to: {},
		chatrooms: {},
		unknown_ids: {},
		unknown_pks: {},
		deletions: {},
		but_wait_theres_more: 0,
		cw_open: {},
		views: {
			home: init_timeline('home'),
			explore: {
				...init_timeline('explore'),
				seen: new Set(),
			},
			notifications: {
				...init_timeline('notifications'),
				max_depth: 1,
			},
			profile: init_timeline('profile'),
			thread: init_timeline('thread'),
		},
		pow: 0, // pow difficulty target
		deleted: {},
		profiles: {},
		profile_events: {},
		last_event_of_kind: {},
		contacts: init_contacts()
	}
}

function update_favicon(path)
{
	let link = document.querySelector("link[rel~='icon']");
	const head = document.getElementsByTagName('head')[0]

	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		head.appendChild(link);
	}

	link.href = path;
}

// update_title updates the document title & visual indicators based on if the
// number of notifications that are unseen by the user.
function update_title(model) {
	// TODO rename update_title to update_notification_state or similar
	// TODO only clear notifications once they have seen all targeted events
	if (document.visibilityState === 'visible') {
		model.notifications = 0
	}

	const num = model.notifications
	const has_notes = num !== 0
	document.title = has_notes ? `(${num}) Damus` : "Damus";
	update_favicon(has_notes ? "img/damus_notif.svg" : "img/damus.svg");
	update_notification_markers(has_notes)
}

function notice_chatroom(state, id)
{
	if (!state.chatrooms[id])
		state.chatrooms[id] = {}
}

async function damus_web_init()
{
	init_message_textareas();

	let tries = 0;
	function init() {
		// only wait for 500ms max
		const max_wait = 500
		const interval = 20
		if (window.nostr || tries >= (max_wait/interval)) {
			console.info("init after", tries);
			damus_web_init_ready();
			return;
		}
		tries++;
		setTimeout(init, interval);
	}
	init();
}

async function damus_web_init_ready()
{
	history.replaceState({ page: "home" }, null, '');
	window.onpopstate = (event) => {
		if (event.state.page === "profile") {
			show_profile(event.state.opts.pk);
		}

		// in case page is null or undefined, fallback to the home view
		switch_view(event.state.page || 'home');
	}
	

	const model = init_home_model()
	DAMUS = model
	model.pubkey = await get_pubkey()
	if (!model.pubkey)
		return
	const {RelayPool} = nostrjs
	const pool = RelayPool(BOOTSTRAP_RELAYS)
	const now = (new Date().getTime()) / 1000

	const ids = {
		comments: "comments",//uuidv4(),
		profiles: "profiles",//uuidv4(),
		explore: "explore",//uuidv4(),
		refevents: "refevents",//uuidv4(),
		account: "account",//uuidv4(),
		home: "home",//uuidv4(),
		contacts: "contacts",//uuidv4(),
		notifications: "notifications",//uuidv4(),
		unknowns: "unknowns",//uuidv4(),
		dms: "dms",//uuidv4(),
	}

	model.ids = ids

	model.pool = pool

	load_cache(model)
	model.view_el = document.querySelector("#view")

	switch_view('home');

	document.addEventListener('visibilitychange', () => {
		update_title(model)
	})

	pool.on('open', (relay) => {
		//let authors = followers
		// TODO: fetch contact list
		log_debug("relay connected", relay.url)

		if (!model.done_init[relay]) {
			send_initial_filters(ids.account, model.pubkey, relay)
		} else {
			send_home_filters(model, relay)
		}
		//relay.subscribe(comments_id, {kinds: [1,42], limit: 100})
	});

	pool.on('event', (relay, sub_id, ev) => {
		handle_home_event(model, relay, sub_id, ev)
	})

	pool.on('notice', (relay, notice) => {
		log_debug("NOTICE", relay, notice)
	})

	pool.on('eose', async (relay, sub_id) => {
		if (sub_id === ids.home) {
			//log_debug("got home EOSE from %s", relay.url)
			const events = model.views.home.events
			handle_comments_loaded(ids, model, events, relay)
		} else if (sub_id === ids.profiles) {
			//log_debug("got profiles EOSE from %s", relay.url)
			const view = get_current_view()
			handle_profiles_loaded(ids, model, view, relay)
		} else if (sub_id === ids.unknowns) {
			model.pool.unsubscribe(ids.unknowns, relay)
		}
	})

	return pool
}

function process_reaction_event(model, ev)
{
	if (!is_valid_reaction_content(ev.content))
		return

	let last = {}

	for (const tag of ev.tags) {
		if (tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"))
			last[tag[0]] = tag[1]
	}

	if (last.e) {
		model.reactions_to[last.e] = model.reactions_to[last.e] || new Set()
		model.reactions_to[last.e].add(ev.id)
	}
}

function process_chatroom_event(model, ev)
{
	try {
		model.chatrooms[ev.id] = sanitize_obj(JSON.parse(ev.content))
	} catch (err) {
		log_debug("error processing chatroom creation event", ev, err)
	}
}

function process_deletion_event(model, ev)
{
	for (const tag of ev.tags) {
		if (tag.length >= 2 && tag[0] === "e") {
			const evid = tag[1]

			// we've already recorded this one as a valid deleted
			// event we can just ignore it
			if (model.deleted[evid])
				continue

			let ds = model.deletions[evid] =
				(model.deletions[evid] || new Set())

			// add the deletion event id to the deletion set of
			// this event we will use this to determine if this
			// event is valid later in case we don't have the
			// deleted event yet.
			ds.add(ev.id)
		}
	}
}

function is_deleted(model, evid)
{
	// we've already know it's deleted
	if (model.deleted[evid])
		return model.deleted[evid]

	const ev = model.all_events[evid]
	if (!ev)
		return false

	// all deletion events
	const ds = model.deletions[ev.id]
	if (!ds)
		return false

	// find valid deletion events
	for (const id of ds.keys()) {
		const d_ev = model.all_events[id]
		if (!d_ev)
			continue

		// only allow deletes from the user who created it
		if (d_ev.pubkey === ev.pubkey) {
			model.deleted[ev.id] = d_ev
			log_debug("received deletion for", ev)
			// clean up deletion data that we don't need anymore
			delete model.deletions[ev.id]
			return true
		} else {
			log_debug(`User ${d_ev.pubkey} tried to delete ${ev.pubkey}'s event ... what?`)
		}
	}

	return false
}

function has_profile(damus, pk) {
	return pk in damus.profiles
}

function has_event(damus, evid) {
	return evid in damus.all_events
}

const ID_REG = /^[a-f0-9]{64}$/
function is_valid_id(evid)
{
	return ID_REG.test(evid)
}

function make_unk(hint, ev)
{
	const attempts = 0
	const parent_created = ev.created_at

	if (hint && hint !== "")
		return {attempts, hint: hint.trim().toLowerCase(), parent_created}

	return {attempts, parent_created}
}

function notice_unknown_ids(damus, ev)
{
	// make sure this event itself is removed from unknowns
	if (ev.kind === 0)
		delete damus.unknown_pks[ev.pubkey]
	delete damus.unknown_ids[ev.id]

	let got_some = false

	for (const tag of ev.tags) {
		if (tag.length >= 2) {
			if (tag[0] === "p") {
				const pk = tag[1]
				if (!has_profile(damus, pk) && is_valid_id(pk)) {
					got_some = true
					damus.unknown_pks[pk] = make_unk(tag[2], ev)
				}
			} else if (tag[0] === "e") {
				const evid = tag[1]
				if (!has_event(damus, evid) && is_valid_id(evid)) {
					got_some = true
					damus.unknown_ids[evid] = make_unk(tag[2], ev)
				}
			}
		}
	}

	return got_some
}

function gather_unknown_hints(damus, pks, evids)
{
	let relays = new Set()

	for (const pk of pks) {
		const unk = damus.unknown_pks[pk]
		if (unk && unk.hint && unk.hint !== "")
			relays.add(unk.hint)
	}

	for (const evid of evids) {
		const unk = damus.unknown_ids[evid]
		if (unk && unk.hint && unk.hint !== "")
			relays.add(unk.hint)
	}

	return Array.from(relays)
}

function get_non_expired_unknowns(unks, type)
{
	const MAX_ATTEMPTS = 2

	function sort_parent_created(a_id, b_id) {
		const a = unks[a_id]
		const b = unks[b_id]
		return b.parent_created - a.parent_created
	}

	let new_expired = 0
	const ids = Object.keys(unks).sort(sort_parent_created).reduce((ids, unk_id) => {
		if (ids.length >= 255)
			return ids

		const unk = unks[unk_id]
		if (unk.attempts >= MAX_ATTEMPTS) {
			if (!unk.expired) {
				unk.expired = true
				new_expired++
			}
			return ids
		}

		unk.attempts++

		ids.push(unk_id)
		return ids
	}, [])

	if (new_expired !== 0)
		log_debug("Gave up looking for %d %s", new_expired, type)

	return ids
}

function fetch_unknown_events(damus)
{
	let filters = []

	const pks = get_non_expired_unknowns(damus.unknown_pks, 'profiles')
	const evids = get_non_expired_unknowns(damus.unknown_ids, 'events')

	const relays = gather_unknown_hints(damus, pks, evids)

	for (const relay of relays) {
		if (!damus.pool.has(relay)) {
			log_debug("adding %s to relays to fetch unknown events", relay)
			damus.pool.add(relay)
		}
	}

	if (evids.length !== 0) {
		const unk_kinds = [1,5,6,7,40,42]
		filters.push({ids: evids, kinds: unk_kinds})
		filters.push({"#e": evids, kinds: [1,42], limit: 100})
	}

	if (pks.length !== 0)
		filters.push({authors: pks, kinds:[0]})

	if (filters.length === 0)
		return

	log_debug("fetching unknowns", filters)
	damus.pool.subscribe('unknowns', filters)
}

function shuffle(arr)
{
	let i = arr.length;
	while (--i > 0) {
		let randIndex = Math.floor(Math.random() * (i + 1));
		[arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
	}
	return arr;
}


function schedule_unknown_refetch(damus)
{
	const INTERVAL = 5000
	if (!damus.unknown_timer) {
		log_debug("fetching unknown events now and in %d seconds", INTERVAL / 1000)

		damus.unknown_timer = setTimeout(() => {
			fetch_unknown_events(damus)

			setTimeout(() => {
				delete damus.unknown_timer
				if (damus.but_wait_theres_more > 0) {
					damus.but_wait_theres_more = 0
					schedule_unknown_refetch(damus)
				}
			}, INTERVAL)
		}, INTERVAL)

		fetch_unknown_events(damus)
	} else {
		damus.but_wait_theres_more++
	}
}

function process_event(damus, ev)
{
	ev.refs = determine_event_refs(ev.tags)
	const notified = was_pubkey_notified(damus.pubkey, ev)
	ev.notified = notified

	const got_some_unknowns = notice_unknown_ids(damus, ev)
	if (got_some_unknowns)
		schedule_unknown_refetch(damus)

	ev.pow = calculate_pow(ev)

	if (ev.kind === 7)
		process_reaction_event(damus, ev)
	else if (ev.kind === 42 && ev.refs && ev.refs.root)
		notice_chatroom(damus, ev.refs.root)
	else if (ev.kind === 40)
		process_chatroom_event(damus, ev)
	else if (ev.kind === 5)
		process_deletion_event(damus, ev)
	else if (ev.kind === 0)
		process_profile_event(damus, ev)
	else if (ev.kind === 3)
		process_contact_event(damus, ev)

	const last_notified = get_local_state('last_notified_date')
	if (notified && (last_notified == null || ((ev.created_at*1000) > last_notified))) {
		set_local_state('last_notified_date', new Date().getTime())
		damus.notifications++
		update_title(damus)
	}
}

function was_pubkey_notified(pubkey, ev)
{
	if (!(ev.kind === 1 || ev.kind === 42))
		return false

	if (ev.pubkey === pubkey)
		return false

	for (const tag of ev.tags) {
		if (tag.length >= 2 && tag[0] === "p" && tag[1] === pubkey)
			return true
	}

	return false
}

function should_add_to_notification_timeline(our_pk, contacts, ev, pow)
{
	if (!should_add_to_timeline(ev))
		return false

	// TODO: add items that don't pass spam filter to "message requests"
	// Then we will need a way to whitelist people as an alternative to
	// following them
	return passes_spam_filter(contacts, ev, pow)
}

function should_add_to_explore_timeline(contacts, view, ev, pow)
{
	if (!should_add_to_timeline(ev))
		return false

	if (view.seen.has(ev.pubkey))
		return false

	// hide friends for 0-pow situations
	if (pow === 0 && contacts.friends.has(ev.pubkey))
		return false

	return passes_spam_filter(contacts, ev, pow)
}

function get_current_view()
{
	// TODO resolve memory & html descriptencies
	// Currently there is tracking of which divs are visible in HTML/CSS and
	// which is active in memory, simply resolve this by finding the visible
	// element instead of tracking it in memory (or remove dom elements). This
	// would simplify state tracking IMO - Thomas
	return DAMUS.views[DAMUS.current_view]
}

function handle_redraw_logic(model, view_name)
{
	const view = model.views[view_name]
	if (view.redraw_timer)
		clearTimeout(view.redraw_timer)
	view.redraw_timer = setTimeout(redraw_events.bind(null, model, view), 600)
}

function schedule_save_events(damus)
{
	if (damus.save_timer)
		clearTimeout(damus.save_timer)
	damus.save_timer = setTimeout(save_cache.bind(null, damus), 3000)
}

function is_valid_time(now_sec, created_at)
{
	// don't count events far in the future
	if (created_at - now_sec >= 120) {
		return false
	}
	return true
}

function max(a, b) {
	return a > b ? a : b
}

function calculate_last_of_kind(evs)
{
	const now_sec = new Date().getTime() / 1000
	return Object.keys(evs).reduce((obj, evid) => {
		const ev = evs[evid]
		if (!is_valid_time(now_sec, ev.created_at))
			return obj
		const prev = obj[ev.kind] || 0
		obj[ev.kind] = get_since_time(max(ev.created_at, prev))
		return obj
	}, {})
}

function load_events(damus)
{
	if (!('event_cache' in localStorage))
		return {}
	const cached = JSON.parse(localStorage.getItem('event_cache'))

	return cached.reduce((obj, ev) => {
		obj[ev.id] = ev
		process_event(damus, ev)
		return obj
	}, {})
}

function load_cache(damus)
{
	damus.all_events = load_events(damus)
	load_timelines(damus)
}

function save_cache(damus)
{
	save_events(damus)
	save_timelines(damus)
}

function save_events(damus)
{
	const keys = Object.keys(damus.all_events)
	const MAX_KINDS = {
		1: 2000,
		0: 2000,

		6: 100,
		4: 100,
		5: 100,
		7: 100,
	}

	let counts = {}

	let cached = keys.map((key) => {
		const ev = damus.all_events[key]
		const {sig, pubkey, content, tags, kind, created_at, id} = ev
		return {sig, pubkey, content, tags, kind, created_at, id}
	})

	cached.sort((a,b) => b.created_at - a.created_at)
	cached = cached.reduce((cs, ev) => {
		counts[ev.kind] = (counts[ev.kind] || 0)+1
		if (counts[ev.kind] < MAX_KINDS[ev.kind])
			cs.push(ev)
		return cs
	}, [])

	log_debug('saving all events to local storage', cached.length)

	localStorage.setItem('event_cache', JSON.stringify(cached))
}

function save_timelines(damus)
{
	const views = Object.keys(damus.views).reduce((obj, view_name) => {
		const view = damus.views[view_name]
		obj[view_name] = view.events.map(e => e.id).slice(0,100)
		return obj
	}, {})
	localStorage.setItem('views', JSON.stringify(views))
}

function load_timelines(damus)
{
	if (!('views' in localStorage))
		return
	const stored_views = JSON.parse(localStorage.getItem('views'))
	for (const view_name of Object.keys(damus.views)) {
		const view = damus.views[view_name]
		view.events = (stored_views[view_name] || []).reduce((evs, evid) => {
			const ev = damus.all_events[evid]
			if (ev) evs.push(ev)
			return evs
		}, [])
	}
}

function handle_home_event(model, relay, sub_id, ev) {
	const ids = model.ids

	// ignore duplicates
	if (!has_event(model, ev.id)) {
		model.all_events[ev.id] = ev
		process_event(model, ev)
		schedule_save_events(model)
	}

	ev = model.all_events[ev.id]

	let is_new = true
	switch (sub_id) {
	case model.ids.explore:
		const view = model.views.explore

		// show more things in explore timeline
		if (should_add_to_explore_timeline(model.contacts, view, ev, model.pow)) {
			view.seen.add(ev.pubkey)
			is_new = insert_event_sorted(view.events, ev)
		}

		if (is_new)
			handle_redraw_logic(model, 'explore')
		break;

	case model.ids.notifications:
		if (should_add_to_notification_timeline(model.pubkey, model.contacts, ev, model.pow))
			is_new = insert_event_sorted(model.views.notifications.events, ev)

		if (is_new)
			handle_redraw_logic(model, 'notifications')
		break;

	case model.ids.home:
		if (should_add_to_timeline(ev))
			is_new = insert_event_sorted(model.views.home.events, ev)

		if (is_new)
			handle_redraw_logic(model, 'home')
		break;
	case model.ids.account:
		switch (ev.kind) {
		case 3:
			model.done_init[relay] = true
			model.pool.unsubscribe(model.ids.account, relay)
			send_home_filters(model, relay)
			break
		}
		break
	case model.ids.profiles:
		break
	}
}

function sanitize_obj(obj) {
	for (const key of Object.keys(obj)) {
		obj[key] = sanitize(obj[key])
	}

	return obj
}

function process_profile_event(model, ev) {
	const prev_ev = model.all_events[model.profile_events[ev.pubkey]]
	if (prev_ev && prev_ev.created_at > ev.created_at)
		return

	model.profile_events[ev.pubkey] = ev.id
	try {
		model.profiles[ev.pubkey] = sanitize_obj(JSON.parse(ev.content))
	} catch(e) {
		log_debug("failed to parse profile contents", ev)
	}
}

function send_initial_filters(account_id, pubkey, relay) {
	const filter = {authors: [pubkey], kinds: [3], limit: 1}
	//console.log("sending initial filter", filter)
	relay.subscribe(account_id, filter)
}

function send_home_filters(model, relay) {
	const ids = model.ids
	const friends = contacts_friend_list(model.contacts)
	friends.push(model.pubkey)

	const contacts_filter = {kinds: [0], authors: friends}
	const dms_filter = {kinds: [4], "#p": [ model.pubkey ], limit: 100}
	const our_dms_filter = {kinds: [4], authors: [ model.pubkey ], limit: 100}

	const standard_kinds = [1,42,5,6,7]

	const home_filter = {kinds: standard_kinds, authors: friends, limit: 500}

	// TODO: include pow+fof spam filtering in notifications query
	const notifications_filter = {kinds: standard_kinds, "#p": [model.pubkey], limit: 100}

	let home_filters = [home_filter]
	let notifications_filters = [notifications_filter]
	let contacts_filters = [contacts_filter]
	let dms_filters = [dms_filter, our_dms_filter]

	let last_of_kind = {}
	if (relay) {
		last_of_kind =
			model.last_event_of_kind[relay] =
			model.last_event_of_kind[relay] || calculate_last_of_kind(model.all_events)

		log_debug("last_of_kind", last_of_kind)
	}

        update_filters_with_since(last_of_kind, home_filters)
        update_filters_with_since(last_of_kind, contacts_filters)
        update_filters_with_since(last_of_kind, notifications_filters)
        update_filters_with_since(last_of_kind, dms_filters)

	const subto = relay? [relay] : undefined
	model.pool.subscribe(ids.home, home_filters, subto)
	model.pool.subscribe(ids.contacts, contacts_filters, subto)
	model.pool.subscribe(ids.notifications, notifications_filters, subto)
	model.pool.subscribe(ids.dms, dms_filters, subto)
}

function update_filter_with_since(last_of_kind, filter) {
	const kinds = filter.kinds || []
	let initial = null
	let earliest = kinds.reduce((earliest, kind) => {
		const last_created_at = last_of_kind[kind]
		let since = get_since_time(last_created_at)

		if (!earliest) {
			if (since === null)
				return null

			return since
		}

		if (since === null)
			return earliest

		return since < earliest ? since : earliest

	}, initial)

	if (earliest)
		filter.since = earliest
}

function update_filters_with_since(last_of_kind, filters) {
	for (const filter of filters) {
		update_filter_with_since(last_of_kind, filter)
	}
}

function contacts_friend_list(contacts) {
	return Array.from(contacts.friends)
}

function contacts_friendosphere(contacts) {
	let s = new Set()
	let fs = []

	for (const friend of contacts.friends.keys()) {
		fs.push(friend)
		s.add(friend)
	}

	for (const friend of contacts.friend_of_friends.keys()) {
		if (!s.has(friend))
			fs.push(friend)
	}

	return fs
}

function process_contact_event(model, ev) {
	load_our_contacts(model.contacts, model.pubkey, ev)
	load_our_relays(model.pubkey, model.pool, ev)
	add_contact_if_friend(model.contacts, ev)
}

function add_contact_if_friend(contacts, ev) {
	if (!contact_is_friend(contacts, ev.pubkey))
		return

	add_friend_contact(contacts, ev)
}

function contact_is_friend(contacts, pk) {
	return contacts.friends.has(pk)
}

function add_friend_contact(contacts, contact) {
	contacts.friends.add(contact.pubkey)

	for (const tag of contact.tags) {
		if (tag.length >= 2 && tag[0] == "p") {
			if (!contact_is_friend(contacts, tag[1]))
				contacts.friend_of_friends.add(tag[1])
		}
	}
}

function get_view_el(name)
{
	return DAMUS.view_el.querySelector(`#${name}-view`)
}

function change_url(name, opts = {}) {
	let pushStateUrl = `/${name}`;
	if (opts.pk) {
		pushStateUrl = `${pushStateUrl}/${opts.pk}`;
	}
	window.history.pushState({ page: name, opts }, '', pushStateUrl);
}

function navigate(name, pk) {
	if (name === 'profile') {
		show_profile(pk);
		change_url(name, { pk });
	} else {
		change_url(name);
	}


	switch_view(name);
}

function switch_view(name, opts={})
{
	// change_url(name, opts);
	if (name === DAMUS.current_view) {
		log_debug("Not switching to '%s', we are already there", name)
		return
	}

	const last = get_current_view()
	if (!last) {
		// render initial
		DAMUS.current_view = name
		redraw_timeline_events(DAMUS, name)
		return
	}

	log_debug("switching to '%s' by hiding '%s'", name, DAMUS.current_view)

	DAMUS.current_view = name
	const current = get_current_view()
	const last_el = get_view_el(last.name)
	const current_el = get_view_el(current.name)

	if (last_el)
		last_el.classList.add("hide");

	// TODO accomodate views that do not render events
	// TODO find out if having multiple event divs is slow
	//redraw_timeline_events(DAMUS, name)

	find_node("#nav > div[data-active]").dataset.active = name;

	if (current_el)
		current_el.classList.remove("hide");
}

function load_our_relays(our_pubkey, pool, ev) {
	if (ev.pubkey != our_pubkey)
		return

	let relays
	try {
		relays = JSON.parse(ev.content)
	} catch (e) {
		log_debug("error loading relays", e)
		return
	}

	for (const relay of Object.keys(relays)) {
		if (!pool.has(relay)) {
			log_debug("adding relay", relay)
			pool.add(relay)
		}
	}
}

function load_our_contacts(contacts, our_pubkey, ev) {
	if (ev.pubkey !== our_pubkey)
		return

	contacts.event = ev

	for (const tag of ev.tags) {
		if (tag.length > 1 && tag[0] === "p") {
			contacts.friends.add(tag[1])
		}
	}
}

function handle_profiles_loaded(ids, model, view, relay) {
	// stop asking for profiles
	model.pool.unsubscribe(ids.profiles, relay)

	//redraw_events(model, view)
	redraw_my_pfp(model)

	const prefix = difficulty_to_prefix(model.pow)
	const fofs = Array.from(model.contacts.friend_of_friends)
	const standard_kinds = [1,42,5,6,7]
	let pow_filter = {kinds: standard_kinds, limit: 50}
	if (model.pow > 0)
		pow_filter.ids = [ prefix ]

	let explore_filters = [ pow_filter ]

	if (fofs.length > 0) {
		explore_filters.push({kinds: standard_kinds, authors: fofs, limit: 50})
	}

	model.pool.subscribe(ids.explore, explore_filters, relay)
}

function redraw_my_pfp(model, force = false) {
	const p = model.profiles[model.pubkey]
	if (!p) return;
	const html = render_pfp(model.pubkey, p);
	const el = document.querySelector(".my-userpic")
	if (!force && el.dataset.loaded) return;
	el.dataset.loaded = true;
	el.innerHTML = html;
}

function debounce(f, interval) {
	let timer = null;
	let first = true;

	return (...args) => {
		clearTimeout(timer);
		return new Promise((resolve) => {
			timer = setTimeout(() => resolve(f(...args)), first? 0 : interval);
			first = false
		});
	};
}

// load profiles after comment notes are loaded
function handle_comments_loaded(ids, model, events, relay)
{
	const pubkeys = events.reduce((s, ev) => {
		s.add(ev.pubkey)
		for (const tag of ev.tags) {
			if (tag.length >= 2 && tag[0] === "p") {
				if (!model.profile_events[tag[1]])
					s.add(tag[1])
			}
		}
		return s
	}, new Set())
	const authors = Array.from(pubkeys)

	// load profiles and noticed chatrooms
	const profile_filter = {kinds: [0,3], authors: authors}

	let filters = []

	if (authors.length > 0)
		filters.push(profile_filter)

	if (filters.length === 0) {
		log_debug("No profiles filters to request...")
		return
	}

	//console.log("subscribe", profiles_id, filter, relay)
	log_debug("subscribing to profiles on %s", relay.url)
	model.pool.subscribe(ids.profiles, filters, relay)
}

function redraw_events(damus, view) {
	//log_debug("redrawing events for", view)
	view.rendered = new Set()

	const events_el = damus.view_el.querySelector(`#${view.name}-view > .events`)
	events_el.innerHTML = render_events(damus, view)
}

function redraw_timeline_events(damus, name) {
	const view = DAMUS.views[name]
	const events_el = damus.view_el.querySelector(`#${name}-view > .events`)

	if (view.events.length > 0) {
		redraw_events(damus, view)
	} else {
		events_el.innerHTML = render_loading_spinner()
	}
}

async function send_post() {
	const input_el = document.querySelector("#post-input")
	const cw_el = document.querySelector("#content-warning-input")

	const cw = cw_el.value
	const content = input_el.value
	const created_at = Math.floor(new Date().getTime() / 1000)
	const kind = 1
	const tags = cw ? [["content-warning", cw]] : []
	const pubkey = await get_pubkey()
	const {pool} = DAMUS

	let post = { pubkey, tags, content, created_at, kind }

	post.id = await nostrjs.calculate_id(post)
	post = await sign_event(post)

	pool.send(["EVENT", post])

	input_el.value = ""
	cw_el.value = ""
	post_input_changed(input_el)
}

async function sign_event(ev) {
	if (window.nostr && window.nostr.signEvent) {
		const signed = await window.nostr.signEvent(ev)
		if (typeof signed === 'string') {
			ev.sig = signed
			return ev
		}
		return signed
	}

	const privkey = get_privkey()
	ev.sig = await sign_id(privkey, ev.id)
	return ev
}

function determine_event_refs_positionally(pubkeys, ids)
{
	if (ids.length === 1)
		return {root: ids[0], reply: ids[0], pubkeys}
	else if (ids.length >= 2)
		return {root: ids[0], reply: ids[1], pubkeys}

	return {pubkeys}
}

function determine_event_refs(tags) {
	let positional_ids = []
	let pubkeys = []
	let root
	let reply
	let i = 0

	for (const tag of tags) {
		if (tag.length >= 4 && tag[0] == "e") {
			positional_ids.push(tag[1])
			if (tag[3] === "root") {
				root = tag[1]
			} else if (tag[3] === "reply") {
				reply = tag[1]
			}
		} else if (tag.length >= 2 && tag[0] == "e") {
			positional_ids.push(tag[1])
		} else if (tag.length >= 2 && tag[0] == "p") {
			pubkeys.push(tag[1])
		}

		i++
	}

	if (!(root && reply) && positional_ids.length > 0)
		return determine_event_refs_positionally(pubkeys, positional_ids)

	/*
	if (reply && !root)
		root = reply
		*/

	return {root, reply, pubkeys}
}

function* yield_etags(tags)
{
	for (const tag of tags) {
		if (tag.length >= 2 && tag[0] === "e")
			yield tag
	}
}

function expand_thread(id, reply_id) {
	const view = get_current_view()
	const root_id = get_thread_root_id(DAMUS, id)
	if (!root_id) {
		log_debug("could not get root_id for", DAMUS.all_events[id])
		return
	}

	view.expanded.add(reply_id)
	view.depths[root_id] = get_thread_max_depth(DAMUS, view, root_id) + 1

	redraw_events(DAMUS, view)
}

function get_thread_root_id(damus, id)
{
	const ev = damus.all_events[id]
	if (!ev) {
		log_debug("expand_thread: no event found?", id)
		return null
	}

	return ev.refs && ev.refs.root
}

function get_default_max_depth(damus, view)
{
	return view.max_depth || damus.max_depth
}

function get_thread_max_depth(damus, view, root_id)
{
	if (!view.depths[root_id])
		return get_default_max_depth(damus, view)

	return view.depths[root_id]
}

function delete_post_confirm(evid) {
	if (!confirm("Are you sure you want to delete this post?"))
		return

	const reason = (prompt("Why you are deleting this? Leave empty to not specify. Type CANCEL to cancel.") || "").trim()

	if (reason.toLowerCase() === "cancel")
		return

	delete_post(evid, reason)
}

function shouldnt_render_event(our_pk, view, ev, opts) {
	return !opts.is_composing &&
		!view.expanded.has(ev.id) &&
		view.rendered.has(ev.id)
}

function press_logout() {
	if (confirm("Are you sure you want to sign out?")) {
		localStorage.clear();
		const url = new URL(location.href)
		url.searchParams.delete("pk")
		window.location.href = url.toString()
	}
}

async function delete_post(id, reason)
{
	const ev = DAMUS.all_events[id]
	if (!ev)
		return

	const pubkey = await get_pubkey()
	let del = await create_deletion_event(pubkey, id, reason)
	console.log("deleting", ev)
	broadcast_event(del)
}

function get_reactions(model, evid)
{
	const reactions_set = model.reactions_to[evid]
	if (!reactions_set)
		return ""

	let reactions = []
	for (const id of reactions_set.keys()) {
		if (is_deleted(model, id))
			continue
		const reaction = model.all_events[id]
		if (!reaction)
			continue
		reactions.push(reaction)
	}

	const groups = reactions.reduce((grp, r) => {
		const e = get_reaction_emoji(r)
		grp[e] = grp[e] || {}
		grp[e][r.pubkey] = r
		return grp
	}, {})

	return groups
}

function close_reply() {
	const modal = document.querySelector("#reply-modal")
	modal.classList.add("closed");
}

function gather_reply_tags(pubkey, from) {
	let tags = []
	let ids = new Set()

	if (from.refs && from.refs.root) {
		tags.push(["e", from.refs.root, "", "root"])
		ids.add(from.refs.root)
	}

	tags.push(["e", from.id, "", "reply"])
	ids.add(from.id)

	for (const tag of from.tags) {
		if (tag.length >= 2) {
			if (tag[0] === "p" && tag[1] !== pubkey) {
				if (!ids.has(tag[1])) {
					tags.push(["p", tag[1]])
					ids.add(tag[1])
				}
			}
		}
	}
	if (from.pubkey !== pubkey && !ids.has(from.pubkey)) {
		tags.push(["p", from.pubkey])
	}
	return tags
}

async function create_deletion_event(pubkey, target, content="")
{
	const created_at = Math.floor(new Date().getTime() / 1000)
	let kind = 5

	const tags = [["e", target]]
	let del = { pubkey, tags, content, created_at, kind }

	del.id = await nostrjs.calculate_id(del)
	del = await sign_event(del)
	return del
}

async function create_reply(pubkey, content, from) {
	const tags = gather_reply_tags(pubkey, from)
	const created_at = Math.floor(new Date().getTime() / 1000)
	let kind = from.kind

	// convert emoji replies into reactions
	if (is_valid_reaction_content(content))
		kind = 7

	let reply = { pubkey, tags, content, created_at, kind }

	reply.id = await nostrjs.calculate_id(reply)
	reply = await sign_event(reply)
	return reply
}

function get_tag_event(tag)
{
	if (tag.length < 2)
		return null

	if (tag[0] === "e")
		return DAMUS.all_events[tag[1]]

	if (tag[0] === "p")
		return DAMUS.all_events[DAMUS.profile_events[tag[1]]]

	return null
}

async function broadcast_related_events(ev)
{
	ev.tags
		.reduce((evs, tag) => {
			// cap it at something sane
			if (evs.length >= 5)
				return evs
			const ev = get_tag_event(tag)
			if (!ev)
				return evs
			insert_event_sorted(evs, ev) // for uniqueness
			return evs
		}, [])
		.forEach((ev, i) => {
			// so we don't get rate limited
			setTimeout(() => {
				log_debug("broadcasting related event", ev)
				broadcast_event(ev)
			}, (i+1)*1200)
		})
}

function broadcast_event(ev) {
	DAMUS.pool.send(["EVENT", ev])
}

async function send_reply(content, replying_to)
{
	const ev = DAMUS.all_events[replying_to]
	if (!ev)
		return

	const pubkey = await get_pubkey()
	let reply = await create_reply(pubkey, content, ev)

	broadcast_event(reply)
	broadcast_related_events(reply)
}

async function do_send_reply() {
	const modal = document.querySelector("#reply-modal")
	const replying_to = modal.querySelector("#replying-to")

	const evid = replying_to.dataset.evid
	const reply_content_el = document.querySelector("#reply-content")
	const content = reply_content_el.value

	await send_reply(content, evid)

	reply_content_el.value = ""

	close_reply()
}

function get_local_state(key) {
	if (DAMUS[key] != null)
		return DAMUS[key]

	return localStorage.getItem(key)
}

function set_local_state(key, val) {
	DAMUS[key] = val
	localStorage.setItem(key, val)
}

function get_qs(loc=location.href) {
	return new URL(loc).searchParams
}

async function get_nip05_pubkey(email) {
	const [user, host] = email.split("@")
	const url = `https://${host}/.well-known/nostr.json?name=${user}`

	try {
		const res = await fetch(url)
		const json = await res.json()

		log_debug("nip05 data", json)
		return json.names[user]
	} catch (e) {
		log_error("fetching nip05 entry for %s", email, e)
		throw e
	}
}

async function handle_pubkey(pubkey) {
	if (pubkey[0] === "n")
		pubkey = bech32_decode(pubkey)

	if (pubkey.includes("@"))
		pubkey = await get_nip05_pubkey(pubkey)

	set_local_state('pubkey', pubkey)

	return pubkey
}

async function get_pubkey() {
	let pubkey = get_local_state('pubkey')

	// qs pk overrides stored key
	const qs_pk = get_qs().get("pk")
	if (qs_pk)
		return await handle_pubkey(qs_pk)

	if (pubkey)
		return pubkey

	console.log("window.nostr", window.nostr)
	if (window.nostr && window.nostr.getPublicKey) {
		console.log("calling window.nostr.getPublicKey()...")
		const pubkey = await window.nostr.getPublicKey()
		console.log("got %s pubkey from nos2x", pubkey)
		return await handle_pubkey(pubkey)
	}

	pubkey = prompt("Enter nostr id (eg: jb55@jb55.com) or pubkey (hex or npub)")

	if (!pubkey)
		throw new Error("Need pubkey to continue")

	return await handle_pubkey(pubkey)
}

function get_privkey() {
	let privkey = get_local_state('privkey')

	if (privkey)
		return privkey

	if (!privkey)
		privkey = prompt("Enter private key")

	if (!privkey)
		throw new Error("can't get privkey")

	if (privkey[0] === "n") {
		privkey = bech32_decode(privkey)
	}

	set_local_state('privkey', privkey)

	return privkey
}

async function sign_id(privkey, id)
{
	//const digest = nostrjs.hex_decode(id)
	const sig = await nobleSecp256k1.schnorr.sign(id, privkey)
	return nostrjs.hex_encode(sig)
}

function reply_to(evid) {
	const modal = document.querySelector("#reply-modal")
	const replybox = modal.querySelector("#reply-content")
	modal.classList.remove("closed")
	const replying_to = modal.querySelector("#replying-to")

	replying_to.dataset.evid = evid

	const ev = DAMUS.all_events[evid]
	const view = get_current_view()
	replying_to.innerHTML = render_event(DAMUS, view, ev, {is_composing: true, nobar: true, max_depth: 1})

	replybox.focus()
}

function convert_quote_blocks(content, show_media)
{
	const split = content.split("\n")
	let blockin = false
	return split.reduce((str, line) => {
		if (line !== "" && line[0] === '>') {
			if (!blockin) {
				str += "<span class='quote'>"
				blockin = true
			}
			str += linkify(sanitize(line.slice(1)), show_media)
		} else {
			if (blockin) {
				blockin = false
				str += "</span>"
			}
			str += linkify(sanitize(line), show_media)
		}
		return str + "<br/>"
	}, "")
}

function get_content_warning(tags)
{
	for (const tag of tags) {
		if (tag.length >= 1 && tag[0] === "content-warning")
			return sanitize(tag[1]) || ""
	}

	return null
}

function toggle_content_warning(el)
{
	const id = el.id.split("_")[1]
	const ev = DAMUS.all_events[id]

	if (!ev) {
		log_debug("could not find content-warning event", id)
		return
	}

	DAMUS.cw_open[id] = el.open
}

function format_content(ev, show_media)
{
	if (ev.kind === 7) {
		if (ev.content === "" || ev.content === "+")
			return "❤️"
		return sanitize(ev.content.trim())
	}

	const content = ev.content.trim()
	const body = convert_quote_blocks(content, show_media)

	let cw = get_content_warning(ev.tags)
	if (cw !== null) {
		let cwHTML = "Content Warning"
		if (cw === "") {
			cwHTML += "."
		} else {
			cwHTML += `: "<span>${cw}</span>".`
		}
		const open = !!DAMUS.cw_open[ev.id]? "open" : ""
		return `
		<details ontoggle="toggle_content_warning(this)" class="cw" id="cw_${ev.id}" ${open}>
		  <summary class="event-message">${cwHTML}</summary>
		  ${body}
		</details>
		`
	}

	return body
}

function sanitize(content)
{
	if (!content)
		return ""
	return DOMPurify.sanitize(content)
}

function robohash(pk) {
	return "https://robohash.org/" + pk
}

function get_picture(pk, profile) {
	if (!profile)
		return robohash(pk)
	if (profile.resolved_picture)
		return profile.resolved_picture
	profile.resolved_picture = profile.picture || robohash(pk)
	return profile.resolved_picture
}

function passes_spam_filter(contacts, ev, pow)
{
	if (contacts.friend_of_friends.has(ev.pubkey))
		return true

	return ev.pow >= pow
}

