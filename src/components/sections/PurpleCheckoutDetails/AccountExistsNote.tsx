import { AccountInfo } from "@/utils/PurpleUtils";
import { Sparkles } from "lucide-react";
import { useIntl } from "react-intl";

export function AccountExistsNoteIfAccountExists({ existingAccountInfo }: { existingAccountInfo: AccountInfo | null | undefined }) {
  const intl = useIntl();
  
  return (<>
    {existingAccountInfo != null && existingAccountInfo != undefined && (
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
  </>);
}
