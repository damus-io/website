import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { AccountInfo, Profile, getProfile, getPurpleAccountInfo } from "@/utils/PurpleUtils";
import { LNCheckout } from "./Types";

export interface Step2DamusIOSVerificationProps {
  lnCheckout: LNCheckout
  setLNCheckout: (checkout: LNCheckout) => void
  pubkey: string | null,
  setPubkey: (pubkey: string | null) => void
  profile: Profile | undefined | null
  setProfile: (profile: Profile | undefined | null) => void
  setError: (error: string) => void
}

export function Step2DamusIOSVerification(props: Step2DamusIOSVerificationProps) {
  const intl = useIntl()
  const [existingAccountInfo, setExistingAccountInfo] = useState<AccountInfo | null | undefined>(undefined)  // The account info fetched from the server
  
  const step1Done = props.lnCheckout?.product_template_name != null
  const step2Done = props.lnCheckout?.verified_pubkey != null

  // MARK: - Functions

  const fetchProfile = async () => {
    if (!props.pubkey) {
      return
    }
    try {
      const profile = await getProfile(props.pubkey)
      props.setProfile(profile)
    }
    catch (e) {
      console.error(e)
      props.setError("Failed to get profile info from the relay. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
    }
  }

  const fetchAccountInfo = async () => {
    if (!props.pubkey) {
      setExistingAccountInfo(undefined)
      return
    }
    try {
      const accountInfo = await getPurpleAccountInfo(props.pubkey)
      setExistingAccountInfo(accountInfo)
    }
    catch (e) {
      console.error(e)
      props.setError("Failed to get account info from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
    }
  }

  // MARK: - Effects and hooks

  // Load the profile when the pubkey changes
  useEffect(() => {
    if (props.pubkey) {
      fetchProfile()
      fetchAccountInfo()
    }
  }, [props.pubkey])

  // MARK: - Render

  return (<>
    {props.lnCheckout && !step2Done && <>
      <QRCodeSVG value={"damus:purple:verify?id=" + props.lnCheckout.id} className="mt-6 w-[300px] h-[300px] max-w-full max-h-full mx-auto mb-6" />
      <Link href={"damus:purple:verify?id=" + props.lnCheckout.id} className="w-full md:w-auto opacity-70 hover:opacity-100 transition">
        <Button variant="link" className="w-full text-sm">
          {intl.formatMessage({ id: "purple.checkout.open-in-app", defaultMessage: "Open in Damus" })}
        </Button>
      </Link>
      <div className="text-white/40 text-xs text-center mt-4 mb-6">
        {/* TODO: Localize later */}
        Issues with this step? Please ensure you are running the latest Damus iOS version — or <Link href="mailto:support@damus.io" className="text-damuspink-500 underline">contact us</Link>
      </div>
    </>
    }
  </>)
}
