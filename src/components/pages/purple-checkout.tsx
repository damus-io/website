import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { PurpleCheckout as CheckoutSection } from '@/components/sections/PurpleCheckout';
import { useEffect, useState } from "react";
import { PurpleCheckoutMaintenance } from "../sections/PurpleCheckoutMaintenance";


export function PurpleCheckout() {
  const intl = useIntl()
  const [underMaintenance, setUnderMaintenance] = useState(false);
  
  // Declare the function to check maintenance status
  const checkIfUnderMaintenance = async () => {
    const response = await fetch('/purple-checkout-maintenance');
    // If response is 200 OK, return true, if 404 Not Found, return false
    return response.status === 200;
  }
  
  useEffect(() => {
    checkIfUnderMaintenance().then((isUnderMaintenance: boolean) => {
      setUnderMaintenance(isUnderMaintenance);
    }).catch(error => {
      console.error('Failed to check maintenance status:', error);
    });
  }, []);

  return (<>
    <Head>
      <title>Damus Purple checkout</title>
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      {underMaintenance ? <PurpleCheckoutMaintenance /> : <CheckoutSection />}
      <Footer />
    </main>
  </>)
}
