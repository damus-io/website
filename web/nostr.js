
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

function Relay(relay, opts={})
{
	if (!(this instanceof Relay))
		return new Relay(relay, opts)

	this.relay = relay
	this.opts = opts

	const me = this
	return new Promise((resolve, reject) => {
		const ws = me.ws = new WebSocket(relay);
		let resolved = false
		ws.onmessage = (m) => { handle_nostr_message(me, m) }
		ws.onclose = () => { me.close && me.close() }
		ws.onerror = () => { me.error && me.error() }
		ws.onopen = () => {
			if (resolved) {
				me.open.bind(me)
				return
			}

			resolved = true
			resolve(me)
		}
	})
}

Relay.prototype.subscribe = function relay_subscribe(sub_id, ...filters) {
	const tosend = ["REQ", sub_id, ...filters]
	this.ws.send(JSON.stringify(tosend))
}

Relay.prototype.unsubscribe = function relay_unsubscribe(sub_id) {
	const tosend = ["CLOSE", sub_id]
	this.ws.send(JSON.stringify(tosend))
}

function handle_nostr_message(relay, msg)
{
	const data = JSON.parse(msg.data)
	if (data.length >= 2) {
		switch (data[0]) {
		case "EVENT":
			if (data.length < 3)
				return
			return relay.event && relay.event(data[1], data[2])
		case "EOSE":
			return relay.eose && relay.eose(data[1])
		case "NOTICE":
			return relay.note && relay.note(...data.slice(1))
		}
	}
}

