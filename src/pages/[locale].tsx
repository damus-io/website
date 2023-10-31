import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Hero } from '@/components/sections/Hero'
import Head from "next/head";
import { IntlProvider, useIntl } from 'react-intl'
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
import { useMemo } from 'react';
import English from "../../content/compiled-locales/en.json";
import Japanese from "../../content/compiled-locales/ja.json";


export default function LocaleHome({ locale }: { locale: string }) {
    const [shortLocale] = locale ? locale.split("-") : ["en"];

    const messages = useMemo(() => {
      switch (shortLocale) {
          case "en":
              return English;
          case "ja":
            return Japanese;
          default:
              return English;
      }
    }, [shortLocale]);

    return (<>
      <IntlProvider
            locale={shortLocale}
            messages={messages}
            onError={() => null}>
            <Home/>
        </IntlProvider>
    </>)
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Define your locales
  const locales = ['en-US', 'ja-JP'];

  // Generate paths
  const paths = locales.map((locale) => ({
    params: { locale },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const locale = params?.locale;

  return {
    props: {
      locale,
    }
  };
};