import { IntlProvider } from 'react-intl'
import English from "@/../content/compiled-locales/en.json";
import { useEffect, useState } from 'react';
import { TestflightPage } from '@/components/pages/testflight';

export default function Page() {
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
      <TestflightPage />
    </IntlProvider>
  </>)
}
