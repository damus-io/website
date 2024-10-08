import { useIntl } from "react-intl";
import Image from "next/image";
import { nip19 } from "nostr-tools"
import { Profile } from "@/utils/PurpleUtils";

export interface NostrProfileProps {
  profile: Profile
  profileHeader: React.ReactNode
  profileFooter: React.ReactNode
}

export function NostrProfile(props: NostrProfileProps) {
  const intl = useIntl()
  const { profile } = props
  const npub = nip19.npubEncode(profile.pubkey)

  return (<>
    <div className="mt-2 mb-4 flex flex-col items-center">
      {props.profileHeader}
      <div className="mt-4 flex flex-col gap-1 items-center justify-center mb-4">
        <Image src={profile?.picture || ("https://robohash.org/" + (profile.pubkey))} width={64} height={64} className="rounded-full" alt={profile.name || intl.formatMessage({ id: "purple.profile.unknown-user", defaultMessage: "Generic user avatar" })} />
        <div className="text-purple-100/90 font-semibold text-lg">
          {profile?.name || (npub.substring(0, 8) + ":" + npub.substring(npub.length - 8))}
        </div>
      </div>
      {props.profileFooter}
    </div>
  </>)
}
