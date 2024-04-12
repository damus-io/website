import { CheckCircle, Frown, Mail, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { NostrEvent, Relay, nip19 } from "nostr-tools"
import { Info } from "lucide-react";
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { InputOTP6Digits } from "@/components/ui/InputOTP";
import { AccountInfo, Profile, getProfile, getPurpleAccountInfo } from "@/utils/PurpleUtils";
import { useLocalStorage } from "usehooks-ts";
import { ErrorDialog } from "../ErrorDialog";
import { PurpleLayout } from "../PurpleLayout";


// TODO: Double-check this regex and make it more accurate
const NPUB_REGEX = /^npub[0-9A-Za-z]+$/

export function PurpleLogin() {
  const intl = useIntl()
  const [sessionToken, setSessionToken] = useLocalStorage('session_token', null)
  const [pubkey, setPubkey] = useState<string | null>(null) // The pubkey of the user, if verified
  const [profile, setProfile] = useState<Profile | undefined | null>(undefined) // The profile info fetched from the Damus relay
  const [error, setError] = useState<string | null>(null)  // An error message to display to the user
  const [npubValidationError, setNpubValidationError] = useState<string | null>(null)
  const [npub, setNpub] = useState<string>("")
  const [existingAccountInfo, setExistingAccountInfo] = useState<AccountInfo | null | undefined>(undefined)  // The account info fetched from the server
  const [otpSent, setOTPSent] = useState<boolean>(false)
  const [otp, setOTP] = useState<string>("")
  const [otpVerified, setOTPVerified] = useState<boolean>(false)
  const [otpInvalid, setOTPInvalid] = useState<boolean>(false)
  const loginSuccessful = sessionToken !== null && otpVerified === true;

  // MARK: - Functions

  const fetchProfile = async () => {
    if (!pubkey) {
      return
    }
    try {
      const profile = await getProfile(pubkey)
      setProfile(profile)
    }
    catch (e) {
      console.error(e)
      setError("Failed to get profile info from the relay. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
    }
  }

  const fetchAccountInfo = async () => {
    if (!pubkey) {
      setExistingAccountInfo(undefined)
      return
    }
    try {
      const accountInfo = await getPurpleAccountInfo(pubkey)
      setExistingAccountInfo(accountInfo)
    }
    catch (e) {
      console.error(e)
      setError("Failed to get account info from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
    }
  }

  const beginLogin = async () => {
    if (!pubkey || !profile) {
      return
    }
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/accounts/" + pubkey + "/request-otp", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if (!response.ok) {
      setError("Failed to send OTP. Please try again later.")
      return
    }
    setOTPSent(true)
    setOTPInvalid(false)
    setOTP("")
  }

  const completeOTP = async () => {
    if (!pubkey || !profile || !otp) {
      return
    }
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/accounts/" + pubkey + "/verify-otp", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ otp_code: otp })
    })
    if (response.status != 200 && response.status != 401) {
      setError("Failed to verify OTP. Please try again later.")
      return
    }
    const json = await response.json()
    if (json.valid) {
      setSessionToken(json.session_token)
      setOTPVerified(true)
    }
    else {
      setOTPInvalid(true)
    }
  }

  const getRedirectURL = () => {
    const url = new URL(window.location.href)
    // Get the redirect URL from the query parameters, or fallback to the account page as the default redirect URL
    const redirect = url.searchParams.get("redirect") || "/purple/account"
    // Make sure the redirect URL is within the same domain for security reasons
    if (redirect && (redirect.startsWith(window.location.origin) || redirect.startsWith("/"))) {
      return redirect
    }
    return null
  }

  // MARK: - Effects and hooks

  // Load the profile when the pubkey changes
  useEffect(() => {
    if (pubkey) {
      fetchProfile()
      fetchAccountInfo()
    }
  }, [pubkey])

  useEffect(() => {
    if (sessionToken) {
      const redirectUrl = getRedirectURL()
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    }
  }, [sessionToken])

  useEffect(() => {
    setOTPSent(false)
    setOTPVerified(false)
    setOTP("")
    if (npub.length > 0 && !NPUB_REGEX.test(npub)) {
      setNpubValidationError(intl.formatMessage({ id: "purple.login.npub-validation-error", defaultMessage: "Please enter a valid npub" }))
      setProfile(undefined)
    }
    else {
      setNpubValidationError(null)
      if (npub.length > 0) {
        try {
          const decoded = nip19.decode(npub)
          setPubkey(decoded.data as string)
        }
        catch (e) {
          setPubkey(null)
          setNpubValidationError(intl.formatMessage({ id: "purple.login.npub-validation-error", defaultMessage: "Please enter a valid npub" }))
        }
      }
      else {
        setProfile(undefined)
      }
    }
  }, [npub])

  useEffect(() => {
    if (otp.length != 6) {
      setOTPInvalid(false)
      setOTPVerified(false)
    }
  }, [otp])


  // MARK: - Render

  return (<>
    <ErrorDialog error={error} setError={setError} />
    <PurpleLayout>
      <h2 className="text-2xl text-left text-purple-200 font-semibold break-keep mb-2">
        {intl.formatMessage({ id: "purple.login.title", defaultMessage: "Access your account" })}
      </h2>
      <div className="flex flex-col text-center md:text-left mb-8">
        <span className="text-xs text-purple-200/50">
          {intl.formatMessage({ id: "purple.login.description", defaultMessage: "Use this page to access your Purple account details" })}
        </span>
      </div>
      <Label htmlFor="npub" className="text-purple-200/70 font-normal">
        {intl.formatMessage({ id: "purple.login.npub-label", defaultMessage: "Please enter your public key (npub) below" })}
      </Label>
      <Input id="npub" placeholder={intl.formatMessage({ id: "purple.login.npub-placeholder", defaultMessage: "npub…" })} type="text" className="mt-2" value={npub} onChange={(e) => setNpub(e.target.value)} required disabled={loginSuccessful} />
      {npubValidationError &&
        <Label htmlFor="npub" className="text-red-500 font-normal">
          {npubValidationError}
        </Label>
      }
      {((profile || profile === null) && pubkey) && (<>
        <div className="mt-2 mb-4 flex flex-col items-center">
          {existingAccountInfo !== null && existingAccountInfo !== undefined && otpSent !== true && (
            <div className="text-purple-200/50 font-normal flex items-center gap-2 rounded-full px-6 py-2 justify-center mt-2 mb-2">
              <Sparkles className="w-4 h-4 shrink-0 text-purple-50" />
              <div className="flex flex-col">
                <div className="text-purple-200/90 font-semibold text-md">
                  {intl.formatMessage({ id: "purple.login.this-account-exists", defaultMessage: "Yay! We found your account" })}
                </div>
              </div>
            </div>
          )}

          <div className="text-purple-200/50 font-normal text-sm">
            {otpSent ? intl.formatMessage({ id: "purple.login.otp-sent", defaultMessage: "Logging into:" })
              : intl.formatMessage({ id: "purple.login.is-this-you", defaultMessage: "Is this you?" })}
          </div>
          <div className="mt-4 flex flex-col gap-1 items-center justify-center mb-4">
            <Image src={profile?.picture || ("https://robohash.org/" + (profile?.pubkey || pubkey))} width={64} height={64} className="rounded-full" alt={profile?.name || intl.formatMessage({ id: "purple.login.unknown-user", defaultMessage: "Generic user avatar" })} />
            <div className="text-purple-100/90 font-semibold text-lg">
              {profile?.name || (npub.substring(0, 8) + ":" + npub.substring(npub.length - 8))}
            </div>
          </div>
          {existingAccountInfo === null && (
            <div className="text-purple-200/50 font-normal flex items-center gap-2 bg-purple-300/10 rounded-full px-8 py-2 justify-center mt-2 mb-2 w-fit mx-auto">
              <Frown className="w-6 h-6 shrink-0 text-purple-50" />
              <div className="flex flex-col">
                <div className="text-purple-200/90 font-semibold text-md">
                  {intl.formatMessage({ id: "purple.login.this-account-does-not-exist", defaultMessage: "This account does not exist" })}
                </div>
                <Link className="text-purple-200/90 font-normal text-sm underline" href="/purple/checkout" target="_blank">
                  {intl.formatMessage({ id: "purple.login.create-account", defaultMessage: "Join Purple today" })}
                </Link>
              </div>
            </div>
          )}
          {existingAccountInfo !== null && !otpSent && (
            <Button variant="default" className="w-full" onClick={() => beginLogin()}>Continue</Button>
          )}
          {otpSent && (<>
            <div className="text-purple-200/50 font-normal flex items-center gap-2 rounded-full px-6 py-2 justify-center mt-2 mb-2">
              <div className="flex flex-col items-center">
                <Mail className="w-10 h-10 shrink-0 text-purple-100 mb-3" />
                <div className="text-purple-200/90 font-semibold text-md whitespace-pre-line text-center">
                  {intl.formatMessage({ id: "purple.login.otp-sent", defaultMessage: "We sent you a code via a Nostr DM.\n Please enter it below" })}
                </div>
              </div>
            </div>
            <div className="mx-auto flex justify-center mb-4">
              <InputOTP6Digits value={otp} onChange={setOTP} onComplete={() => completeOTP()} disabled={loginSuccessful} />
            </div>
            {otpInvalid && (<div className="my-4 w-full flex flex-col gap-2">
              <div className="text-red-500 font-normal text-sm text-center">
                {intl.formatMessage({ id: "purple.login.otp-invalid", defaultMessage: "Invalid or expired OTP. Please try again." })}
              </div>
              <Button variant="default" className="w-full" onClick={() => beginLogin()}>Resend OTP</Button>
            </div>)}
            <div className="text-purple-200/70 text-normal text-left font-semibold flex flex-col md:flex-row gap-3 rounded-lg bg-purple-200/10 p-3 items-center md:items-start">
              <Info className="w-6 h-6 shrink-0 mt-0 md:mt-1" />
              <div className="flex flex-col text-center md:text-left">
                <span className="text-normal md:text-lg mb-2">
                  {intl.formatMessage({ id: "purple.login.stay-safe.title", defaultMessage: "Stay safe" })}
                </span>
                <span className="text-xs text-purple-200/50 whitespace-pre-line">
                  {intl.formatMessage({ id: "purple.login.stay-safe.message", defaultMessage: "We will never ask you for your nsec or any other sensitive information via Nostr DMs. Beware of impersonators. Please do not share your OTP code with anyone.\n\n If you don't see the OTP code, please check the DM requests tab in Damus." })}
                </span>
              </div>
            </div>
            {loginSuccessful && (<>
              <div className="flex flex-col justify-center items-center gap-2 mt-8">
                <CheckCircle className="w-12 h-12 shrink-0 text-green-500" />
                <div className="text-white text-sm text-center text-purple-200/80 mb-4">
                  {intl.formatMessage({ id: "purple.login.login-successful", defaultMessage: "Login successful. You should be automatically redirected. If not, please click the button below." })}
                </div>
              </div>
              {/* Continue link */}
              <Link href={getRedirectURL() || "/purple/account"}>
                <Button variant="default" className="w-full">
                  {intl.formatMessage({ id: "purple.login.continue", defaultMessage: "Continue" })}
                </Button>
              </Link>
            </>)}
          </>)}
        </div>
      </>)}
    </PurpleLayout>
  </>)
}
