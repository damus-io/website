import Head from "next/head";
import { useIntl } from 'react-intl';
import { Footer } from '@/components/sections/Footer';
import { motion } from "framer-motion";
import { TopMenu } from "@/components/sections/TopMenu";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Zap, Download, ArrowRight } from "lucide-react";
import { Onest } from 'next/font/google';
import { cn } from "@/lib/utils";
import { WhatIsDamusAndroid } from "@/components/sections/DamusAndroid/WhatIsDamusAndroid";
import { AiFeatures } from "@/components/sections/DamusAndroid/AiFeatures";
import { FreedomFeatures } from "@/components/sections/DamusAndroid/FreedomFeatures";
import { DamusAndroidFAQ } from "@/components/sections/DamusAndroid/DamusAndroidFAQ";
import { Recap } from "@/components/sections/DamusAndroid/Recap";
import { DamusAndroidHero, DownloadNowButton } from "@/components/sections/DamusAndroid/DamusAndroidHero";

const onest = Onest({ subsets: ['latin'] });

export function DamusAndroid() {
  const intl = useIntl();

  return (<>
    <Head>
      <title>Damus Android</title>
      <meta name="description" content={intl.formatMessage({ id: "damus-android.meta_description", defaultMessage: "Damus Android is a powerful, performant Nostr client for Android devices" })} />
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <motion.div
        className="w-full"
        style={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
      >
        <TopMenu
          className="w-full z-10"
          customCTA={
            <DownloadNowButton className="hidden lg:block"/>
          }
          hideLogoOnTop={true}
        />
      </motion.div>
      
      {/* Hero Section */}
      <DamusAndroidHero introducing={true} />
      
      {/* What is Damus Android Section */}
      <WhatIsDamusAndroid />
      
      {/* Freedom Features Section */}
      <FreedomFeatures />
      
      {/* AI Features Section */}
      <AiFeatures />
      
      {/* FAQ Section */}
      <DamusAndroidFAQ />
      
      {/* Recap Section (replaced Download Section) */}
      <Recap />
      
      <Footer />
    </main>
  </>)
}

// Note: DownloadButton is now imported from DamusAndroidHero as DownloadNowButton
