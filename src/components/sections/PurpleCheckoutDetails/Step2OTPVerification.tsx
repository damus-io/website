import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useLocalStorage } from 'usehooks-ts'
import { AccountInfo, Profile, getProfile, getPurpleAccountInfo } from "@/utils/PurpleUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { NostrUserInput } from "@/components/NostrUserInput";
import { OTPAuth } from "@/components/OTPAuth";
import { StepHeader } from "./StepHeader";
import { LNCheckout } from "./Types";
import { profile } from "console";
import React from "react";
import { AccountExistsNoteIfAccountExists } from "./AccountExistsNote";

export interface Step2OTPVerificationProps {
  lnCheckout: LNCheckout
  setLNCheckout: (checkout: LNCheckout) => void
  pubkey: string | null,
  setPubkey: (pubkey: string | null) => void
  profile: Profile | null | undefined
  setProfile: (profile: Profile | null | undefined) => void
  existingAccountInfo: AccountInfo | null | undefined
  setError: (error: string) => void
}

export function Step2OTPVerification(props: Step2OTPVerificationProps) {
  const intl = useIntl()
  const [otpSent, setOTPSent] = useState<boolean>(false)
  const [otpVerified, setOTPVerified] = useState<boolean>(false)
  const [otpInvalid, setOTPInvalid] = useState<boolean>(false)
  const [sessionToken, setSessionToken] = useLocalStorage('session_token', null)
  
  const step1Done = props.lnCheckout?.product_template_name != null
  const step2Done = props.lnCheckout?.verified_pubkey != null

  // MARK: - Functions

  const beginOTPAuth = async() => {
    if (!props.pubkey || !props.lnCheckout) {
      return
    }
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/ln-checkout/" + props.lnCheckout.id + "/request-otp/" + props.pubkey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if (!response.ok) {
      props.setError("Failed to send OTP. Please try again later.")
      return
    }
    setOTPSent(true)
    setOTPInvalid(false)
  }
  
  const validateOTP = async (otp: string) => {
    if (!props.pubkey || !props.lnCheckout || !otp) {
      return
    }
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/ln-checkout/" + props.lnCheckout.id + "/verify-otp/" + props.pubkey, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ otp_code: otp })
    })
    if (response.status != 200 && response.status != 401) {
      props.setError("Failed to verify OTP. Please try again later.")
      return
    }
    const json = await response.json()
    if (json?.otp?.valid) {
      /*
      Response format:
      { 
        checkout_object: response.checkout_object,
        otp: { valid: true, session_token: session_token }
      }
      */
      props.setLNCheckout(json.checkout_object)
      setSessionToken(json.otp.session_token)
      setOTPInvalid(false)
      setOTPVerified(true)
    }
    else {
      setOTPInvalid(true)
    }
  }

  // MARK: - Effects and hooks
  

  // MARK: - Render

  return (<>
    <NostrUserInput
      pubkey={props.pubkey}
      setPubkey={props.setPubkey}
      onProfileChange={props.setProfile}
      profileHeader={
        <div className="text-purple-200/50 font-normal text-sm">
          {props.lnCheckout?.invoice?.bolt11 ?
            intl.formatMessage({ id: "purple.checkout.paying-for", defaultMessage: "Purchasing membership for:" })
            : otpSent ? 
              intl.formatMessage({ id: "purple.checkout.logging-into", defaultMessage: "Logging into:" })
              : intl.formatMessage({ id: "purple.checkout.is-this-you", defaultMessage: "Is this you?" })
          }
        </div>
      }
      profileFooter={<>
        <AccountExistsNoteIfAccountExists existingAccountInfo={props.existingAccountInfo}/>
        {!otpSent && !step2Done && (
          <Button variant="default" className="w-full mt-2" onClick={() => beginOTPAuth()}>Continue</Button>
        )}
      </>}
      disabled={step2Done}
    />
    {otpSent && !step2Done &&
      <OTPAuth
      pubkey={props.pubkey}
      verifyOTP={validateOTP}
      sendOTP={beginOTPAuth}
      otpVerified={otpVerified}
      setOTPVerified={setOTPVerified}
      otpInvalid={otpInvalid}
      setOTPInvalid={setOTPInvalid}
      setError={props.setError}
      disabled={props.lnCheckout?.invoice?.bolt11 != undefined}
      />
    }
  </>)
}
