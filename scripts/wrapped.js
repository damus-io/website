
const https = require('https');
const bolt11 = require("bolt11");
const bech32 = require("bech32");
const fs = require('fs');
const readline = require('readline');

function bech32_pubkey(pk) {
	return bech32.encode('npub', bech32.toWords(Buffer.from(pk, 'hex')))
}

function bech32_note(noteid) {
	return bech32.encode('note', bech32.toWords(Buffer.from(noteid, 'hex')))
}

async function process_zaps(stats, file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

	for await (const line of rl) {
	    // Each line in input.txt will be successively available here as `line`.
		const json = JSON.parse(line)
		const zap = json[2];
		const bolt11_tag = zap.tags.find((t) => t[0] == "bolt11")
		const invreq_tag = zap.tags.find((t) => t[0] == "description")
		if (!bolt11_tag || !invreq_tag) continue;
		const bolt11_str = bolt11_tag[1];
		const invreq_str = invreq_tag[1];
		if (!bolt11_str || !invreq_str) continue;
		let invoice;
		let invreq;
		try {
			invoice = bolt11.decode(bolt11_str);
			invreq = JSON.parse(invreq_str);
		} catch(e) {
			continue;
		}
		if (!invreq) continue;
		let target = invreq.tags.find((t) => t[0] == "e")
		const zap_author = invreq.pubkey;
		// we only care about note targets atm
		if (!target) continue;
		target = target[1]
		if (!target) continue;
		let zap_receiver = zap.tags.find((t) => t[0] == "p" && t[1] != zap_author);
		if (!zap_receiver) continue;
		zap_receiver = zap_receiver[1];
		if (!zap_receiver) continue;

		stats[zap_receiver] = stats[zap_receiver] || {}
		stats[zap_receiver][target] = stats[zap_receiver][target] || 0
		stats[zap_receiver][target] += invoice.satoshis
	}

	for (const pk of Object.keys(stats)) {
		let biggest_target;
		let biggest_amt = 0;

		const receiver = stats[pk]
		for (const target of Object.keys(receiver)) {
			const amount = receiver[target];
			if (amount > biggest_amt) {
				biggest_target = target;
				biggest_amt = amount;
			}
		}

		let bech32_pk = bech32_pubkey(pk)
		let note = await fetch_note(bech32_note(biggest_target));
		stats[bech32_pk] = {most_zapped_post: note, most_zapped_post_sats: biggest_amt}
		delete stats[pk]
	}

	return stats
}

async function fetch_note(noteid) {
	try  {
		return await fetch_json(`https://damus.io/${noteid}.json`)
	} catch (e) {
		return {noteid: noteid}
	}
}

async function fetch_json(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            // Handle incoming data chunks
            res.on('data', (chunk) => {
                data += chunk;
            });

            // Handle the end of the response
            res.on('end', () => {
                try {
                    // Parse the JSON string into an object
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (error) {
                    reject(new Error('Error parsing JSON: ' + error.message));
                }
            });
        }).on('error', (err) => {
            reject(new Error('Request failed: ' + err.message));
        });
    });
}

async function process_notes(stats, file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		let json
		try {
			json = JSON.parse(line)
		} catch (e) {
			continue;
		}
		const note = json[2];
		const pk = bech32_pubkey(note.pubkey)

		stats[pk] = stats[pk] || {}
		stats[pk].number_of_posts = (stats[pk].number_of_posts || 0) + 1
	}
}

async function process_stats() {
	let stats = {}
	await process_zaps(stats, "zaps.json")
	await process_notes(stats, "purple-posts.json")
	const data = JSON.stringify(stats, null, 2)
	fs.writeFile("stats.json", data, console.error);
}

process_stats()


