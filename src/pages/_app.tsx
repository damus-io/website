import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import English from "../../content/compiled-locales/en.json";
import Japanese from "../../content/compiled-locales/ja.json";
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider
      locale={"en"}
      messages={English}>
      <Component {...pageProps} />
    </IntlProvider>
  )
}
