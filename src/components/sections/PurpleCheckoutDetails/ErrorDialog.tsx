import { ErrorDialog } from "@/components/ErrorDialog";
import { LNCheckout } from "./Types";
import { Copy } from "lucide-react";

export interface PurpleCheckoutErrorDialogProps {
  lnCheckout: LNCheckout | null;
  error: string | null;
  setError: (error: string | null) => void;
}

export function PurpleCheckoutErrorDialog(props: PurpleCheckoutErrorDialogProps) {
  const { lnCheckout, error, setError } = props;
  
  return (
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
  );
}
