

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

async function damus_web_init(thread)
{
	const pool = RelayPool(["wss://relay.damus.io"])
	const now = (new Date().getTime()) / 1000
	const model = {events: [], profiles: {}}
	const comments_id = uuidv4()
	const profiles_id = uuidv4()

	model.pool = pool
	model.el = document.querySelector("#posts")

	pool.on('open', relay => {
		relay.subscribe(comments_id, {kinds: [1], limit: 100})
	});

	pool.on('event', (relay, sub_id, ev) => {
		if (sub_id === comments_id) {
			if (ev.content !== "")
				insert_event_sorted(model.events, ev)
			if (model.realtime)
				render_home_view(model)
		} else if (sub_id === profiles_id) {
			try {
				model.profiles[ev.pubkey] = JSON.parse(ev.content)
			} catch {
				console.log("failed to parse", ev.content)
			}
		}
	})

	pool.on('eose', async (relay, sub_id) => {
		if (sub_id === comments_id) {
			handle_comments_loaded(profiles_id, model)
		} else if (sub_id === profiles_id) {
			handle_profiles_loaded(profiles_id, model)
		}
	})

	return pool
}

function handle_profiles_loaded(profiles_id, model) {
	// stop asking for profiles
	model.pool.unsubscribe(profiles_id)
	model.realtime = true
	render_home_view(model)
}

// load profiles after comment notes are loaded
function handle_comments_loaded(profiles_id, model)
{
	const pubkeys = model.events.reduce((s, ev) => {
		s.add(ev.pubkey)
		return s
	}, new Set())
	const authors = Array.from(pubkeys)

	// load profiles
	model.pool.subscribe(profiles_id, {kinds: [0], authors: authors})
}

function render_home_view(model) {
	model.el.innerHTML = render_events(model)
}

function render_events(model) {
	const render = render_event.bind(null, model)
	return model.events.map(render).join("\n")
}

function render_event(model, ev) {
	const profile = model.profiles[ev.pubkey] || {
		name: "anon",
		display_name: "Anonymous",
	}
	const delta = time_delta(new Date().getTime(), ev.created_at*1000)
	const pk = ev.pubkey
	return `
	<div class="comment">
		<div class="info">
			${render_name(ev.pubkey, profile)}
			<span>${delta}</span>
		</div>
		<img class="pfp" onerror="this.onerror=null;this.src='${robohash(pk)}';" src="${get_picture(pk, profile)}">
		<p>
		${format_content(ev.content)}
		</p>
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
