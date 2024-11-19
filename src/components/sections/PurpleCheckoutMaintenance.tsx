import { Construction } from "lucide-react";
import { PurpleLayout } from "../PurpleLayout";
import { useIntl } from "react-intl";


export function PurpleCheckoutMaintenance() {
  const intl = useIntl()

  // MARK: - Render

  return (<>
    <PurpleLayout>
      <h2 className="text-2xl text-left text-purple-200 font-semibold break-keep mb-2">
        {intl.formatMessage({ id: "purple.checkout-maintenance.title", defaultMessage: "Checkout" })}
      </h2>
      <div className="text-purple-200/70 text-normal text-left mb-6 font-semibold flex flex-col md:flex-row gap-3 rounded-lg bg-purple-200/10 p-3 items-center md:items-start">
        <Construction className="w-6 h-6 shrink-0 mt-0 md:mt-1" />
        <div className="flex flex-col text-center md:text-left">
          <span className="text-normal md:text-lg mb-2">
            {intl.formatMessage({ id: "purple.checkout-maintenance.description", defaultMessage: "Under maintenance" })}
          </span>
          <span className="text-xs text-purple-200/50">
            {intl.formatMessage({ id: "purple.checkout-maintenance.description-2", defaultMessage: "We are working on some fixes, please come back later. Thank you for your patience." })}
          </span>
        </div>
      </div>
    </PurpleLayout>
  </>)
}
