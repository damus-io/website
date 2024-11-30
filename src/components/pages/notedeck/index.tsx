import Head from "next/head";
import { useIntl } from 'react-intl'
import { Footer } from '@/components/sections/Footer';
import { NotedeckHero } from '@/components/sections/Notedeck/NotedeckHero';
import { NotedeckWaitlistForm } from "@/components/sections/Notedeck/WaitlistForm";
import { Benefits } from "@/components/sections/Notedeck/Benefits";
import { NotIncluded } from "@/components/sections/Notedeck/NotIncluded";
import { ShareFeedback } from "@/components/sections/Notedeck/ShareFeedback";
import { NotedeckFAQ } from "@/components/sections/Notedeck/NotedeckFAQ";
import { WhatIsNotedeck } from "@/components/sections/Notedeck/WhatIsNotedeck";
import { Recap } from "@/components/sections/Notedeck/Recap";
import { motion } from "framer-motion";
import { TopMenu } from "@/components/sections/TopMenu";
import { InstallNowButton } from "@/components/sections/Notedeck/NotedeckHero";

export function Notedeck() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Notedeck</title>
      <meta name="description" content={intl.formatMessage({ id: "notedeck.meta_description", defaultMessage: "Notedeck is a powerful, performant Nostr client for Linux, Windows, and macOS" })} />
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
            <InstallNowButton className="hidden lg:block"/>
          }
          hideLogoOnTop={true}
        />
      </motion.div>
      <NotedeckHero/>
      <WhatIsNotedeck />
      <Benefits />
      <NotIncluded />
      <NotedeckFAQ />
      <ShareFeedback />
      <Recap />
      <Footer />
    </main>
  </>)
}
