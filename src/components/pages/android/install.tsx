import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { InstallInstructions } from "../../sections/DamusAndroid/InstallInstructions";

export function DamusAndroidInstallPage() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Install Damus Android</title>
      <meta name="description" content={intl.formatMessage({ id: "damus-android.meta_description", defaultMessage: "Damus Android is a powerful, performant Nostr client for Android devices" })} />
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <InstallInstructions/>
      <Footer />
    </main>
  </>)
}