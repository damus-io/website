// MARK: - Types

import { NostrEvent, Relay } from "nostr-tools"

interface AccountInfo {
pubkey: string,
created_at: number, // Unix timestamp in seconds
expiry: number | null, // Unix timestamp in seconds
subscriber_number: number,
active: boolean,
testflight_url: string | null,
}

interface Profile {
pubkey: string
name: string
picture: string
about: string
}

// MARK: - Helper functions

const getPurpleAccountInfo = async (pubkey: string): Promise<AccountInfo | null> => {
const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/accounts/" + pubkey, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json'
    },
})
if (response.status === 404) {
    return null
}
const data: AccountInfo = await response.json()
return data
}

const getProfile = async (pubkey: string): Promise<Profile | null> => {
const profile_event: NostrEvent | null = await getProfileEvent(pubkey)
if (!profile_event) {
    return null
}
try {
    const profile_data = JSON.parse(profile_event.content)
    const profile = {
    pubkey: profile_event.pubkey,
    name: profile_data.name,
    picture: profile_data.picture,
    about: profile_data.about,
    }
    return profile
}
catch (e) {
    return null
}
}

const getProfileEvent = async (pubkey: string): Promise<NostrEvent | null> => {
const relay = await Relay.connect(process.env.NEXT_PUBLIC_NOSTR_RELAY || 'wss://relay.damus.io')

const events: Array<NostrEvent> = []
return new Promise((resolve) => {
    let resolved = false
    const resolveWithMostRecent = () => {
    if (resolved) return
    resolved = true
    // Get the most recent event, based on `created_at` field (sort descending)
    const most_recent_event = events.sort((a, b) => b.created_at - a.created_at)[0]
    resolve(most_recent_event || null)
    }

    relay.subscribe([
    {
        authors: [pubkey],
        kinds: [0],
    },
    ], {
    onevent(event: NostrEvent) {
        events.push(event)
    },
    oneose() {
        resolveWithMostRecent()
        relay.close()
    },
    onclose() {
        // Relay closed before or after EOSE — resolve with whatever we have
        resolveWithMostRecent()
    }
    })
});
}

export { getPurpleAccountInfo, getProfile, getProfileEvent }
export type { AccountInfo, Profile }
