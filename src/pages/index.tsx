import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Hero } from '@/components/sections/Hero'
import Head from "next/head";
import { useIntl } from 'react-intl'
import { BannedInChina } from '@/components/sections/BannedInChina'
import { DamusOnMedia } from '@/components/sections/DamusOnMedia';
import { MeetTheTeam } from '@/components/sections/MeetTheTeam';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const intl = useIntl()

  return (<>
    <Head>
      <title>Damus</title>
      <meta name="description" content={ intl.formatMessage({ id: "home.meta_description", defaultMessage: "Damus is a new social network that you control. Available now on iOS, iPad and macOS (M1/M2)" }) }/>
    </Head>
    <main>
      <Hero/>
      <BannedInChina/>
      <DamusOnMedia/>
      <MeetTheTeam/>
    </main>
  </>)
}
