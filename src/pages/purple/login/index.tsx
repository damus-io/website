import { Inter } from 'next/font/google'
import { IntlProvider, useIntl } from 'react-intl'
import English from "@/../content/compiled-locales/en.json";
import Japanese from "@/../content/compiled-locales/ja.json";
import { useEffect } from 'react';
import { useState } from 'react';
import { Purple } from '@/components/pages/purple';
import { PurpleCheckout } from '@/components/pages/purple-checkout';
import { PurpleLoginPage } from '@/components/pages/purple-login';

export default function HomePage() {
  // Automatically detect the user's locale based on their browser settings
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState(English);

  useEffect(() => {
    setLanguage(navigator.language);
  }, []);

  useEffect(() => {
    switch (language) {
      case "en":
        setMessages(English);
        break;
      case "ja":
        // TODO: Add Japanese translations and then switch to "Japanese" below
        setMessages(English);
        break;
      default:
        setMessages(English);
        break;
    }
  }, [language]);

  return (<>
    <IntlProvider
      locale={language}
      messages={messages}
      onError={() => null}>
      <PurpleLoginPage />
    </IntlProvider>
  </>)
}

