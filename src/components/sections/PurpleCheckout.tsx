import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { useInterval } from 'usehooks-ts'
import { Info } from "lucide-react";
import { PurpleLayout } from "../PurpleLayout";
import { AccountInfo } from "@/utils/PurpleUtils";
import { Step1ProductSelection } from "./PurpleCheckoutDetails/Step1ProductSelection";
import { LNCheckout } from "./PurpleCheckoutDetails/Types";
import { Step2UserVerification } from "./PurpleCheckoutDetails/Step2UserVerification";
import { Step3Payment } from "./PurpleCheckoutDetails/Step3Payment";
import { PurpleCheckoutErrorDialog } from "./PurpleCheckoutDetails/ErrorDialog";
import { CheckoutSuccess } from "./PurpleCheckoutDetails/CheckoutSuccess";


export function PurpleCheckout() {
  const intl = useIntl()
  const [lnCheckout, setLNCheckout] = useState<LNCheckout | null>(null) // The checkout object from the server
  const [error, setError] = useState<string | null>(null)  // An error message to display to the user
  const [selectedAuthMethod, setSelectedAuthMethod] = useState<string | "nostr-dm" | "damus-ios">("nostr-dm")
  const [existingAccountInfo, setExistingAccountInfo] = useState<AccountInfo | null | undefined>(undefined)  // The account info fetched from the server

  // MARK: - Functions

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

  const pollState = async () => {
    if (!lnCheckout) {
      return
    }
    if (!lnCheckout.verified_pubkey) {
      refreshLNCheckout()
    }
  }

  // MARK: - Effects and hooks

  // Keep checking the state of things when needed
  useInterval(pollState, 1000)

  useEffect(() => {
    // Set the query parameter on the URL to be the lnCheckout ID to avoid losing it on page refresh
    if (lnCheckout) {
      const url = new URL(window.location.href)
      url.searchParams.set("id", lnCheckout.id)
      window.history.replaceState({}, "", url.toString())
    }
  }, [lnCheckout])

  // Load the LN checkout (if there is one) on page load
  useEffect(() => {
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
    <PurpleCheckoutErrorDialog lnCheckout={lnCheckout} error={error} setError={setError} />
    
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
      
      <Step1ProductSelection
        lnCheckout={lnCheckout}
        setLNCheckout={setLNCheckout}
        setError={setError}
      />
      
      <Step2UserVerification
        lnCheckout={lnCheckout}
        setLNCheckout={setLNCheckout}
        selectedAuthMethod={selectedAuthMethod}
        setSelectedAuthMethod={setSelectedAuthMethod}
        setError={setError}
      />
      
      <Step3Payment
        lnCheckout={lnCheckout}
        setLNCheckout={setLNCheckout}
        setError={setError}
        successView={<>
          {lnCheckout &&
            <CheckoutSuccess
              lnCheckout={lnCheckout}
              existingAccountInfo={existingAccountInfo}
              selectedAuthMethod={selectedAuthMethod}
              setError={setError}
            />
          }
        </>}
      />
    </PurpleLayout>
  </>)
}
