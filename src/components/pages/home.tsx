import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Hero } from '@/components/sections/Hero'
import Head from "next/head";
import { useIntl } from 'react-intl'
import { BannedInChina } from '@/components/sections/BannedInChina'
import { DamusOnMedia } from '@/components/sections/DamusOnMedia';
import { MeetTheTeam } from '@/components/sections/MeetTheTeam';
import { DamusAroundTheWorld } from '@/components/sections/DamusAroundTheWorld';
import { Footer } from '@/components/sections/Footer';
import { DamusLiveEvents } from '@/components/sections/DamusLiveEvents';
import { Contribute } from '@/components/sections/Contribute';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Benefits } from '@/components/sections/Benefits';
import { PurpleBanner } from '../sections/PurpleBanner';

const inter = Inter({ subsets: ['latin'] })

export function Home() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Damus</title>
      <meta name="description" content={ intl.formatMessage({ id: "home.meta_description", defaultMessage: "Damus is a new social network that you control. Available now on iOS, iPad and macOS (M1/M2)" }) }/>
      <meta name="apple-itunes-app" content="app-id=1628663131"/>
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      <Hero/>
      <Benefits/>
      <PurpleBanner/>
      <BannedInChina/>
      <div id="events">
        <DamusLiveEvents/>
      </div>
      <DamusOnMedia/>
      <div id="team">
        <MeetTheTeam/>
      </div>
      <div id="contribute">
        <Contribute/>
      </div>
      <DamusAroundTheWorld/>
      <FinalCTA/>
      <Footer/>
    </main>
  </>)
}
