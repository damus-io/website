import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { ErrorDialog } from "../../ErrorDialog";
import { usePurpleLoginSessionToken } from "@/hooks/usePurpleLoginSession";
import { DamusAndroidInstallLayout } from "../../DamusAndroidInstallLayout";
import { MarkdownView } from "@/components/ui/MarkdownView";

export function InstallInstructions() {
  const intl = useIntl()
  const [error, setError] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = usePurpleLoginSessionToken();
  const [installInstructions, setInstallInstructions] = useState<string | undefined | null>(undefined)

  // MARK: - Functions

  const fetchInstallInstructions = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/damus-android-install-instructions", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionToken
      },
    });

    if (response.status === 401) {  // Unauthorized
      // Redirect to the login page
      window.location.href = "/purple/login?redirect=" + encodeURIComponent("/damus-android/install")
      return;
    }

    if (!response.ok) {
      setError("Failed to get Damus Android install instructions from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.");
      return;
    }

    const installInstructions = await response.json();
    setInstallInstructions(installInstructions.value);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchInstallInstructions();
  }, [sessionToken])

  // MARK: - Render

  return (<>
    <ErrorDialog error={error} setError={setError} />
    <DamusAndroidInstallLayout>
      <MarkdownView className="text-purple-200">{installInstructions}</MarkdownView>
    </DamusAndroidInstallLayout>
  </>)
}