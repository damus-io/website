
function hex_char(val)
{
	if (val < 10)
		return String.fromCharCode(48 + val)
	if (val < 16)
		return String.fromCharCode(97 + val - 10)
}

function hex_encode(buf)
{
	str = ""
	for (let i = 0; i < buf.length; i++) {
		const c = buf[i]
		str += hex_char(c >> 4)
		str += hex_char(c & 0xF)
	}
	return str
}

function go() {
	const el = document.querySelector("#damus-key")
	const hex_el = document.querySelector("#hex-key")
	const note_link_el = document.querySelector("#note-link")
	const profile_link_el = document.querySelector("#profile-link")

	el.addEventListener("input", () => {
		const decoded = bech32.decode(el.value)
		const bytes = fromWords(decoded.words)
		hex_el.value = hex_encode(bytes)
		update_note_link(hex_el.value)
	});

	hex_el.addEventListener("input", () => {
		update_note_link(hex_el.value)
	})

	function update_note_link(id) {
		note_link_el.href = `nostr:e:${id}`
		profile_link_el.href = `nostr:p:${id}`
	}
}

go()
