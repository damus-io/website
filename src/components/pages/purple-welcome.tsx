import Head from "next/head";
import { PurpleWelcome } from "../sections/PurpleWelcome";
import { useIntl } from "react-intl";
import { useLocalStorage } from "usehooks-ts";
import { AccountInfo } from "@/utils/PurpleUtils";
import { useEffect, useState } from "react";
import { ErrorDialog } from "../ErrorDialog";


export function PurpleWelcomePage() {
  const intl = useIntl()
  
  // MARK: - Auth handling
  
  const [sessionToken, setSessionToken] = useLocalStorage('session_token', null)
  const [existingAccountInfo, setExistingAccountInfo] = useState<AccountInfo | null | undefined>(undefined)  // The account info fetched from the server
  const [error, setError] = useState<string | null>(null)
  
  const fetchAccountInfo = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/sessions/account", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionToken
        },
      })
      if (!response.ok) {
        setError("Failed to get account info from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
        return
      }
      const accountInfo = await response.json()
      console.log(accountInfo)
      setExistingAccountInfo(accountInfo)
    }
    catch (e) {
      console.error(e)
      setError("Failed to get account info from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.")
    }
  }
  
  useEffect(() => {
    if (sessionToken) {
      fetchAccountInfo()
    }
    else if (sessionToken === null) {
      // Redirect to the login page
      window.location.href = "/purple/login?redirect=" + encodeURIComponent("/purple/welcome")
    }
  }, [sessionToken])

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
