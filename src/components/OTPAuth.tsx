import { Button } from "./ui/Button";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { Info, Loader2, Mail } from "lucide-react";
import { InputOTP6Digits } from "@/components/ui/InputOTP";
import { ErrorDialog } from "./ErrorDialog";

export interface OTPAuthProps {
  pubkey: string | null
  verifyOTP: (otp: string) => void
  sendOTP: () => void
  otpVerified: boolean
  setOTPVerified: (verified: boolean) => void
  otpInvalid: boolean
  setOTPInvalid: (invalid: boolean) => void
  setError?: (error: string) => void
  disabled?: boolean
}

export function OTPAuth(props: OTPAuthProps) {
  const intl = useIntl()
  const { setError } = props
  const [otp, setOTP] = useState<string>("")

  // MARK: - Functions

  const completeOTP = async () => {
    if (!otp) {
      return
    }
    props.verifyOTP(otp)
  }

  // MARK: - Effects and hooks

  useEffect(() => {
    setOTP("")
  }, [props.pubkey])

  useEffect(() => {
    if (otp.length != 6) {
      props.setOTPInvalid(false)
      props.setOTPVerified(false)
    }
  }, [otp])

  // MARK: - Render

  return (<>
    <div className="text-purple-200/50 font-normal flex items-center gap-2 rounded-full px-6 py-2 justify-center mt-2 mb-2">
      <div className="flex flex-col items-center">
        <Mail className="w-10 h-10 shrink-0 text-purple-100 mb-3" />
        <div className="text-purple-200/90 font-semibold text-md whitespace-pre-line text-center">
          {intl.formatMessage({ id: "purple.login.otp-sent", defaultMessage: "We sent you a code via a Nostr DM.\n Please enter it below" })}
        </div>
      </div>
    </div>
    <div className="mx-auto flex justify-center mb-4">
      <InputOTP6Digits value={otp} onChange={setOTP} onComplete={() => completeOTP()} disabled={props.disabled} />
    </div>
    {!props.otpVerified && !props.otpInvalid && otp.length >= 6 && (
      <div className="flex flex-col items-center justify-center w-full mb-2">
        <div className="text-purple-200/50 font-normal text-sm flex items-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </div>
      </div>
    )}
    {props.otpInvalid && (<div className="my-4 w-full flex flex-col gap-2">
      <div className="text-red-500 font-normal text-sm text-center">
        {intl.formatMessage({ id: "purple.login.otp-invalid", defaultMessage: "Invalid or expired OTP. Please try again." })}
      </div>
      <Button variant="default" className="w-full" onClick={() => {
        props.sendOTP()
        props.setOTPInvalid(false)
        setOTP("")
      }}>Resend OTP</Button>
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
  </>)
}
