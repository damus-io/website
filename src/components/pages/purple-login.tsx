import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { PurpleCheckout as CheckoutSection } from '@/components/sections/PurpleCheckout';
import { PurpleLogin } from "../sections/PurpleLogin";


export function PurpleLoginPage() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Damus Purple login</title>
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <PurpleLogin />
      <Footer />
    </main>
  </>)
}
