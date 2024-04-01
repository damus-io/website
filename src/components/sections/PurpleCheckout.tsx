import { ArrowLeft, ArrowUpRight, CheckCircle, ChevronRight, Copy, Globe2, Loader2, LucideZapOff, Sparkles, Zap, ZapIcon, ZapOff } from "lucide-react";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { PurpleIcon } from "../icons/PurpleIcon";
import { RoundedContainerWithGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import { MeshGradient5 } from "../effects/MeshGradient.5";
import { useEffect, useRef, useState } from "react";
import { NostrEvent, Relay, nip19 } from "nostr-tools"
import { QRCodeSVG } from 'qrcode.react';
import { useInterval } from 'usehooks-ts'
import Lnmessage from 'lnmessage'
import { DAMUS_TESTFLIGHT_URL } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Info } from "lucide-react";
import { ErrorDialog } from "../ErrorDialog";
import { PurpleLayout } from "../PurpleLayout";
import { AccountInfo, Profile, getProfile, getPurpleAccountInfo } from "@/utils/PurpleUtils";


export function PurpleCheckout() {
  const intl = useIntl()
  const [lnCheckout, setLNCheckout] = useState<LNCheckout | null>(null) // The checkout object from the server
  const [productTemplates, setProductTemplates] = useState<ProductTemplates | null>(null) // The different product options
  const [pubkey, setPubkey] = useState<string | null>(null) // The pubkey of the user, if verified
  const [profile, setProfile] = useState<Profile | undefined | null>(undefined) // The profile info fetched from the Damus relay
  const [continueShowQRCodes, setContinueShowQRCodes] = useState<boolean>(false)  // Whether the user wants to show a QR code for the final step
  const [lnInvoicePaid, setLNInvoicePaid] = useState<boolean | undefined>(undefined) // Whether the ln invoice has been paid
  const [waitingForInvoice, setWaitingForInvoice] = useState<boolean>(false) // Whether we are waiting for a response from the LN node about the invoice
  const [error, setError] = useState<string | null>(null)  // An error message to display to the user
  const [existingAccountInfo, setExistingAccountInfo] = useState<AccountInfo | null | undefined>(undefined)  // The account info fetched from the server

  const [lnConnectionRetryCount, setLnConnectionRetryCount] = useState<number>(0)  // The number of times we have tried to connect to the LN node
  const lnConnectionRetryLimit = 5  // The maximum number of times we will try to connect to the LN node before displaying an error
  const [lnWaitinvoiceRetryCount, setLnWaitinvoiceRetryCount] = useState<number>(0)  // The number of times we have tried to check the invoice status
  const lnWaitinvoiceRetryLimit = 5  // The maximum number of times we will try to check the invoice status before displaying an error

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

  const fetchProductTemplates = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/products", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json()
      setProductTemplates(data)
    }
    catch (e) {
      console.error(e)
      setError("Failed to get product list from our servers, please try again later in a few minutes. If the problem persists, please contact support.")
    }
  }

  const refreshLNCheckout = async (id?: string) => {
    if (!lnCheckout && !id) {
      return
    }
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/ln-checkout/" + (id || lnCheckout?.id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data: LNCheckout = await response.json()
      setLNCheckout(data)
    }
    catch (e) {
      console.error(e)
      setError("Failed to get checkout info from our servers, please wait a few minutes and try to refresh this page. If the problem persists, please contact support.")
    }
  }

  const selectProduct = async (productTemplateName: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/ln-checkout", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_template_name: productTemplateName })
      })
      const data: LNCheckout = await response.json()
      setLNCheckout(data)
    }
    catch (e) {
      console.error(e)
      setError("Failed to begin the checkout process. Please wait a few minutes, refresh this page, and try again. If the problem persists, please contact support.")
    }
  }

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
        setError("Failed to connect to the Lightning node. Please refresh this page, and try again in a few minutes. If the problem persists, please contact support.")
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
        setError("The lightning payment failed. If you haven't paid yet, please start a new checkout from the beginning and try again. If you have already paid, please copy the reference ID shown below and contact support.")
      }
    } catch (e) {
      setWaitingForInvoice(false)  // Indicate that we are no longer waiting for a response from the LN node
      console.error(e)
      if (lnWaitinvoiceRetryCount >= lnWaitinvoiceRetryLimit) {
        setError("There was an error checking the lightning payment status. If you haven't paid yet, please wait a few minutes, refresh the page, and try again. If you have already paid, please copy the reference ID shown below and contact support.")
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
      setError("Failed to finalize checkout. Please try refreshing the page. If the error persists, please copy the reference ID shown below and contact support.")
    }
  }

  const pollState = async () => {
    if (!lnCheckout) {
      return
    }
    if (!lnCheckout.verified_pubkey) {
      refreshLNCheckout()
    }
    else if (!lnCheckout.invoice?.paid && !waitingForInvoice) {
      checkLNInvoice()
    }
  }


  // MARK: - Effects and hooks

  // Keep checking the state of things when needed
  useInterval(pollState, 1000)

  useEffect(() => {
    if (lnCheckout && lnCheckout.verified_pubkey) {
      // Load the profile if the user has verified their pubkey
      setPubkey(lnCheckout.verified_pubkey)
    }
    // Set the query parameter on the URL to be the lnCheckout ID to avoid losing it on page refresh
    if (lnCheckout) {
      const url = new URL(window.location.href)
      url.searchParams.set("id", lnCheckout.id)
      window.history.replaceState({}, "", url.toString())
    }
  }, [lnCheckout])

  // Load the profile when the pubkey changes
  useEffect(() => {
    if (pubkey) {
      fetchProfile()
      fetchAccountInfo()
    }
  }, [pubkey])

  // Load the products and the LN checkout (if there is one) on page load
  useEffect(() => {
    fetchProductTemplates()
    // Check if there is a lnCheckout ID in the URL query parameters. If so, fetch the lnCheckout
    const url = new URL(window.location.href)
    const id = url.searchParams.get("id")
    if (id) {
      console.log("Found lnCheckout ID in URL query parameters. Fetching lnCheckout...")
      refreshLNCheckout(id)
    }
  }, [])

  // Tell server to check the invoice as soon as we notice it has been paid
  useEffect(() => {
    if (lnInvoicePaid === true) {
      tellServerToCheckLNInvoice()
    }
  }, [lnInvoicePaid])

  // MARK: - Render

  return (<>
    <ErrorDialog error={error} setError={setError}>
      {lnCheckout && lnCheckout.id && (
        <div className="flex items-center justify-between rounded-md bg-gray-200">
          <div className="text-xs text-gray-400 font-normal px-4 py-2">
            Reference:
          </div>
          <div className="w-full text-xs text-gray-500 font-normal px-4 py-2 overflow-x-scroll">
            {lnCheckout?.id}
          </div>
          <button
            className="text-sm text-gray-500 font-normal px-4 py-2 active:text-gray-500/30 hover:text-gray-500/80 transition"
            onClick={() => navigator.clipboard.writeText(lnCheckout?.id || "")}
          >
            <Copy />
          </button>
        </div>
      )}
    </ErrorDialog>
    <PurpleLayout>
      <h2 className="text-2xl text-left text-purple-200 font-semibold break-keep mb-2">
        {intl.formatMessage({ id: "purple.checkout.title", defaultMessage: "Checkout" })}
      </h2>
      <div className="text-purple-200/70 text-normal text-left mb-6 font-semibold flex flex-col md:flex-row gap-3 rounded-lg bg-purple-200/10 p-3 items-center md:items-start">
        <Info className="w-6 h-6 shrink-0 mt-0 md:mt-1" />
        <div className="flex flex-col text-center md:text-left">
          <span className="text-normal md:text-lg mb-2">
            {intl.formatMessage({ id: "purple.checkout.description", defaultMessage: "New accounts and renewals" })}
          </span>
          <span className="text-xs text-purple-200/50">
            {intl.formatMessage({ id: "purple.checkout.description-2", defaultMessage: "Use this page to purchase a new account, or to renew an existing one. You will need the latest Damus version to complete the checkout." })}
          </span>
        </div>
      </div>
      <StepHeader
        stepNumber={1}
        title={intl.formatMessage({ id: "purple.checkout.step-1", defaultMessage: "Choose your plan" })}
        done={lnCheckout?.product_template_name != null}
        active={true}
      />
      <div className="mt-3 mb-4 flex gap-2 items-center">
        {productTemplates ? Object.entries(productTemplates).map(([name, productTemplate]) => (
          <button
            key={name}
            className={`relative flex flex-col items-center justify-center p-3 pt-4 border rounded-lg ${name == lnCheckout?.product_template_name ? "border-green-500" : "border-purple-200/50"} disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => selectProduct(name)}
            disabled={lnCheckout?.verified_pubkey != null}
          >
            {productTemplate.special_label && (
              <div className="absolute top-0 right-0 -mt-4 -mr-2 bg-gradient-to-r from-damuspink-500 to-damuspink-600 rounded-full p-1 px-3">
                <div className="text-white text-xs font-semibold">
                  {productTemplate.special_label}
                </div>
              </div>
            )}

            <div className="text-purple-200/50 font-normal text-sm">
              {productTemplate.description}
            </div>
            <div className="mt-1 text-purple-100/90 font-semibold text-lg">
              {productTemplate.amount_msat / 1000} sats
            </div>
          </button>
        )) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-purple-200/50 font-normal text-sm flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </div>
          </div>
        )}
      </div>
      <StepHeader
        stepNumber={2}
        title={intl.formatMessage({ id: "purple.checkout.step-2", defaultMessage: "Verify your npub" })}
        done={lnCheckout?.verified_pubkey != null}
        active={lnCheckout?.product_template_name != null}
      />
      {lnCheckout && !lnCheckout.verified_pubkey && <>
        <QRCodeSVG value={"damus:purple:verify?id=" + lnCheckout.id} className="mt-6 w-[300px] h-[300px] max-w-full max-h-full mx-auto mb-6" />
        <Link href={"damus:purple:verify?id=" + lnCheckout.id} className="w-full md:w-auto opacity-70 hover:opacity-100 transition">
          <Button variant="link" className="w-full text-sm">
            {intl.formatMessage({ id: "purple.checkout.open-in-app", defaultMessage: "Open in Damus" })}
          </Button>
        </Link>
        <div className="text-white/40 text-xs text-center mt-4 mb-6">
          {/* TODO: Localize later */}
          Issues with this step? Please ensure you are running the latest Damus iOS version from <Link href={DAMUS_TESTFLIGHT_URL} className="text-damuspink-500 underline" target="_blank">TestFlight</Link> — or <Link href="mailto:support@damus.io" className="text-damuspink-500 underline">contact us</Link>
        </div>
      </>
      }
      {profile &&
        <div className="mt-2 mb-4 flex flex-col items-center">
          <div className="text-purple-200/50 font-normal text-sm">
            {existingAccountInfo === null || existingAccountInfo === undefined ? <>
              {lnCheckout?.verified_pubkey && !lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.purchasing-for", defaultMessage: "Verified. Purchasing Damus Purple for:" })}
              {lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.purchased-for", defaultMessage: "Purchased Damus Purple for:" })}
            </> : <>
              {lnCheckout?.verified_pubkey && !lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.renewing-for", defaultMessage: "Verified. Renewing Damus Purple for:" })}
              {lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.renewed-for", defaultMessage: "Renewed Damus Purple for:" })}
            </>}
          </div>
          <div className="mt-4 flex flex-col gap-1 items-center justify-center">
            <Image src={profile.picture || "https://robohash.org/" + profile.pubkey} width={64} height={64} className="rounded-full" alt={profile.name} />
            <div className="text-purple-100/90 font-semibold text-lg">
              {profile.name}
            </div>
            {existingAccountInfo !== null && existingAccountInfo !== undefined && (
              <div className="text-purple-200/50 font-normal flex items-center gap-2 bg-purple-300/10 rounded-full px-6 py-2 justify-center">
                <Sparkles className="w-4 h-4 shrink-0 text-purple-50" />
                <div className="flex flex-col">
                  <div className="text-purple-200/90 font-semibold text-sm">
                    {intl.formatMessage({ id: "purple-checkout.this-account-exists", defaultMessage: "Yay! We found your account" })}
                  </div>
                  <div className="text-purple-200/70 font-normal text-xs break-normal">
                    {intl.formatMessage({ id: "purple-checkout.account-will-renew", defaultMessage: "Paying will renew or extend your membership." })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
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
          <div className="flex items-center justify-between rounded-md bg-purple-200/20">
            <div className="w-full text-sm text-purple-200/50 font-normal px-4 py-2 overflow-x-scroll">
              {lnCheckout.invoice.bolt11}
            </div>
            <button
              className="text-sm text-purple-200/50 font-normal px-4 py-2 active:text-purple-200/30 hover:text-purple-200/80 transition"
              onClick={() => navigator.clipboard.writeText(lnCheckout?.invoice?.bolt11 || "")}
            >
              <Copy />
            </button>
          </div>
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
            Issues with this step? Please ensure you are running the latest Damus iOS version from <Link href={DAMUS_TESTFLIGHT_URL} className="text-damuspink-500 underline" target="_blank">TestFlight</Link> — or <Link href="mailto:support@damus.io" className="text-damuspink-500 underline">contact us</Link>
          </div>
        </div>
      )}
    </PurpleLayout>
  </>)
}

// MARK: - Helper components

function StepHeader({ stepNumber, title, done, active }: { stepNumber: number, title: string, done: boolean, active: boolean }) {
  return (<>
    <div className={`flex items-center mb-2 ${active ? "" : "opacity-50"}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${done ? "bg-green-500" : active ? "bg-purple-600" : "bg-gray-500"} text-white text-sm font-semibold`}>
        {done ? <CheckCircle className="w-4 h-4" /> : stepNumber}
      </div>
      <div className="ml-2 text-lg text-purple-200 font-semibold">
        {title}
      </div>
    </div>
  </>)
}

// MARK: - Types

interface LNCheckout {
  id: string,
  verified_pubkey?: string,
  product_template_name?: string,
  invoice?: {
    bolt11: string,
    paid?: boolean,
    label: string,
    connection_params: {
      nodeid: string,
      address: string,
      rune: string,
      ws_proxy_address: string,
    }
  }
  completed: boolean,
}

interface ProductTemplate {
  description: string,
  special_label?: string | null,
  amount_msat: number,
  expiry: number,
}

type ProductTemplates = Record<string, ProductTemplate>
