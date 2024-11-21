import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { ErrorDialog } from "../../ErrorDialog";
import { usePurpleLoginSession } from "@/hooks/usePurpleLoginSession";
import { useLocalStorage } from "usehooks-ts";
import { NotedeckInstallLayout } from "@/components/NotedeckInstallLayout";
import { MarkdownView } from "@/components/ui/MarkdownView";

export function InstallInstructions() {
  const intl = useIntl()
  const [error, setError] = useState<string | null>(null)
  const { accountInfo: loggedInAccountInfo, logout } = usePurpleLoginSession(setError)
  const [sessionToken, setSessionToken] = useLocalStorage('session_token', null);
  const [installInstructions, setInstallInstructions] = useState<string | undefined | null>(undefined)

  // MARK: - Functions
  
  const fetchInstallInstructions = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/notedeck-install-instructions", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionToken
      },
    });

    if (!response.ok) {
      setError("Failed to get Notedeck install instructions from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.");
      return;
    }

    const installInstructions = await response.json();
    setInstallInstructions(installInstructions.value);
  }

  useEffect(() => {
    if (loggedInAccountInfo) {
      fetchInstallInstructions();
    }
    else if (loggedInAccountInfo === null) {
      // Redirect to the login page
      window.location.href = "/purple/login?redirect=" + encodeURIComponent("/notedeck/install")
    }
  }, [loggedInAccountInfo])

  // MARK: - Render

  return (<>
    <ErrorDialog error={error} setError={setError} />
    <NotedeckInstallLayout>
      <MarkdownView className="text-purple-200">{installInstructions}</MarkdownView>
    </NotedeckInstallLayout>
  </>)
}
