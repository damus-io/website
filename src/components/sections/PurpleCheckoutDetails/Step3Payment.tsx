import { ArrowUpRight, CheckCircle, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useInterval } from 'usehooks-ts'
import Lnmessage from 'lnmessage'
import { LNCheckout } from "./Types";
import { StepHeader } from "./StepHeader";
import CopiableUrl from "@/components/ui/CopiableUrl";

export interface Step3PaymentProps {
  lnCheckout: LNCheckout | null
  setLNCheckout: (checkout: LNCheckout | null) => void
  setError: (error: string) => void
  successView: React.ReactNode
}

export function Step3Payment(props: Step3PaymentProps) {
  const intl = useIntl()
  const { lnCheckout, setLNCheckout } = props
  const [lnInvoicePaid, setLNInvoicePaid] = useState<boolean | undefined>(undefined) // Whether the ln invoice has been paid
  const [waitingForInvoice, setWaitingForInvoice] = useState<boolean>(false) // Whether we are waiting for a response from the LN node about the invoice
  
  const [lnConnectionRetryCount, setLnConnectionRetryCount] = useState<number>(0)  // The number of times we have tried to connect to the LN node
  const lnConnectionRetryLimit = 5  // The maximum number of times we will try to connect to the LN node before displaying an error
  const [lnWaitinvoiceRetryCount, setLnWaitinvoiceRetryCount] = useState<number>(0)  // The number of times we have tried to check the invoice status
  const lnWaitinvoiceRetryLimit = 5  // The maximum number of times we will try to check the invoice status before displaying an error
  
  const step1Done = props.lnCheckout?.product_template_name != null
  const step2Done = props.lnCheckout?.verified_pubkey != null
  const step3Done = props.lnCheckout?.invoice?.paid == true

  // MARK: - Functions

  const checkLNInvoice = async () => {
    console.log("Checking LN invoice...")
    if (!lnCheckout?.invoice?.bolt11) {
      return
    }
    let ln = null
    try {
      ln = new Lnmessage({
        // The public key of the node you would like to connect to
        remoteNodePublicKey: lnCheckout.invoice.connection_params.nodeid,
        // The websocket proxy address of the node
        wsProxy: `wss://${lnCheckout.invoice.connection_params.ws_proxy_address}`,
        // The IP address of the node
        ip: lnCheckout.invoice.connection_params.address,
        // Protocol to use when connecting to the node
        wsProtocol: 'wss:',
        port: 9735,
      })
      // TODO: This is a workaround due to a limitation in LNMessage URL formatting: (https://github.com/aaronbarnardsound/lnmessage/issues/52)
      ln.wsUrl = `wss://${lnCheckout.invoice.connection_params.ws_proxy_address}/${lnCheckout.invoice.connection_params.address}`
      await ln.connect()
      setWaitingForInvoice(true)  // Indicate that we are waiting for a response from the LN node
    }
    catch (e) {
      console.error(e)
      if (lnConnectionRetryCount >= lnConnectionRetryLimit) {
        props.setError("Failed to connect to the Lightning node. Please refresh this page, and try again in a few minutes. If the problem persists, please contact support.")
      }
      else {
        setLnConnectionRetryCount(lnConnectionRetryCount + 1)
      }
      return
    }

    try {
      if (!ln) { return }
      const res: any = await ln.commando({
        method: 'waitinvoice',
        params: { label: lnCheckout.invoice.label },
        rune: lnCheckout.invoice.connection_params.rune,
      })
      setWaitingForInvoice(false)  // Indicate that we are no longer waiting for a response from the LN node
      setLNInvoicePaid(!res.error)
      if (res.error) {
        console.error(res.error)
        props.setError("The lightning payment failed. If you haven't paid yet, please start a new checkout from the beginning and try again. If you have already paid, please copy the reference ID shown below and contact support.")
      }
    } catch (e) {
      setWaitingForInvoice(false)  // Indicate that we are no longer waiting for a response from the LN node
      console.error(e)
      if (lnWaitinvoiceRetryCount >= lnWaitinvoiceRetryLimit) {
        props.setError("There was an error checking the lightning payment status. If you haven't paid yet, please wait a few minutes, refresh the page, and try again. If you have already paid, please copy the reference ID shown below and contact support.")
      }
      else {
        setLnWaitinvoiceRetryCount(lnWaitinvoiceRetryCount + 1)
      }
    }
  }

  const tellServerToCheckLNInvoice = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/ln-checkout/" + lnCheckout?.id + "/check-invoice", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data: LNCheckout = await response.json()
      setLNCheckout(data)
    }
    catch (e) {
      console.error(e)
      props.setError("Failed to finalize checkout. Please try refreshing the page. If the error persists, please copy the reference ID shown below and contact support.")
    }
  }

  const pollState = async () => {
    if (!lnCheckout) {
      return
    }
    if (lnCheckout.invoice && !lnCheckout.invoice?.paid && !waitingForInvoice) {
      checkLNInvoice()
    }
  }

  // MARK: - Effects and hooks

  // Keep checking the state of things when needed
  useInterval(pollState, 1000)

  // Tell server to check the invoice as soon as we notice it has been paid
  useEffect(() => {
    if (lnInvoicePaid === true) {
      tellServerToCheckLNInvoice()
    }
  }, [lnInvoicePaid])

  // MARK: - Render

  return (<>
      <StepHeader
        stepNumber={3}
        title={intl.formatMessage({ id: "purple.checkout.step-3", defaultMessage: "Lightning payment" })}
        done={lnCheckout?.invoice?.paid === true}
        active={lnCheckout?.verified_pubkey != null}
      />
      {lnCheckout?.invoice?.bolt11 && !lnCheckout?.invoice?.paid &&
        <>
          <QRCodeSVG value={"lightning:" + lnCheckout.invoice.bolt11} className="mt-6 w-[300px] h-[300px] max-w-full max-h-full mx-auto mb-6 border-[5px] border-white bg-white" />
          {/* Shows the bolt11 in for copy-paste with a copy and paste button */}
          <CopiableUrl url={lnCheckout.invoice.bolt11} />
          <Link href={"lightning:" + lnCheckout.invoice.bolt11} className="w-full md:w-auto opacity-70 hover:opacity-100 transition mt-4">
            <Button variant="link" className="w-full text-sm">
              {intl.formatMessage({ id: "purple.checkout.open-in-wallet", defaultMessage: "Open in wallet" })}
              <ArrowUpRight className="text-damuspink-600 ml-2" />
            </Button>
          </Link>
          <div className="mt-6 text-purple-200/50 font-normal text-sm text-center flex justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {intl.formatMessage({ id: "purple.checkout.waiting-for-payment", defaultMessage: "Waiting for payment" })}
          </div>
        </>
      }
      {/* We use the lnCheckout object to check payment status (NOT lnInvoicePaid) to display the confirmation message, because the server is the ultimate source of truth */}
      {lnCheckout?.invoice?.paid && lnCheckout?.completed && (
        <div className="flex flex-col items-center justify-center gap-3 mt-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <div className="mt-3 mb-6 text-sm text-center text-green-500 font-bold">
            {intl.formatMessage({ id: "purple.checkout.payment-received", defaultMessage: "Payment received" })}
          </div>
          {props.successView}
        </div>
      )}
  </>)
}
