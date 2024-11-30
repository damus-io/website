import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { InstallInstructions } from "@/components/sections/Notedeck/InstallInstructions";

export function NotedeckInstallPage() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Install Notedeck</title>
      <meta name="description" content={intl.formatMessage({ id: "notedeck.meta_description", defaultMessage: "Notedeck is a powerful, performant Nostr client for Linux, Windows, and macOS" })} />
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <InstallInstructions/>
      <Footer />
    </main>
  </>)
}
