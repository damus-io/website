import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { PurpleCheckout as CheckoutSection } from '@/components/sections/PurpleCheckout';


export function PurpleCheckout() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Damus Purple checkout</title>
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <CheckoutSection />
      <Footer />
    </main>
  </>)
}
