import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { NotedeckHero } from '../sections/Notedeck/NotedeckHero';
import { NotedeckWaitlistForm } from "../sections/Notedeck/WaitlistForm";

export function Notedeck() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Notedeck</title>
      <meta name="description" content={intl.formatMessage({ id: "notedeck.meta_description", defaultMessage: "Notedeck is a powerful, performant Nostr client for Linux, Windows, and macOS" })} />
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <NotedeckHero/>
      <NotedeckWaitlistForm />
      <Footer />
    </main>
  </>)
}
