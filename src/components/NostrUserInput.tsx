import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { NostrEvent, Relay, nip19 } from "nostr-tools"
import { Loader2, Radius, Shell } from "lucide-react";
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { AccountInfo, Profile, getProfile, getPurpleAccountInfo } from "@/utils/PurpleUtils";
import { ErrorDialog } from "./ErrorDialog";
import { NostrProfile } from "./NostrProfile";


// TODO: Double-check this regex and make it more accurate
const NPUB_REGEX = /^npub[0-9A-Za-z]+$/

export function NostrUserInput(props: { pubkey: string | null, setPubkey: (pubkey: string | null) => void, onProfileChange: (profile: Profile | undefined | null) => void, disabled?: boolean | undefined, profileHeader?: React.ReactNode, profileFooter?: React.ReactNode }) {
  const intl = useIntl()
  const [profile, setProfile] = useState<Profile | undefined | null>(undefined) // The profile info fetched from the Damus relay
  const [error, setError] = useState<string | null>(null)  // An error message to display to the user
  const [npubValidationError, setNpubValidationError] = useState<string | null>(null)
  const [npub, setNpub] = useState<string>("")

  // MARK: - Functions

  const fetchProfile = async () => {
    if (!props.pubkey) {
      return
    }
    try {
      const profile = await getProfile(props.pubkey)
      setProfile(profile)
    }
    catch (e) {
      console.error(e)
      setError("Failed to get profile info from the relay. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
    }
  }

  // MARK: - Effects and hooks

  // Load the profile when the pubkey changes
  useEffect(() => {
    if (props.pubkey) {
      fetchProfile()
    }
  }, [props.pubkey])

  useEffect(() => {
    if (npub.length > 0 && !NPUB_REGEX.test(npub)) {
      setNpubValidationError(intl.formatMessage({ id: "purple.login.npub-validation-error", defaultMessage: "Please enter a valid npub" }))
      setProfile(undefined)
    }
    else {
      setNpubValidationError(null)
      if (npub.length > 0) {
        try {
          const decoded = nip19.decode(npub)
          props.setPubkey(decoded.data as string)
        }
        catch (e) {
          props.setPubkey(null)
          setNpubValidationError(intl.formatMessage({ id: "purple.login.npub-validation-error", defaultMessage: "Please enter a valid npub" }))
        }
      }
      else {
        setProfile(undefined)
        props.setPubkey(null)
      }
    }
  }, [npub])

  // MARK: - Render

  return (<>
    <ErrorDialog error={error} setError={setError} />
    <Label htmlFor="npub" className="text-purple-200/70 font-normal">
      {intl.formatMessage({ id: "purple.login.npub-label", defaultMessage: "Please enter your public key (npub) below" })}
    </Label>
    <Input id="npub" placeholder={intl.formatMessage({ id: "purple.login.npub-placeholder", defaultMessage: "npub…" })} type="text" className="mt-2" value={npub} onChange={(e) => setNpub(e.target.value)} required disabled={props.disabled} />
    {npubValidationError &&
      <Label htmlFor="npub" className="text-red-500 font-normal">
        {npubValidationError}
      </Label>
    }
    {(profile === undefined && props.pubkey && props.pubkey.length > 0) && (
      <div className="mt-2 flex items-center justify-center">
        <Loader2 className="mr-2 animate-spin text-purple-200/90" size={16} />
        <div className="text-purple-200/70 font-normal text-sm">
          {intl.formatMessage({ id: "purple.login.fetching-profile", defaultMessage: "Fetching profile info…" })}
        </div>
      </div>
    )}
    {((profile || profile === null) && props.pubkey) && (<>
      <NostrProfile
        pubkey={props.pubkey}
        profile={profile}
        profileHeader={props.profileHeader}
        profileFooter={props.profileFooter}
      />
    </>)}
  </>)
}
