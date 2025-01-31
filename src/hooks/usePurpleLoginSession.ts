import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AccountInfo } from "@/utils/PurpleUtils";

export const LOGIN_SESSION_TOKEN_LOCAL_STORAGE_KEY = 'session_token';

export function usePurpleLoginSessionToken() {
  return useLocalStorage(LOGIN_SESSION_TOKEN_LOCAL_STORAGE_KEY, null);
}

export function usePurpleLoginSession(setError: (message: string) => void) {
  const [sessionToken, setSessionToken] = usePurpleLoginSessionToken();
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
        
        if (response.status === 401) {
          setSessionToken(null);
          setAccountInfo(null);
          return;
        }

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
