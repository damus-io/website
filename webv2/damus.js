
let DSTATE

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
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

function init_home_model() {
	return {
		done_init: false,
		loading: true,
		notifications: 0,
		rendered: {},
		all_events: {},
		reactions_to: {},
		events: [],
		profiles: {},
		last_event_of_kind: {},
		contacts: init_contacts()
	}
}

const BOOTSTRAP_RELAYS = [
	"wss://relay.damus.io",
	"wss://nostr-relay.wlvs.space",
	"wss://nostr-pub.wellorder.net"
]

function update_favicon(path)
{
	let link = document.querySelector("link[rel~='icon']");
	let link_mask = document.querySelector("link[rel~='mask-icon']");
	const head = document.getElementsByTagName('head')[0]

	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		head.appendChild(link);
	}

	if (!link_mask) {
		link_mask = document.createElement('link');
		link_mask.rel = 'mask-icon';
		head.appendChild(link_mask);
	}

	link.href = path;
	link_mask.href = path;
}

function update_title(model) {
	if (document.visibilityState === 'visible')
		model.notifications = 0
	if (model.notifications === 0) {
		document.title = "Damus"
		update_favicon("img/damus.svg")
	} else {
		document.title = `(${model.notifications}) Damus`
		update_favicon("img/damus_notif.svg")
	}
}

