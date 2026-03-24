import { Button } from "@/components/ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { QRCodeSVG } from 'qrcode.react';
import { Profile } from "@/utils/PurpleUtils";
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

  const step2Done = props.lnCheckout?.verified_pubkey != null

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
