
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
		rendered: {},
		all_events: {},
		events: [],
		profiles: {},
		last_event_of_kind: {},
		contacts: init_contacts()
	}
}

async function damus_web_init()
{
	const {RelayPool} = nostrjs
	const pool = RelayPool(["wss://relay.damus.io"])
	const now = (new Date().getTime()) / 1000
	const model = init_home_model()
	DSTATE = model

	const ids = {
		comments: "comments",//uuidv4(),
		profiles: "profiles",//uuidv4(),
		account: "account",//uuidv4(),
		home: "home",//uuidv4(),
		contacts: "contacts",//uuidv4(),
		notifications: "notifications",//uuidv4(),
		dms: "dms",//uuidv4(),
	}

	model.pubkey = get_pubkey()
	if (!model.pubkey)
		return
	model.pool = pool
	model.view_el = document.querySelector("#view")
	redraw_home_view(model)

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

function process_event(ev)
{
	ev.refs = determine_event_refs(ev.tags)
}

let rerender_home_timer
function handle_home_event(ids, model, relay, sub_id, ev) {
	model.all_events[ev.id] = ev

	switch (sub_id) {
	case ids.home:
		if (ev.content !== "") {
			process_event(ev)
			insert_event_sorted(model.events, ev)
		}
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
	console.log("subscribe", profiles_id, filter, relay)
	model.pool.subscribe(profiles_id, filter, relay)
}

function redraw_events(model) {
	log_debug("rendering home view")
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
	const pubkey = get_pubkey()
	const privkey = get_privkey()
	const {pool} = DSTATE

	let post = { pubkey, tags, content, created_at, kind }

	post.id = await nostrjs.calculate_id(post)
	post.sig = await sign_id(privkey, post.id)

	pool.send(["EVENT", post])
}

function render_home_view(model) {
	return `
	<div id="newpost">
		<input placeholder="What's on your mind?" id="post-input" type="text"></input>
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

function render_event(model, ev, opts={}) {
	if (!opts.is_composing && model.rendered[ev.id])
		return ""
	model.rendered[ev.id] = true
	const profile = model.profiles[ev.pubkey] || {
		name: "anon",
		display_name: "Anonymous",
	}
	const delta = time_delta(new Date().getTime(), ev.created_at*1000)
	const pk = ev.pubkey
	const bar = opts.nobar? "" : render_action_bar(ev) 

	let replying_to = ""
	let reply_line_top = ""

	const has_bot_line = opts.is_reply 

	if (ev.refs && ev.refs.reply) {
		const reply_ev = model.all_events[ev.refs.reply]
		if (reply_ev) {
			opts.replies = opts.replies == null ? 1 : opts.replies + 1
			opts.is_reply = true
			replying_to = render_event(model, reply_ev, opts)
			reply_line_top = render_reply_line_top()
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
			<img class="pfp" onerror="this.onerror=null;this.src='${robohash(pk)}';" src="${get_picture(pk, profile)}">
			${reply_line_bot}
		</div>
		<p>
		${format_content(ev.content)}

		${bar}
		</p>
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

async function create_reply(privkey, pubkey, content, from) {
	const tags = gather_reply_tags(pubkey, from)
	const created_at = Math.floor(new Date().getTime() / 1000)
	const kind = from.kind

	let reply = { pubkey, tags, content, created_at, kind }

	reply.id = await nostrjs.calculate_id(reply)
	reply.sig = await sign_id(privkey, reply.id)

	return reply
}

async function send_reply() {
	const modal = document.querySelector("#reply-modal")
	const replying_to = modal.querySelector("#replying-to")
	const evid = replying_to.dataset.evid
	const ev = DSTATE.all_events[evid]

	const { pool } = DSTATE
	const content = document.querySelector("#reply-content").value
	const pubkey = get_pubkey()
	const privkey = get_privkey()

	let reply = await create_reply(privkey, pubkey, content, ev)
	pool.send(["EVENT", reply])

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

function get_pubkey() {
	let pubkey = get_local_state('pubkey')

	if (pubkey)
		return pubkey

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
	replying_to.innerHTML = render_event(DSTATE, ev, {is_composing: true, nobar: true})

	modal.style.display = replying? "block" : "none";
}

function render_action_bar(ev) {
	return `
	<a href="javascript:reply_to('${ev.id}')">reply</a>
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

function format_content(content)
{
	return convert_quote_blocks(content)
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

function get_picture(pk, profile)
{
	return sanitize(profile.picture) || robohash(pk)
}

function render_name(pk, profile={})
{
	const display_name = profile.display_name || profile.user
	const username = profile.name || "anon"
	const name = display_name || username

	return `<div class="username">${sanitize(name)}</div>`
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
