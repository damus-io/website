import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AccountInfo } from "@/utils/PurpleUtils";


export function usePurpleLoginSession(setError: (message: string) => void) {
  const [sessionToken, setSessionToken] = useLocalStorage('session_token', null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined | null>(undefined);
  
  const logout = () => {
    setSessionToken(null);
    setAccountInfo(null);
  };

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!sessionToken) {
        setAccountInfo(null);
        return;
      }

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_PURPLE_API_BASE_URL + "/sessions/account", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionToken
          },
        });

        if (!response.ok) {
          setError("Failed to get account info from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.");
          return;
        }

        const accountInfo = await response.json();
        setAccountInfo(accountInfo);
      } catch (e) {
        setError("Failed to get account info from our servers. Please wait a few minutes and refresh the page. If the problem persists, please contact support.");
      }
    };

    fetchAccountInfo();
  }, [sessionToken]);

  return { accountInfo, logout }
}
