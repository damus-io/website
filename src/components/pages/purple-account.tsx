import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { PurpleAccount } from "../sections/PurpleAccount";


export function PurpleAccountPage() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Damus Purple account</title>
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <PurpleAccount />
      <Footer />
    </main>
  </>)
}
