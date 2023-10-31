import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Hero } from '@/components/sections/Hero'
import Head from "next/head";
import { IntlProvider, useIntl } from 'react-intl'
import English from "../../content/compiled-locales/en.json";
import Japanese from "../../content/compiled-locales/ja.json";
import { BannedInChina } from '@/components/sections/BannedInChina'
import { DamusOnMedia } from '@/components/sections/DamusOnMedia';
import { MeetTheTeam } from '@/components/sections/MeetTheTeam';
import { DamusAroundTheWorld } from '@/components/sections/DamusAroundTheWorld';
import { Footer } from '@/components/sections/Footer';
import { DamusLiveEvents } from '@/components/sections/DamusLiveEvents';
import { Contribute } from '@/components/sections/Contribute';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Benefits } from '@/components/sections/Benefits';
import { Home } from '@/components/pages/home';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function HomePage() {
  // Automatically detect the user's locale based on their browser settings
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState(English);

  useEffect(() => {
    setLanguage(navigator.language);
  }, []);

  useEffect(() => {
    switch (language) {
      case "en":
        setMessages(English);
        break;
      case "ja":
        setMessages(Japanese);
        break;
      default:
        setMessages(English);
        break;
    }
  }, [language]);

  return (<>
    <IntlProvider
            locale={language}
            messages={messages}
            onError={() => null}>
      <Home/>
    </IntlProvider>
  </>)
}
