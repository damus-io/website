import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { AccountInfo, Profile, getProfile, getPurpleAccountInfo } from "@/utils/PurpleUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { StepHeader } from "./StepHeader";
import { LNCheckout } from "./Types";
import { Step2OTPVerification } from "./Step2OTPVerification";
import { Step2DamusIOSVerification } from "./Step2DamusIOSVerification";
import { NostrProfile } from "@/components/NostrProfile";
import { Sparkles } from "lucide-react";
import { AccountExistsNoteIfAccountExists } from "./AccountExistsNote";

export interface Step2UserVerificationProps {
  lnCheckout: LNCheckout | null
  setLNCheckout: (checkout: LNCheckout) => void
  selectedAuthMethod: string | "nostr-dm" | "damus-ios"
  setSelectedAuthMethod: (method: string) => void
  setError: (error: string) => void
}

export function Step2UserVerification(props: Step2UserVerificationProps) {
  const intl = useIntl()
  const [pubkey, setPubkey] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | undefined | null>(undefined) // The profile info fetched from the Damus relay
  const [existingAccountInfo, setExistingAccountInfo] = useState<AccountInfo | null | undefined>(undefined)  // The account info fetched from the server
  
  const step1Done = props.lnCheckout?.product_template_name != null
  const step2Done = props.lnCheckout?.verified_pubkey != null

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
      props.setError("Failed to get profile info from the relay. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
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
      props.setError("Failed to get account info from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
    }
  }

  // MARK: - Effects and hooks

  // Load the profile when the pubkey changes
  useEffect(() => {
    if (pubkey) {
      fetchProfile()
      fetchAccountInfo()
    }
  }, [pubkey])
  
  // Reset pubkey if user switches tabs
  useEffect(() => {
    setPubkey(null)
    setProfile(null)
  }, [props.selectedAuthMethod])

  useEffect(() => {
    if (props.lnCheckout?.verified_pubkey) {
      setPubkey(props.lnCheckout.verified_pubkey)
    }
  }, [props.lnCheckout])

  // MARK: - Render

  return (<>
    <StepHeader
      stepNumber={2}
      title={intl.formatMessage({ id: "purple.checkout.step-2", defaultMessage: "Verify your npub" })}
      done={step2Done}
      active={step1Done}
    />
    {props.lnCheckout && !step2Done &&
      <Tabs defaultValue="nostr-dm" className="w-full flex flex-col items-center mb-6" value={props.selectedAuthMethod} onValueChange={(newValue: string) => { props.setSelectedAuthMethod(newValue) } }>
        <TabsList className="mx-auto">
          <TabsTrigger value="nostr-dm" disabled={step2Done}>via Nostr DMs</TabsTrigger>
          <TabsTrigger value="damus-ios" disabled={step2Done}>via Damus iOS</TabsTrigger>
        </TabsList>
        <TabsContent value="nostr-dm">
          <Step2OTPVerification
            lnCheckout={props.lnCheckout}
            setLNCheckout={props.setLNCheckout}
            pubkey={pubkey}
            setPubkey={setPubkey}
            profile={profile}
            setProfile={setProfile}
            existingAccountInfo={existingAccountInfo}
            setError={props.setError}
          />
        </TabsContent>
        <TabsContent value="damus-ios">
          <Step2DamusIOSVerification
            lnCheckout={props.lnCheckout}
            setLNCheckout={props.setLNCheckout}
            pubkey={pubkey}
            setPubkey={setPubkey}
            profile={profile}
            setProfile={setProfile}
            setError={props.setError}
          />
        </TabsContent>
      </Tabs>
    }
    {step2Done && profile && <>
      <NostrProfile
        profile={profile}
        profileHeader={<>
          <div className="text-purple-200/50 font-normal text-sm">
            {existingAccountInfo === null || existingAccountInfo === undefined ? <>
              {props.lnCheckout?.verified_pubkey && !props.lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.purchasing-for", defaultMessage: "Verified. Purchasing Damus Purple for:" })}
              {props.lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.purchased-for", defaultMessage: "Purchased Damus Purple for:" })}
            </> : <>
              {props.lnCheckout?.verified_pubkey && !props.lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.renewing-for", defaultMessage: "Verified. Renewing Damus Purple for:" })}
              {props.lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.renewed-for", defaultMessage: "Renewed Damus Purple for:" })}
            </>}
          </div>
        </>}
        profileFooter={<>
          <AccountExistsNoteIfAccountExists existingAccountInfo={existingAccountInfo}/>
        </>}
      />
    </>}
  </>)
}
