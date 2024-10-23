import Head from "next/head";
import { PurpleWelcome } from "../sections/PurpleWelcome";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { ErrorDialog } from "../ErrorDialog";
import { usePurpleLoginSession } from "@/hooks/usePurpleLoginSession";


export function PurpleWelcomePage() {
  const intl = useIntl()
  const [error, setError] = useState<string | null>(null)
  const { accountInfo: existingAccountInfo, logout } = usePurpleLoginSession(setError)
  
  useEffect(() => {
    if (existingAccountInfo === null) {
      // Redirect to the login page
      window.location.href = "/purple/login?redirect=" + encodeURIComponent("/purple/welcome")
    }
  }, [existingAccountInfo])

  return (<>
    <Head>
      <title>Welcome to Damus Purple</title>
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <ErrorDialog error={error} setError={setError} />
      {existingAccountInfo && <PurpleWelcome/>}
    </main>
  </>)
}