async function damus_web_init()
{
	const model = init_home_model()
	DSTATE = model
	model.pubkey = await get_pubkey()
	if (!model.pubkey)
		return
	const {RelayPool} = nostrjs
	const pool = RelayPool(BOOTSTRAP_RELAYS)
	const now = (new Date().getTime()) / 1000

	const ids = {
		comments: "comments",//uuidv4(),
		profiles: "profiles",//uuidv4(),
		account: "account",//uuidv4(),
		home: "home",//uuidv4(),
		contacts: "contacts",//uuidv4(),
		notifications: "notifications",//uuidv4(),
		dms: "dms",//uuidv4(),
	}

	model.pool = pool
	model.view_el = document.querySelector("#view")
	redraw_home_view(model)

	document.addEventListener('visibilitychange', () => {
		update_title(model)
	})

	pool.on('open', (relay) => {
		//let authors = followers
		// TODO: fetch contact list
		log_debug("relay connected", relay.url)
		
		if (!model.done_init) {
			model.loading = false

			send_initial_filters(ids.account, model.pubkey, relay)
		} else {
			send_home_filters(ids, model, relay)
		}
		//relay.subscribe(comments_id, {kinds: [1,42], limit: 100})
	});

	pool.on('event', (relay, sub_id, ev) => {
		handle_home_event(ids, model, relay, sub_id, ev)
	})

	pool.on('eose', async (relay, sub_id) => {
		if (sub_id === ids.home) {
			handle_comments_loaded(ids.profiles, model, relay)
		} else if (sub_id === ids.profiles) {
			handle_profiles_loaded(ids.profiles, model, relay)
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

function process_event(model, ev)
{
	ev.refs = determine_event_refs(ev.tags)
	const notified = was_pubkey_notified(model.pubkey, ev)
	ev.notified = notified

	if (ev.kind === 7)
		process_reaction_event(model, ev)

	const last_notified = get_local_state('last_notified_date')
	if (notified && (last_notified == null || ((ev.created_at*1000) > last_notified))) {
		set_local_state('last_notified_date', new Date().getTime())
		model.notifications++
		update_title(model)
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

function should_add_to_home(ev)
{
	return ev.kind === 1 || ev.kind === 42
}

let rerender_home_timer
function handle_home_event(ids, model, relay, sub_id, ev) {
	model.all_events[ev.id] = ev

	switch (sub_id) {
	case ids.home:
		process_event(model, ev)

		if (should_add_to_home(ev))
			insert_event_sorted(model.events, ev)

		if (model.realtime) {
			if (rerender_home_timer)
				clearTimeout(rerender_home_timer)
			rerender_home_timer = setTimeout(redraw_events.bind(null, model), 500)
		}
		break;
	case ids.account:
		switch (ev.kind) {
		case 3:
			model.loading = false
			process_contact_event(model, ev)
			model.done_init = true
			model.pool.unsubscribe(ids.account, [relay])
			break
		case 0:
			handle_profile_event(model, ev)
			break
		}
	case ids.profiles:
		try {
			model.profiles[ev.pubkey] = JSON.parse(ev.content)
		} catch {
			console.log("failed to parse", ev.content)
		}
	}
}

function handle_profile_event(model, ev) {
	console.log("PROFILE", ev)
}

function send_initial_filters(account_id, pubkey, relay) {
	const filter = {authors: [pubkey], kinds: [3], limit: 1}
	//console.log("sending initial filter", filter)
	relay.subscribe(account_id, filter)
}

function send_home_filters(ids, model, relay) {
	const friends = contacts_friend_list(model.contacts)
	friends.push(model.pubkey)

	const contacts_filter = {kinds: [0], authors: friends}
	const dms_filter = {kinds: [4], limit: 500}
	const our_dms_filter = {kinds: [4], authors: [ model.pubkey ], limit: 500}
	const home_filter = {kinds: [1,42,6,7], authors: friends, limit: 500}
	const notifications_filter = {kinds: [1,42,6,7], "#p": [model.pubkey], limit: 100}

	let home_filters = [home_filter]
	let notifications_filters = [notifications_filter]
	let contacts_filters = [contacts_filter]
	let dms_filters = [dms_filter, our_dms_filter]

	let last_of_kind = {}
	if (relay) {
		last_of_kind =
			model.last_event_of_kind[relay] =
			model.last_event_of_kind[relay] || {}
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

function get_since_time(last_event) {
	if (!last_event) {
		return null
	}

	return last_event.created_at - 60 * 10
}

function update_filter_with_since(last_of_kind, filter) {
	const kinds = filter.kinds || []
	let initial = null
	let earliest = kinds.reduce((earliest, kind) => {
		const last = last_of_kind[kind]
		let since = get_since_time(last) 

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

function process_contact_event(model, ev) {
	load_our_contacts(model.contacts, model.pubkey, ev)
	load_our_relays(model.pubkey, model.pool, ev)
	add_contact_if_friend(model.contacts, ev)
}

function add_contact_if_friend(contacts, ev) {
	if (!contact_is_friend(contacts, ev.pubkey)) {
		return
	}

	add_friend_contact(contacts, ev)
}

function contact_is_friend(contacts, pk) {
	return contacts.friends.has(pk)
}

function add_friend_contact(contacts, contact) {
	contacts.friends[contact.pubkey] = true

        for (const tag of contact.tags) {
            if (tag.count >= 2 && tag[0] == "p") {
                contacts.friend_of_friends.add(tag[1])
            }
        }
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
		log_debug("adding relay", relay)
		if (!pool.has(relay))
			pool.add(relay)
	}
}

function log_debug(fmt, ...args) {
	console.log("[debug] " + fmt, ...args)
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

function handle_profiles_loaded(profiles_id, model, relay) {
	// stop asking for profiles
	model.pool.unsubscribe(profiles_id, relay)
	model.realtime = true

	redraw_events(model)
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
function handle_comments_loaded(profiles_id, model, relay)
{
	const pubkeys = model.events.reduce((s, ev) => {
		s.add(ev.pubkey)
		return s
	}, new Set())
	const authors = Array.from(pubkeys)

	// load profiles
	const filter = {kinds: [0], authors: authors}
	//console.log("subscribe", profiles_id, filter, relay)
	model.pool.subscribe(profiles_id, filter, relay)
}

function redraw_events(model) {
	//log_debug("rendering home view")
	model.rendered = {}
	model.events_el.innerHTML = render_events(model)
}

function redraw_home_view(model) {
	model.view_el.innerHTML = render_home_view(model)
	model.events_el = document.querySelector("#events")
	if (model.events.length > 0) 
		redraw_events(model)
	else
		model.events_el.innerText = "Loading..."
}

async function send_post() {
	const input_el = document.querySelector("#post-input")

	const content = input_el.value
	const created_at = Math.floor(new Date().getTime() / 1000)
	const kind = 1
	const tags = []
	const pubkey = await get_pubkey()
	const {pool} = DSTATE

	let post = { pubkey, tags, content, created_at, kind }

	post.id = await nostrjs.calculate_id(post)
	post = await sign_event(post)

	pool.send(["EVENT", post])

	input_el.value = ""
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

function render_home_view(model) {
	return `
	<div id="newpost">
		<textarea placeholder="What's on your mind?" id="post-input"></textarea>
		<button onclick="send_post(this)" id="post-button">Post</button>
	</div>
	<div id="events">
	</div>
	`
}

function render_events(model) {
	return model.events.map((ev) => render_event(model, ev)).join("\n")
}

function determine_event_refs_positionally(ids)
{
	if (ids.length === 1)
		return {reply: ids[0]}
	else if (ids.length === 2)
		return {root: ids[0], reply: ids[1]}

	return {}
}

function determine_event_refs(tags) {
	let positional_ids = []
	let root
	let reply
	let i = 0

	for (const tag of tags) {
		if (tag.length >= 4 && tag[0] == "e") {
			if (tag[3] === "root")
				root = tag[1]
			else if (tag[3] === "reply")
				reply = tag[1]

			// we found both a root and a reply, we're done
			if (root !== undefined && reply !== undefined)
				break
		} else if (tag.length >= 2 && tag[0] == "e") {
			positional_ids.push(tag[1])
		}

		i++
	}

	if (!root && !reply && positional_ids.length > 0)
		return determine_event_refs_positionally(positional_ids)

	return {root, reply}
}

function render_reply_line_top() {
	return `<div class="line-top"></div>`
}

function render_reply_line_bot() {
	return `<div class="line-bot"></div>`
}

function can_reply(ev) {
	return ev.kind === 1 || ev.kind === 42
}

const DEFAULT_PROFILE = {
	name: "anon",
	display_name: "Anonymous",
}

function render_event(model, ev, opts={}) {
	if (!opts.is_composing && model.rendered[ev.id])
		return ""
	model.rendered[ev.id] = true
	const profile = model.profiles[ev.pubkey] || DEFAULT_PROFILE
	const delta = time_delta(new Date().getTime(), ev.created_at*1000)
	const bar = !can_reply(ev) || opts.nobar? "" : render_action_bar(ev) 

	let replying_to = ""
	let reply_line_top = ""

	const has_bot_line = opts.is_reply 

	if (ev.refs && ev.refs.reply) {
		const reply_ev = model.all_events[ev.refs.reply]
		if (reply_ev) {
			opts.replies = opts.replies == null ? 1 : opts.replies + 1
			opts.is_reply = true
			if (opts.max_depth == null || opts.replies < opts.max_depth) {
				replying_to = render_event(model, reply_ev, opts)
				reply_line_top = render_reply_line_top()
			}
		}
	}

	const reply_line_bot = (has_bot_line && render_reply_line_bot()) || ""

	return `
	${replying_to}
	<div id="ev${ev.id}" class="comment">
		<div class="info">
			${render_name(ev.pubkey, profile)}
			<span>${delta}</span>
		</div>
		<div class="pfpbox">
			${reply_line_top}
			${render_pfp(ev.pubkey, profile)}
			${reply_line_bot}
		</div>
		<div class="comment-body">
			<p>
			${format_content(ev)}
			</p>
			${render_reactions(model, ev)}
			${bar}
		</div>
	</div>
	`
}

function render_pfp(pk, profile, size="normal") {
	const name = render_name_plain(pk, profile)
	return `<img title="${name}" class="pfp pfp-${size}" onerror="this.onerror=null;this.src='${robohash(pk)}';" src="${get_picture(pk, profile)}">`
}

const REACTION_REGEX = /^[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC3\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC08\uDC26](?:\u200D\u2B1B)?|[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF-\uDDB3\uDDBC\uDDBD]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)$/

function is_emoji(str) 
{
	return REACTION_REGEX.test(str)
}

function is_valid_reaction_content(content)
{
	return content === "+" || content === "" || is_emoji(content)
}

function get_reaction_emoji(ev) {
	if (ev.content === "+" || ev.content === "")
		return "❤️"

	return ev.content
}

function render_reaction_group(model, emoji, reactions, reacting_to) {
	const pfps = Object.keys(reactions).map((pk) => render_reaction(model, reactions[pk]))

	let onclick = ""
	let classes = ""
	if (!reactions[model.pubkey]) {
		onclick = `onclick="send_reply('${emoji}', '${reacting_to.id}')"`
		classes = "can-react"
	}

	return `
	<span ${onclick} class="reaction-group ${classes}">
	  <span class="reaction-emoji">
	  ${emoji}
	  </span>
	  ${pfps.join("\n")}
	</span>
	`
}

function render_reaction(model, reaction) {
	const profile = model.profiles[reaction.pubkey] || DEFAULT_PROFILE
	let emoji = reaction.content[0]
	if (reaction.content === "+" || reaction.content === "")
		emoji = "❤️"

	return render_pfp(reaction.pubkey, profile, "small")
}

function render_reactions(model, ev) {
	const reactions_set = model.reactions_to[ev.id]
	if (!reactions_set)
		return ""

	let reactions = []
	for (const id of reactions_set.keys()) {
		const reaction = model.all_events[id]
		if (!reaction)
			continue
		reactions.push(reaction)
	}

	let str = ""
	const groups = reactions.reduce((grp, r) => {
		const e = get_reaction_emoji(r)
		grp[e] = grp[e] || {}
		grp[e][r.pubkey] = r
		return grp
	}, {})

	for (const emoji of Object.keys(groups)) {
		str += render_reaction_group(model, emoji, groups[emoji], ev)
	}

	return `
	<div class="reactions">
	  ${str}
	</div>
	`
}

function close_reply() {
	const modal = document.querySelector("#reply-modal")
	modal.style.display = "none";
}

function gather_reply_tags(pubkey, from) {
	let tags = []
	for (const tag of from.tags) {
		if (tag.length >= 2) {
			if (tag[0] === "e") {
				tags.push(tag)
			} else if (tag[0] === "p" && tag[1] !== pubkey) {
				tags.push(tag)
			}
		}
	}
	tags.push(["e", from.id, "", "reply"])
	if (from.pubkey !== pubkey)
		tags.push(["p", from.pubkey])
	return tags
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

async function send_reply(content, replying_to)
{
	const ev = DSTATE.all_events[replying_to]
	if (!ev)
		return

	const pubkey = await get_pubkey()
	let reply = await create_reply(pubkey, content, ev)
	DSTATE.pool.send(["EVENT", reply])
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

function bech32_decode(pubkey) {
	const decoded = bech32.decode(pubkey)
	const bytes = fromWords(decoded.words)
	return nostrjs.hex_encode(bytes)
}

function get_local_state(key) {
	if (DSTATE[key] != null)
		return DSTATE[key]

	return localStorage.getItem(key)
}

function set_local_state(key, val) {
	DSTATE[key] = val
	localStorage.setItem(key, val)
}

async function get_pubkey() {
	let pubkey = get_local_state('pubkey')

	if (pubkey)
		return pubkey

	if (window.nostr && window.nostr.getPublicKey) {
		const pubkey = await window.nostr.getPublicKey()
		console.log("got %s pubkey from nos2x", pubkey)
		return pubkey
	}

	pubkey = prompt("Enter pubkey (hex or npub)")

	if (!pubkey)
		throw new Error("Need pubkey to continue")

	if (pubkey[0] === "n")
		pubkey = bech32_decode(pubkey)

	set_local_state('pubkey', pubkey)
	return pubkey
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
	const replying = modal.style.display === "none";
	const replying_to = modal.querySelector("#replying-to")

	replying_to.dataset.evid = evid
	const ev = DSTATE.all_events[evid]
	replying_to.innerHTML = render_event(DSTATE, ev, {is_composing: true, nobar: true, max_depth: 2})

	modal.style.display = replying? "block" : "none";
}

function render_action_bar(ev) {
	return `
	<div class="action-bar">
		<a href="javascript:reply_to('${ev.id}')">reply</a>
	</div>
	`
}

function convert_quote_blocks(content)
{
	const split = content.split("\n")
	let blockin = false
	return split.reduce((str, line) => {
		if (line !== "" && line[0] === '>') {
			if (!blockin) {
				str += "<span class='quote'>"
				blockin = true
			}
			str += sanitize(line.slice(1))
		} else {
			if (blockin) {
				blockin = false
				str += "</span>"
			}
			str += sanitize(line)
		}
		return str + "<br/>"
	}, "")
}

function format_content(ev)
{
	if (ev.kind === 7) {
		if (ev.content === "" || ev.content === "+")
			return "❤️"
		return sanitize(ev.content)
	}

	return convert_quote_blocks(ev.content)
}

function sanitize(content)
{
	if (!content)
		return ""
	return content.replaceAll("<","&lt;").replaceAll(">","&gt;")
}

function robohash(pk) {
	return "https://robohash.org/" + pk
}

function get_picture(pk, profile) {
	if (profile.resolved_picture)
		return profile.resolved_picture
	profile.resolved_picture = sanitize(profile.picture) || robohash(pk)
	return profile.resolved_picture
}

function render_name_plain(pk, profile)
{
	if (profile.sanitized_name)
		return profile.sanitized_name
	const display_name = profile.display_name || profile.user
	const username = profile.name || "anon"
	const name = display_name || username
	profile.sanitized_name = sanitize(name)
	return profile.sanitized_name
}

function render_name(pk, profile) {
	return `<div class="username">${render_name_plain(pk, profile)}</div>`
}

function time_delta(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
