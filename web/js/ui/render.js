// This file contains all methods related to rendering UI elements. Rendering
// is done by simple string manipulations & templates. If you need to write
// loops simply write it in code and return strings.

function render_timeline_event(damus, view, ev)
{
	const root_id = get_thread_root_id(damus, ev.id)
	const max_depth = root_id ? get_thread_max_depth(damus, view, root_id) : get_default_max_depth(damus, view)

	if (ev.refs && ev.refs.root && view.expanded.has(ev.refs.root))
		max_depth = null

	return render_event(damus, view, ev, {max_depth})
}

function render_events(damus, view) {
	log_debug("rendering events")
	return view.events
		.filter((ev, i) => i < 140)
		.map((ev) => render_timeline_event(damus, view, ev)).join("\n")
}

function render_reply_line_top(has_top_line) {
	const classes = has_top_line ? "" : "invisible"
	return html`<div class="line-top ${classes}"></div>`
}

function render_reply_line_bot() {
	return html`<div class="line-bot"></div>`
}

function render_thread_collapsed(model, ev, opts)
{
	if (opts.is_composing)
		return ""
	return html`<div onclick="expand_thread('${ev.id}')" class="thread-collapsed">
		<div class="thread-summary clickable event-message">
			Read More  
			<img class="icon svg small" src="icon/read-more.svg"/>
		</div>
	</div>`
}

function render_replied_events(damus, view, ev, opts)
{
	if (!(ev.refs && ev.refs.reply))
		return ""

	const reply_ev = damus.all_events[ev.refs.reply]
	if (!reply_ev)
		return ""

	opts.replies = opts.replies == null ? 1 : opts.replies + 1
	if (!(opts.max_depth == null || opts.replies < opts.max_depth))
		return render_thread_collapsed(damus, ev, opts)

	opts.is_reply = true
	return render_event(damus, view, reply_ev, opts)
}

function render_replying_to_chat(damus, ev) {
	const chatroom = (ev.refs.root && damus.chatrooms[ev.refs.root]) || {}
	const roomname = chatroom.name || ev.refs.root || "??"
	const pks = ev.refs.pubkeys || []
	const names = pks.map(pk => render_mentioned_name(pk, damus.profiles[pk])).join(", ")
	const to_users = pks.length === 0 ? "" : ` to ${names}`

	return html`<div class="replying-to">replying${to_users} in <span class="chatroom-name">${roomname}</span></div>`
}

function render_replying_to(model, ev) {
	if (!(ev.refs && ev.refs.reply))
		return ""

	if (ev.kind === 42)
		return render_replying_to_chat(model, ev)

	let pubkeys = ev.refs.pubkeys || []
	if (pubkeys.length === 0 && ev.refs.reply) {
		const replying_to = model.all_events[ev.refs.reply]
		if (!replying_to)
			return html`<div class="replying-to small-txt">reply to ${ev.refs.reply}</div>`

		pubkeys = [replying_to.pubkey]
	}

	const names = ev.refs.pubkeys.map(pk => render_mentioned_name(pk, model.profiles[pk])).join(", ")

	return html`
	<span class="replying-to small-txt">
		replying to $${names}
	</span>
	`
}

function render_unknown_event(damus, ev) {
	return "Unknown event " + ev.kind
}

function render_share(damus, view, ev, opts) {
	//todo validate content
	const shared_ev = damus.all_events[ev.refs && ev.refs.root]
	// share isn't resolved yet. that's ok, we can render this when we have
	// the event
	if (!shared_ev)
		return ""
	
	opts.shared = {
		pubkey: ev.pubkey,
		profile: damus.profiles[ev.pubkey]
	}
	return render_event(damus, view, shared_ev, opts)
}

function render_comment_body(damus, ev, opts) {
	const can_delete = damus.pubkey === ev.pubkey;
	const bar = !can_reply(ev) || opts.nobar? "" : render_action_bar(damus, ev, can_delete)
	const show_media = !opts.is_composing

	return html`
	<div>
	$${render_replying_to(damus, ev)}
	$${render_shared_by(ev, opts)}
	</div>
	<p>
	$${format_content(ev, show_media)}
	</p>
	$${render_reactions(damus, ev)}
	$${bar}
	`
}

function render_shared_by(ev, opts) {
	const b = opts.shared
	if (!b) {
		return ""
	}
	return html`
	<div class="shared-by">
		Shared by $${render_name(b.pubkey, b.profile)}
	</div>
	`
}

function render_deleted_comment_body(ev, deleted) {
	if (deleted.content) {
		return html`
		<div class="deleted-comment event-message">
			This content was deleted with reason: 	
			<div class="quote">${format_content(deleted, false)}</div>
		</div>
		`
	}
	return html`
	<div class="deleted-comment event-message">
		This content was deleted.
	</div>
	`
}

