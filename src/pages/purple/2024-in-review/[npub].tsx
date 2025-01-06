import { ParsedNote } from "@/components/note/NostrNoteView";
import { useEffect, useState } from "react";
import English from "@/../content/compiled-locales/en.json";
import { IntlProvider, useIntl } from 'react-intl'
import { Purple2024YearInReview } from "@/components/pages/purple-2024-year-in-review";

export default function User2024InReviewPage({ stats }: { stats: Npub2024InReviewStats }) {
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
        // TODO: Add Japanese translations and then switch to "Japanese" below
        setMessages(English);
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
      <Purple2024YearInReview stats={stats} />
    </IntlProvider>
  </>)
}


type Purple2024InReviewStats = Record<npub, Npub2024InReviewStats>;
type npub = string;
export type Npub2024InReviewStats = {
  most_zapped_post: ParsedNote
  most_zapped_post_sats: number
  number_of_posts?: number
};

export async function getStaticPaths() {
  let stats: Purple2024InReviewStats = require('stats.json'); // TODO: Fetch from API
  const paths = Object.keys(stats).map((npub) => ({ params: { npub } }));
  return { paths, fallback: false };
}

type Params = {
  params: {
    npub: string;
  };
};

// This also gets called at build time
export async function getStaticProps({ params }: Params) {
  const stats: Purple2024InReviewStats = require('stats.json'); // TODO: Fetch from API
  const npub = params.npub as string;
  return { props: { stats: stats[npub] } };
}
