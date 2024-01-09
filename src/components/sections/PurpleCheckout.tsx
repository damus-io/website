import { ArrowLeft, ArrowUpRight, CheckCircle, ChevronRight, Copy, Globe2, Loader2, LucideZapOff, Zap, ZapIcon, ZapOff } from "lucide-react";
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


export function PurpleCheckout() {
  const intl = useIntl()
  const [lnCheckout, setLNCheckout] = useState<LNCheckout | null>(null) // The checkout object from the server
  const [productTemplates, setProductTemplates] = useState<ProductTemplates | null>(null) // The different product options
  const [pubkey, setPubkey] = useState<string | null>(null) // The pubkey of the user, if verified
  const [profile, setProfile] = useState<Profile | undefined | null>(undefined) // The profile info fetched from the Damus relay
  const [continueShowQRCodes, setContinueShowQRCodes] = useState<boolean>(false)  // Whether the user wants to show a QR code for the final step

  // MARK: - Functions

  const fetchProfile = async () => {
    if (!pubkey) {
      return
    }
    const profile = await getProfile(pubkey)
    setProfile(profile)
  }

  const fetchProductTemplates = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/products", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await response.json()
    setProductTemplates(data)
  }

  const refreshLNCheckout = async (id?: string) => {
    if (!lnCheckout && !id) {
      return
    }
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/ln-checkout/" + (id || lnCheckout?.id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data: LNCheckout = await response.json()
    setLNCheckout(data)
  }

  const selectProduct = async (productTemplateName: string) => {
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

  // MARK: - Effects and hooks

  // Keep polling the LN checkout state when verifying pubkey or paying for the invoice
  useInterval(refreshLNCheckout, lnCheckout && (!lnCheckout.verified_pubkey || !lnCheckout.invoice?.paid) ? 1000 : null)

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

  // MARK: - Render

  return (<>
    <div
      className="bg-black overflow-hidden relative"
    >
      <div className="absolute z-0 w-full h-full pointer-events-none">
        <Image src="/stars-bg.webp" fill className="absolute top-0 left-0 object-cover lg:object-contain object-center w-full h-full" alt="" aria-hidden="true" />
        <MeshGradient5 className="translate-y-1/4 translate-x-32" />
      </div>
      <div className="container z-10 mx-auto px-6 pt-12 h-full min-h-screen flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center h-full grow">
          <RoundedContainerWithGradientBorder className="w-full max-w-md h-full mb-4" innerContainerClassName="w-full">
            <div className="flex gap-x-4 items-center mb-12 mx-auto justify-center">
              <PurpleIcon className="w-16 h-16" />
              <motion.h2 className="text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold break-keep tracking-tight">
                Purple
              </motion.h2>
            </div>
            <h2 className="text-2xl text-left text-purple-200 font-semibold break-keep mb-4">
              {intl.formatMessage({ id: "purple.checkout.title", defaultMessage: "Checkout" })}
            </h2>
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
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg ${name == lnCheckout?.product_template_name ? "border-green-500" : "border-purple-200/50"} disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => selectProduct(name)}
                  disabled={lnCheckout?.verified_pubkey != null}
                >
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
                  <ChevronRight className="ml-2" />
                </Button>
              </Link>
            </>
            }
            {profile &&
              <div className="mt-2 mb-4 flex flex-col items-center">
                <div className="text-purple-200/50 font-normal text-sm">
                  {lnCheckout?.verified_pubkey && !lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.purchasing-for", defaultMessage: "Verified. Purchasing Damus Purple for:" })}
                  {lnCheckout?.invoice?.paid && intl.formatMessage({ id: "purple.checkout.purchased-for", defaultMessage: "Purchased Damus Purple for:" })}
                </div>
                <div className="mt-4 flex flex-col gap-1 items-center justify-center">
                  <Image src={profile.picture || "https://robohash.org/" + profile.pubkey} width={64} height={64} className="rounded-full" alt={profile.name} />
                  <div className="text-purple-100/90 font-semibold text-lg">
                    {profile.name}
                  </div>
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
                <QRCodeSVG value={"lightning:" + lnCheckout.invoice.bolt11} className="mt-6 w-[300px] h-[300px] max-w-full max-h-full mx-auto mb-6" />
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
            {lnCheckout?.invoice?.paid && (
              <div className="flex flex-col items-center justify-center gap-3 mt-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="mt-3 mb-6 text-sm text-center text-green-500 font-bold">
                  {intl.formatMessage({ id: "purple.checkout.payment-received", defaultMessage: "Payment received" })}
                </div>
                <Link
                  href={`damus:purple:welcome?id=${lnCheckout.id}`}
                  className="w-full text-sm flex justify-center"
                >
                  <Button variant="default" className="w-full text-sm">
                    {intl.formatMessage({ id: "purple.checkout.continue", defaultMessage: "Continue in the app to set it up" })}
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
                    <QRCodeSVG value={"damus:purple:welcome?id=" + lnCheckout.id} className="mt-6 w-[300px] h-[300px] max-w-full max-h-full mx-auto mb-6" />
                  </>
                )}
              </div>
            )}
          </RoundedContainerWithGradientBorder>
          <Link href="/purple" className="w-full md:w-auto opacity-70 hover:opacity-100 transition">
            <Button variant="link" className="w-full text-sm">
              <ArrowLeft className="text-damuspink-600 mr-2" />
              {intl.formatMessage({ id: "purple.checkout.back", defaultMessage: "Go back" })}
            </Button>
          </Link>
        </div>
      </div>
    </div >
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
    paid: boolean,
  }
}

interface ProductTemplate {
  description: string,
  amount_msat: number,
  expiry: number,
}

type ProductTemplates = Record<string, ProductTemplate>

interface Profile {
  pubkey: string
  name: string
  picture: string
  about: string
}

// MARK: - Helper functions

const getProfile = async (pubkey: string): Promise<Profile | null> => {
  const profile_event: NostrEvent | null = await getProfileEvent(pubkey)
  if (!profile_event) {
    return null
  }
  try {
    const profile_data = JSON.parse(profile_event.content)
    const profile = {
      pubkey: profile_event.pubkey,
      name: profile_data.name,
      picture: profile_data.picture,
      about: profile_data.about,
    }
    return profile
  }
  catch (e) {
    return null
  }
}

const getProfileEvent = async (pubkey: string): Promise<NostrEvent | null> => {
  const relay = await Relay.connect('wss://relay.damus.io')

  const events: Array<NostrEvent> = []
  return new Promise((resolve, reject) => {

    // let's query for an event that exist 
    const sub = relay.subscribe([
      {
        authors: [pubkey],
        kinds: [0],
      },
    ], {
      onevent(event: NostrEvent) {
        events.push(event)
      },
      oneose() {
        // Get the most recent event, based on `created_at` field
        if (events.length === 0) {
          // No events found
          resolve(null)
        }
        else {
          const most_recent_event = events.sort((a, b) => a.created_at - b.created_at)[0]
          resolve(most_recent_event)
        }
        relay.close()
      }
    })
  });
}