function render_event(damus, view, ev, opts={}) {
	if (ev.kind === 6)
		return render_share(damus, view, ev, opts)
	if (shouldnt_render_event(damus.pubkey, view, ev, opts))
		return ""

	view.rendered.add(ev.id)

	const profile = damus.profiles[ev.pubkey]
	const delta = time_delta(new Date().getTime(), ev.created_at*1000)

	const has_bot_line = opts.is_reply
	const reply_line_bot = (has_bot_line && render_reply_line_bot()) || ""

	const deleted = is_deleted(damus, ev.id)
	if (deleted && !opts.is_reply)
		return ""

	const replied_events = render_replied_events(damus, view, ev, opts)

	let name = ""
	if (!deleted) {
		name = render_name_plain(profile)
	}

	const has_top_line = replied_events !== ""
	const border_bottom = opts.is_composing || has_bot_line ? "" : "bottom-border";
	return html`
	$${replied_events}
	<div id="ev${ev.id}" class="event ${border_bottom}">
		<div class="userpic">
			$${render_reply_line_top(has_top_line)}
			$${deleted ? render_deleted_pfp() : render_pfp(ev.pubkey, profile)}
			$${reply_line_bot}
		</div>	
		<div class="event-content">
			<div class="info">
				$${render_name(ev.pubkey, profile)}
				<span class="timestamp">${delta}</span>
				<button class="icon" title="View Thread" role="view-event" data-eid="${ev.id}" onclick="click_event(this)">
					<img class="icon svg small" src="icon/open-thread.svg"/>
				</button>
			</div>
			<div class="comment">
				$${deleted ? render_deleted_comment_body(ev, deleted) : render_comment_body(damus, ev, opts)}
			</div>
		</div>
	</div>
	`
}

function render_react_onclick(our_pubkey, reacting_to, emoji, reactions) {
	const reaction = reactions[our_pubkey]
	if (!reaction) {
		return html`onclick="send_reply('${emoji}', '${reacting_to}')"`
	} else {
		return html`onclick="delete_post('${reaction.id}')"`
	}
}

function render_reaction_group(model, emoji, reactions, reacting_to) {
	const pfps = Object.keys(reactions).map((pk) => render_reaction(model, reactions[pk]))

	let onclick = render_react_onclick(model.pubkey, reacting_to.id, emoji, reactions)

	return html`
	<span $${onclick} class="reaction-group clickable">
	  <span class="reaction-emoji">
	  ${emoji}
	  </span>
	  $${pfps.join("\n")}
	</span>
	`
}

function render_reaction(model, reaction) {
	const profile = model.profiles[reaction.pubkey]
	let emoji = reaction.content[0]
	if (reaction.content === "+" || reaction.content === "")
		emoji = "❤️"

	return render_pfp(reaction.pubkey, profile)
}

function render_action_bar(damus, ev, can_delete) {
	let delete_html = ""
	if (can_delete)
		delete_html = html`
	<button class="icon" title="Delete" onclick="delete_post_confirm('${ev.id}')">
		<img class="icon svg small" src="icon/event-delete.svg"/>
	</button>`

	const groups = get_reactions(damus, ev.id)
	const like = "❤️"
	const likes = groups[like] || {}
	const react_onclick = render_react_onclick(damus.pubkey, ev.id, like, likes)
	return html`
	<div class="action-bar">
		<button class="icon" title="Reply" onclick="reply_to('${ev.id}')">
			<img class="icon svg small" src="icon/event-reply.svg"/>
		</button>
		<button class="icon react heart" $${react_onclick} title="Like">
			<img class="icon svg small" src="icon/event-like.svg"/>
		</button>
		<!--<button class="icon" title="Share" onclick=""><i class="fa fa-fw fa-link"></i></a>-->
		$${delete_html}	
		<!--<button class="icon" title="View raw Nostr event." onclick=""><i class="fa-solid fa-fw fa-code"></i></a>-->
	</div>
	`
}

function render_reactions(model, ev) {
	const groups = get_reactions(model, ev.id)
	let str = ""

	for (const emoji of Object.keys(groups)) {
		str += render_reaction_group(model, emoji, groups[emoji], ev)
	}

	return html`
	<div class="reactions">
	  $${str}
	</div>
	`
}

// Utility Methods

/* render_name_plain takes in a profile and tries it's best to return a string
 * that is best suited for the profile.
 */
function render_name_plain(profile=DEFAULT_PROFILE) {
	const display_name = profile.display_name || profile.user
	const username = profile.name || "anon"
	const name = display_name || username

	return profile.name
}

function render_pubkey(pk)
{
	return pk.slice(-8)
}

function render_username(pk, profile)
{
	return (profile && profile.name) || render_pubkey(pk)
}

function render_mentioned_name(pk, profile) {
	return render_name(pk, profile, "@");
	//return `<span class="username">@${render_username(pk, profile)}</span>`
}

function render_name(pk, profile, prefix="") {
	return html`
	<span class="username clickable" onclick="show_profile('${pk}')" 
		data-pk="${pk}">${prefix}${render_name_plain(profile)}
	</span>`
}

function render_deleted_name() {
	return ""
}

function render_pfp(pk, profile) {
	const name = render_name_plain(profile)
	return html`<img class="pfp" title="${name}" 
	onerror="this.onerror=null;this.src='${robohash(pk)}';" 
	src="${get_picture(pk, profile)}">`
}

function render_deleted_pfp() {
	return html`
	<div class="pfp deleted">
		<i class="fa-solid fa-fw fa-ghost"></i>
	</div>`
}

function render_loading_spinner()
{
	return html`
	<div class="loading-events">
		<div class="loader" title="Loading...">
			<img class="dark-invert" src="icon/loader-fragment.svg"/>
		</div>
	</div>`
}
