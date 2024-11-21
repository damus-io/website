import { ArrowUpRight, Star, Check, LogOut, X } from "lucide-react";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AccountInfo, Profile, getProfile, getPurpleAccountInfo } from "@/utils/PurpleUtils";
import { useLocalStorage } from "usehooks-ts";
import { ErrorDialog } from "../ErrorDialog";
import { PurpleLayout } from "../PurpleLayout";
import { usePurpleLoginSession } from "@/hooks/usePurpleLoginSession";


export function PurpleAccount() {
  const intl = useIntl()
  const [error, setError] = useState<string | null>(null)
  const { accountInfo: loggedInAccountInfo, logout } = usePurpleLoginSession(setError)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [pubkey, setPubkey] = useState<string | null>(null)

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

  // MARK: - Effects and hooks

  // Load the profile when the pubkey changes
  useEffect(() => {
    if (pubkey) {
      fetchProfile()
    }
  }, [pubkey])

  useEffect(() => {
    if (loggedInAccountInfo) {
      setPubkey(loggedInAccountInfo.pubkey)
    }
    else if (loggedInAccountInfo === null) {
      // Redirect to the login page
      window.location.href = "/purple/login?redirect=" + encodeURIComponent("/purple/account")
    }
  }, [loggedInAccountInfo])

  // MARK: - Render

  return (<>
    <ErrorDialog error={error} setError={setError} />
    <PurpleLayout>
      {((profile || profile === null) && pubkey) && (<>
        <div className="mt-2 mb-4 flex flex-col items-center">
          <div className="mt-4 flex flex-col gap-1 items-center justify-center mb-4">
            <Image src={profile?.picture || ("https://robohash.org/" + (profile?.pubkey || pubkey))} width={128} height={128} className="rounded-full" alt={profile?.name || intl.formatMessage({ id: "purple.account.unknown-user", defaultMessage: "Generic user avatar" })} />
            <div className="flex flex-wrap gap-1 items-center">
              <div className="text-purple-50 font-semibold text-3xl">
                {profile?.name || "No name"}
              </div>
              <div className="text-purple-200/70 font-normal text-xs flex gap-1">
                <Star strokeWidth={1.75} className="w-4 h-4 shrink-0 text-amber-400" fill="currentColor" />
                {loggedInAccountInfo?.created_at && unixTimestampToDateString(loggedInAccountInfo?.created_at)}
              </div>
            </div>
            {loggedInAccountInfo?.active ? (
              <div className="flex gap-1 bg-gradient-to-r from-damuspink-500 to-damuspink-600 rounded-full px-3 py-1 items-center mt-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-white flex justify-center items-center">
                  <Check className="w-2 h-2 shrink-0 text-damuspink-500" strokeWidth={5} />
                </div>
                <div className="text-white font-semibold text-sm">
                  {intl.formatMessage({ id: "purple.account.active", defaultMessage: "Active account" })}
                </div>
              </div>
            ) : (
              <div className="flex gap-1 bg-red-200 rounded-full px-3 py-1 items-center mt-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-red-500 flex justify-center items-center">
                  <X className="w-2 h-2 shrink-0 text-red-200" strokeWidth={5} />
                </div>
                <div className="text-red-500 font-semibold text-sm">
                  {intl.formatMessage({ id: "purple.account.expired", defaultMessage: "Expired account" })}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col bg-purple-50/10 rounded-xl px-4 text-purple-50 w-full">
            <AccountInfoRow label={intl.formatMessage({ id: "purple.account.expiry-date", defaultMessage: "Expiry date" })} value={(loggedInAccountInfo?.expiry && unixTimestampToDateString(loggedInAccountInfo?.expiry)) || "N/A"} />
            <AccountInfoRow label={intl.formatMessage({ id: "purple.account.account-creation", defaultMessage: "Account creation" })} value={(loggedInAccountInfo?.created_at && unixTimestampToDateString(loggedInAccountInfo?.created_at)) || "N/A"} />
            <AccountInfoRow label={intl.formatMessage({ id: "purple.account.subscriber-number", defaultMessage: "Subscriber number" })} value={(loggedInAccountInfo?.subscriber_number && "#" + loggedInAccountInfo?.subscriber_number) || "N/A"} last={loggedInAccountInfo?.testflight_url ? false : true} />
            {loggedInAccountInfo?.testflight_url && <Link href={loggedInAccountInfo?.testflight_url} target="_blank">
              <div className="py-2 border-b border-purple-200/20">
                <Button variant="link" className="w-full text-left">
                  <ArrowUpRight className="text-damuspink-600 mr-2" />
                  {intl.formatMessage({ id: "purple.account.testflight-link", defaultMessage: "Join TestFlight" })}
                </Button>
              </div>
            </Link>}
            <div className="py-2">
              <Link href="/notedeck/install" target="_blank">
                <Button variant="link" className="w-full text-left">
                  <ArrowUpRight className="text-damuspink-600 mr-2" />
                  {intl.formatMessage({ id: "purple.account.notedeck-install-link", defaultMessage: "Try Notedeck" })}
                </Button>
              </Link>
            </div>
          </div>
          <Button className="w-full md:w-auto opacity-70 hover:opacity-100 transition mt-4 text-sm" onClick={() => logout()} variant="link">
            <LogOut className="text-damuspink-600 mr-2" />
            {intl.formatMessage({ id: "purple.account.sign-out", defaultMessage: "Sign out" })}
          </Button>
        </div>
      </>)}
    </PurpleLayout>
  </>)
}

function AccountInfoRow({ label, value, last }: { label: string, value: string | number, last?: boolean }) {
  return (
    <div className={`flex gap-2 items-center justify-between ${last ? '' : 'border-b border-purple-200/20'} py-4`}>
      <div className="font-bold">
        {label}
      </div>
      <div>
        {value}
      </div>
    </div>
  );
}

function unixTimestampToDateString(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString()
}
