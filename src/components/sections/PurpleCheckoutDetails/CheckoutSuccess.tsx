import { ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { LNCheckout } from "./Types";
import { AccountInfo } from "@/utils/PurpleUtils";

export interface SuccessViewProps {
  existingAccountInfo: AccountInfo | null | undefined
  selectedAuthMethod: string
  lnCheckout: LNCheckout
}

export function CheckoutSuccess(props: SuccessViewProps) {
  const intl = useIntl()
  const [continueShowQRCodes, setContinueShowQRCodes] = useState<boolean>(false)  // Whether the user wants to show a QR code for the final step
  const { existingAccountInfo, selectedAuthMethod, lnCheckout } = props

  // MARK: - Functions

  // MARK: - Render

  return (<>
    {selectedAuthMethod == "damus-ios" && (<>
      <Link
        href={existingAccountInfo !== null && existingAccountInfo !== undefined ? `damus:purple:landing` : `damus:purple:welcome?id=${lnCheckout.id}`}
        className="w-full text-sm flex justify-center"
      >
        <Button variant="default" className="w-full text-sm">
          {intl.formatMessage({ id: "purple.checkout.continue", defaultMessage: "Continue in the app" })}
          <ChevronRight className="ml-1" />
        </Button>
      </Link>
      <button className="w-full text-sm text-damuspink-500 flex justify-center" onClick={() => setContinueShowQRCodes(!continueShowQRCodes)}>
        {!continueShowQRCodes ?
          intl.formatMessage({ id: "purple.checkout.continue.show-qr", defaultMessage: "Show QR code" })
          : intl.formatMessage({ id: "purple.checkout.continue.hide-qr", defaultMessage: "Hide QR code" })
        }
      </button>
      {continueShowQRCodes && (
        <>
          <QRCodeSVG
            value={existingAccountInfo !== null && existingAccountInfo !== undefined ? "damus:purple:landing" : "damus:purple:welcome?id=" + lnCheckout.id}
            className="mt-6 w-[300px] h-[300px] max-w-full max-h-full mx-auto mb-6"
          />
        </>
      )}
      <div className="text-white/40 text-xs text-center mt-4 mb-6">
        {/* TODO: Localize later */}
        Issues with this step? Please ensure you are running the latest Damus iOS version — or <Link href="mailto:support@damus.io" className="text-damuspink-500 underline">contact us</Link>
      </div>
    </>)}
    {selectedAuthMethod == "nostr-dm" && (
      <Link
        href={existingAccountInfo !== null && existingAccountInfo !== undefined ? "/purple/account" : "/purple/welcome"}
        className="w-full text-sm flex justify-center"
      >
        <Button variant="default" className="w-full text-sm">
          {intl.formatMessage({ id: "purple.checkout.continue.on-web", defaultMessage: "Continue" })}
          <ChevronRight className="ml-1" />
        </Button>
      </Link>
    )}
  </>)
}
