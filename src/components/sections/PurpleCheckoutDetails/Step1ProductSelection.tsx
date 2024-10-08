import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LNCheckout, ProductTemplates } from "./Types";
import { StepHeader } from "./StepHeader";
import { Loader2 } from "lucide-react";

export interface Step1ProductSelectionProps {
  lnCheckout: LNCheckout | null
  setLNCheckout: (lnCheckout: LNCheckout) => void
  setError: (error: string | null) => void
}

export function Step1ProductSelection(props: Step1ProductSelectionProps) {
  const intl = useIntl()
  const [productTemplates, setProductTemplates] = useState<ProductTemplates | null>(null) // The different product options
  const isStepDone = props.lnCheckout?.product_template_name != null
  
  // MARK: - Functions

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
      props.setError("Failed to get product list from our servers, please try again later in a few minutes. If the problem persists, please contact support.")
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
      props.setLNCheckout(data)
    }
    catch (e) {
      console.error(e)
      props.setError("Failed to begin the checkout process. Please wait a few minutes, refresh this page, and try again. If the problem persists, please contact support.")
    }
  }

  // MARK: - Effects and hooks

  // Load the products and the LN checkout (if there is one) on page load
  useEffect(() => {
    fetchProductTemplates()
  }, [])

  // MARK: - Render

  return (<>
    <StepHeader
      stepNumber={1}
      title={intl.formatMessage({ id: "purple.checkout.step-1", defaultMessage: "Choose your plan" })}
      done={isStepDone}
      active={true}
    />
    <div className="mt-3 mb-4 flex gap-2 items-center">
      {productTemplates ? Object.entries(productTemplates).map(([name, productTemplate]) => (
        <button
          key={name}
          className={`relative flex flex-col items-center justify-center p-3 pt-4 border rounded-lg ${name == props.lnCheckout?.product_template_name ? "border-green-500" : "border-purple-200/50"} disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => selectProduct(name)}
          disabled={isStepDone}
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
  </>)
}
