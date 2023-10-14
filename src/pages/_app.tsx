import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import English from "../../content/compiled-locales/en.json";
import Portuguese from "../../content/compiled-locales/pt.json";
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';

export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
    const [shortLocale] = locale ? locale.split("-") : ["en"];

    const messages = useMemo(() => {
      switch (shortLocale) {
          case "en":
              return English;
          case "pt":
            return Portuguese;
          default:
              return English;
      }
  }, [shortLocale]);
    
  return (
    <IntlProvider
            locale={shortLocale}
            messages={messages}
            onError={() => null}>
      <Component {...pageProps} />
    </IntlProvider>
  )
}
