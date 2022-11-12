const nostrjs = (function nostrlib() {
const WS = typeof WebSocket !== 'undefined' ? WebSocket : require('ws')

function RelayPool(relays, opts)
{
	if (!(this instanceof RelayPool))
		return new RelayPool(relays)

	this.onfn = {}
	this.relays = []

	for (const relay of relays) {
		this.add(relay)
	}

	return this
}

RelayPool.prototype.close = function relayPoolClose() {
	for (const relay of this.relays) {
		relay.close()
	}
}

RelayPool.prototype.on = function relayPoolOn(method, fn) {
	for (const relay of this.relays) {
		this.onfn[method] = fn
		relay.onfn[method] = fn.bind(null, relay)
	}
}

RelayPool.prototype.has = function relayPoolHas(relayUrl) {
	for (const relay of this.relays) {
		if (relay.url === relayUrl)
			return true
	}

	return false
}

RelayPool.prototype.setupHandlers = function relayPoolSetupHandlers()
{
	// setup its message handlers with the ones we have already
	const keys = Object.keys(this.onfn)
	for (const handler of keys) {
		for (const relay of this.relays) {
			relay.onfn[handler] = this.onfn[handler].bind(null, relay)
		}
	}
}

RelayPool.prototype.remove = function relayPoolRemove(url) {
	let i = 0

	for (const relay of this.relays) {
		if (relay.url === url) {
			relay.ws && relay.ws.close()
			this.relays = this.replays.splice(i, 1)
			return true
		}

		i += 1
	}

	return false
}

RelayPool.prototype.subscribe = function relayPoolSubscribe(sub_id, filters, relay_ids) {
	const relays = relay_ids ? this.find_relays(relay_ids) : this.relays
	for (const relay of relays) {
		relay.subscribe(sub_id, filters)
	}
}

RelayPool.prototype.unsubscribe = function relayPoolUnsubscibe(sub_id, relay_ids) {
	const relays = relay_ids ? this.find_relays(relay_ids) : this.relays
	for (const relay of relays) {
		relay.unsubscribe(sub_id)
	}
}

RelayPool.prototype.send = function relayPoolSend(payload, relay_ids) {
	const relays = relay_ids ? this.find_relays(relay_ids) : this.relays
	for (const relay of relays) {
		relay.send(payload)
	}
}

RelayPool.prototype.add = function relayPoolAdd(relay) {
	if (relay instanceof Relay) {
		if (this.has(relay.url))
			return false

		this.relays.push(relay)
		this.setupHandlers()
		return true
	}

	if (this.has(relay))
		return false

	const r = Relay(relay, this.opts)
	this.relays.push(r)
	this.setupHandlers()
	return true
}

RelayPool.prototype.find_relays = function relayPoolFindRelays(relay_ids) {
	if (relay_ids instanceof Relay)
		return [relay_ids]

	if (relay_ids.length === 0)
		return []

	if (!relay_ids[0])
		throw new Error("what!?")

	if (relay_ids[0] instanceof Relay)
		return relay_ids

	return this.relays.reduce((acc, relay) => {
		if (relay_ids.some((rid) => relay.url === rid))
			acc.push(relay)
		return acc
	}, [])
}

Relay.prototype.wait_connected = async function relay_wait_connected(data) {
	let retry = 1000
	while (true) {
		if (!this.ws || this.ws.readyState !== 1) {
			await sleep(retry)
			retry *= 1.5
		}
		else {
			return
		}
	}
}


function Relay(relay, opts={})
{
	if (!(this instanceof Relay))
		return new Relay(relay, opts)

	this.url = relay
	this.opts = opts

	if (opts.reconnect == null)
		opts.reconnect = true

	const me = this
	me.onfn = {}

	try {
		init_websocket(me)
	} catch (e) {
		console.log(e)
	}

	return this
}

function init_websocket(me) {
	let ws
	try {
		ws = me.ws = new WS(me.url);
	} catch(e) {
		return null
	}
	return new Promise((resolve, reject) => {
		let resolved = false
		ws.onmessage = (m) => { handle_nostr_message(me, m) }
		ws.onclose = () => { 
			if (me.onfn.close) 
				me.onfn.close() 
			if (me.reconnecting)
				return reject(new Error("close during reconnect"))
			if (!me.manualClose && me.opts.reconnect)
				reconnect(me)
		}
		ws.onerror = () => { 
			if (me.onfn.error)
				me.onfn.error() 
			if (me.reconnecting)
				return reject(new Error("error during reconnect"))
			if (me.opts.reconnect)
				reconnect(me)
		}
		ws.onopen = () => {
			if (me.onfn.open)
				me.onfn.open()
			else
				console.log("no onopen???", me)

			if (resolved) return

			resolved = true
			resolve(me)
		}
	});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function reconnect(me)
{
	const reconnecting = true
	let n = 100
	try {
		me.reconnecting = true
		await init_websocket(me)
		me.reconnecting = false
	} catch {
		//console.error(`error thrown during reconnect... trying again in ${n} ms`)
		await sleep(n)
		n *= 1.5
	}
}

Relay.prototype.on = function relayOn(method, fn) {
	this.onfn[method] = fn
}

Relay.prototype.close = function relayClose() {
	if (this.ws) {
		this.manualClose = true
		this.ws.close()
	}
}

Relay.prototype.subscribe = function relay_subscribe(sub_id, filters) {
	if (Array.isArray(filters))
		this.send(["REQ", sub_id, ...filters])
	else
		this.send(["REQ", sub_id, filters])
}

Relay.prototype.unsubscribe = function relay_unsubscribe(sub_id) {
	this.send(["CLOSE", sub_id])
}

Relay.prototype.send = async function relay_send(data) {
	await this.wait_connected()
	this.ws.send(JSON.stringify(data))
}

function handle_nostr_message(relay, msg)
{
	let data
	try {
		data = JSON.parse(msg.data)
	} catch (e) {
		console.error("handle_nostr_message", msg, e)
		return
	}
	if (data.length >= 2) {
		switch (data[0]) {
		case "EVENT":
			if (data.length < 3)
				return
			return relay.onfn.event && relay.onfn.event(data[1], data[2])
		case "EOSE":
			return relay.onfn.eose && relay.onfn.eose(data[1])
		case "NOTICE":
			return relay.onfn.notice && relay.onfn.notice(...data.slice(1))
		}
	}
}

async function sha256(message) {
	if (crypto.subtle) {
		const buffer = await crypto.subtle.digest('SHA-256', message);
		return new Uint8Array(buffer);
	} else if (require) {
		const { createHash } = require('crypto');
		const hash = createHash('sha256');
		[message].forEach((m) => hash.update(m));
		return Uint8Array.from(hash.digest());
	} else {
		throw new Error("The environment doesn't have sha256 function");
	}
}

async function calculate_id(ev) {
	const commit = event_commitment(ev)
	const buf = new TextEncoder().encode(commit);                    
	return hex_encode(await sha256(buf))
}

function event_commitment(ev) {
	const {pubkey,created_at,kind,tags,content} = ev
	return JSON.stringify([0, pubkey, created_at, kind, tags, content])
}

function hex_char(val) {
	if (val < 10)
		return String.fromCharCode(48 + val)
	if (val < 16)
		return String.fromCharCode(97 + val - 10)
}

function hex_encode(buf) {
	let str = ""
	for (let i = 0; i < buf.length; i++) {
		const c = buf[i]
		str += hex_char(c >> 4)
		str += hex_char(c & 0xF)
	}
	return str
}

function char_to_hex(cstr) {
	const c = cstr.charCodeAt(0)
	// c >= 0 && c <= 9
	if (c >= 48 && c <= 57) {
		return c - 48;
	}
	// c >= a && c <= f
 	if (c >= 97 && c <= 102) {
		return c - 97 + 10;
	}
	// c >= A && c <= F
 	if (c >= 65 && c <= 70) {
		return c - 65 + 10;
	}
	return -1;
}


function hex_decode(str, buflen)
{
	let bufsize = buflen || 33
	let c1, c2
	let i = 0
	let j = 0
	let buf = new Uint8Array(bufsize)
	let slen = str.length
	while (slen > 1) {
		if (-1==(c1 = char_to_hex(str[j])) || -1==(c2 = char_to_hex(str[j+1])))
			return null;
		if (!bufsize)
			return null;
		j += 2
		slen -= 2
		buf[i++] = (c1 << 4) | c2
		bufsize--;
	}

	return buf
}

return {
	RelayPool,
	calculate_id,
	event_commitment,
	hex_encode,
	hex_decode,
}
})()

if (typeof module !== 'undefined' && module.exports)
	module.exports = nostrjs
