import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function ErrorDialog({ error, setError, children }: { error: string | null, setError: (error: string | null) => void, children?: React.ReactNode }) {
  return (
    <AlertDialog open={error != null} onOpenChange={(open) => { if (!open) setError(null) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><div className="text-red-700">Error</div></AlertDialogTitle>
          <AlertDialogDescription>
            <div className="text-left">
              {error}
            </div>
            <div className="text-black/40 text-xs text-left mt-4 mb-6">
              You can contact support by sending an email to <Link href="mailto:support@damus.io" className="text-damuspink-600 underline">support@damus.io</Link>
            </div>
            {children}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="default" onClick={() => setError(null)}>OK</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
