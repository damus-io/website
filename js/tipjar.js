async function make_request(method, rune, params) {
	const LNSocket = await lnsocket_init()
	const ln = LNSocket()

	ln.genkey()
	await ln.connect_and_init("03f3c108ccd536b8526841f0a5c58212bb9e6584a1eb493080e7c1cc34f82dad71", "wss://cln.jb55.com:443")

	const {result} = await ln.rpc({ rune, method, params })

	ln.disconnect()
	return result
}

function fetch_tipjar_summary() {
	const rune = "b3Xsg2AS2cknHYa6H94so7FAVQVdnRSP6Pv-1WOQEBc9NCZtZXRob2Q9b2ZmZXItc3VtbWFyeQ=="
	return make_request("offer-summary", rune, {
		offerid: "2043536dfec68d559102f73510927622812a230cfdda079e96fccbfe35a96d11",
		description: "@damus-android",
		limit: 5
	})
}

function make_invoice(description) {
	const rune = "LZwGZJO7wZgmoScFQb5reZ0Ii8qPKCeUfTb-UcbDxWw9MTImbWV0aG9kPWludm9pY2U="
	description = (description && `${description} @damus-android`) || "@damus-android donation"
	return make_request("invoice", rune, {
		msatoshi: "any",
		label: `damus-android-${new Date().getTime()}`,
		description: description
	})
}

function make_qrcode(dat) {
	const link = dat.toUpperCase()
	document.querySelector("#qrcode").innerHTML = ""
	const qr = new QRCode("qrcode", {
		text: link,
		width: 256,
		height: 256,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.L
	})
}

async function click_make_invoice(el) {
	const offerdata = document.querySelector("#offerdata")
	const tipjar_img = document.querySelector("#tipjar-offer-qr")

	const note = prompt("Leave a note!", "")

	const invoice = await make_invoice(note)

	make_qrcode("LIGHTNING:" + invoice.bolt11)
	document.querySelector("#bolt12").href = "lightning:" + invoice.bolt11

	el.style.display = "none";
}

async function copy_tip() {
	const offer = document.querySelector("#offerdata").value.trim();
	try {
		await navigator.clipboard.writeText(offer)
		alert("Invoice copied to clipboard!")
	} catch(err) {
		console.log("clipboard copy error", err)
		document.querySelector("#offerdata").style.display = "block"
	}
}

async function go() {
	const summary = await fetch_tipjar_summary()

	const el = document.querySelector("#tipjar-summary")
	const bolt12 = document.querySelector("#bolt12")

	make_qrcode(bolt12.href)
	el.innerHTML = render_tips(summary)
}

function render_tips(res) {
	const total_sats = res.total_msatoshi / 1000
	const goal = 3000000
	const perc = `${((total_sats / goal) * 100).toPrecision(2)}%`
	const total_fmt = `${format_amount(total_sats)} / ${format_amount(goal)} sats goal (${perc})`
	return `
	<p>Total: <b>${total_fmt}</b></p>
	<div class="progres" style="height:20px; background-color: #f1f1f1">
		<div class="progress-bar" style="background-color: #f44336; height: 100%;width: ${perc}"></div>
	</div>
	<h5>Recent Donors</h5>
	${render_table(res.paid_invoices)}
	<h5>Top Donors</h5>
	${render_table(res.top_donors)}
	`
}

function render_table(invoices)
{
	return `
	<table style="width: 100%">
	<thead>
		<tr>
			<th>Note</th>
			<th>Amount</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
	  ${invoices.map(render_tip).join("\n")}
	</tbody>
	</table>
	`
}

function format_amount(amt)
{
	return amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function render_tip(tip)
{
	let note = tip.payer_note ? tip.payer_note : (tip.description || "Anonymous")
	note = note.replace("@damus-android", "")
	const amount = format_amount(tip.msatoshi / 1000)
	const now = Math.floor(new Date().getTime() / 1000)
	const date = time_delta(now * 1000, tip.paid_at * 1000)

	return `
	<tr>
		<td>${note}</td>
		<td>${amount} sats</td>
		<td class="reldate">${date}</td>
	</tr>
	`
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

go()
