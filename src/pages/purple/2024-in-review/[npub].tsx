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

const PLACEHOLDER_STATS: Purple2024InReviewStats = {
  "npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s": {
    most_zapped_post: { "note": { "id": "28e9dcfe183c785596b78c93ff1f73d08d05bf13d44e9b911c61e905661d33fc", "pubkey": "bd1e19980e2c91e6dc657e92c25762ca882eb9272d2579e221f037f93788de91", "created_at": 1735794797, "kind": 1, "tags": [["imeta", "url https://image.nostr.build/6b17010ed666adc02b09d6d4b25e22afe3c0dc1d509dd8c991dcd8813a250ff3.jpg", "blurhash eBDu-,~A57S5IV4;xugMxZo0Xlox}@%2%LJ8={={xtae^*%LsSNHof", "dim 4284x5712"], ["t", "nostr"], ["p", "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245"], ["p", "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245"], ["r", "https://image.nostr.build/6b17010ed666adc02b09d6d4b25e22afe3c0dc1d509dd8c991dcd8813a250ff3.jpg"]], "content": "#nostr FTW in 2025. Ya? Lol we’re grinding. We believe in this so much. I don’t always do this but an appreciation note for nostr:npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s is needed. He’s busting his ass every day for our family and for freedom. Ya he’s sometimes a bit grouchy but it’s usually because he’s overextended himself. And/or it’s something he feels really strongly about. I love you nostr:npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s. Thanks for caring. About everything that’s important. The damus team is pumped for 2025! https://image.nostr.build/6b17010ed666adc02b09d6d4b25e22afe3c0dc1d509dd8c991dcd8813a250ff3.jpg ", "sig": "f0fa73314a3c02e6be1741f654e4c0f66d39e50a64129e98617cbf07fdcc9f57200adc731257a60beea62e241f04b314ac3d3d16d7bfb099b21e63d37d975bb5" }, "parsed_content": [{ "hashtag": "nostr" }, { "text": " FTW in 2025. Ya? Lol we’re grinding. We believe in this so much. I don’t always do this but an appreciation note for " }, { "mention": "npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s" }, { "text": " is needed. He’s busting his ass every day for our family and for freedom. Ya he’s sometimes a bit grouchy but it’s usually because he’s overextended himself. And/or it’s something he feels really strongly about. I love you " }, { "mention": "npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s" }, { "text": ". Thanks for caring. About everything that’s important. The damus team is pumped for 2025! " }, { "url": "https://image.nostr.build/6b17010ed666adc02b09d6d4b25e22afe3c0dc1d509dd8c991dcd8813a250ff3.jpg" }, { "text": " " }], "profile": { "id": "190e9d5daca0de68d4577ce9e72c6ac1028d6b65800c72e9e6cc1904068cf4e0", "pubkey": "bd1e19980e2c91e6dc657e92c25762ca882eb9272d2579e221f037f93788de91", "created_at": 1689715382, "kind": 0, "tags": [], "content": "{\"banner\":\"https://cdn.nostr.build/i/090628cf9bcc539d47ce26238e6fee6e868f9ac5dab06a681e74788f1c97182e.jpg\",\"website\":\"\",\"damus_donation_v2\":56,\"reactions\":true,\"nip05\":\"vrod@damus.io\",\"picture\":\"https://cdn.nostr.build/i/b70f3d55a5f29a8f9178145cb3c05e2e6a77a62d2149bfb3da3121399106dd10.jpg\",\"damus_donation\":56,\"lud16\":\"vanessagray31@getalby.com\",\"display_name\":\"Vanessa\",\"about\":\"Marketer, mom, living at @damus headquarters\",\"name\":\"vrod\"}", "sig": "4921cd0e975571568b39221ccdff13007d8dad01e9fd7574197c73ac479a1447ff296fd5d1ea4453150d0e5f9aeb45244aee309fa95beb0cc373134eac349b58" } },
    most_zapped_post_sats: 1524622,
    number_of_posts: 321,
  },
  "npub1gz7uczyg3kvdf8grlwfmllguc3kehrcc05yvnlypkjklptgql5kqa0zkqj": {
    most_zapped_post: { "note": { "id": "8c149bb0b500b41c8a1d8ac6e95e913cc495c141cb0427b8c87b9249551ea51c", "pubkey": "40bdcc08888d98d49d03fb93bffd1cc46d9b8f187d08c9fc81b4adf0ad00fd2c", "created_at": 1735749161, "kind": 1, "tags": [["p", "460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c", "", "mention"], ["p", "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245", "", "mention"], ["p", "d61f3bc5b3eb4400efdae6169a5c17cabf3246b514361de939ce4a1a0da6ef4a", "", "mention"], ["p", "fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52", "", "mention"], ["p", "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d", "", "mention"], ["p", "79c2cae114ea28a981e7559b4fe7854a473521a8d22a66bbab9fa248eb820ff6", "", "mention"], ["p", "97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322", "", "mention"], ["p", "ee11a5dff40c19a555f41fe42b48f00e618c91225622ae37b6c2bb67b76c4e49", "", "mention"], ["p", "e4f695f05bb05b231255ccce3d471b8d79c64a65bccc014662d27f0f7e921092", "", "mention"], ["p", "2779f3d9f42c7dee17f0e6bcdcf89a8f9d592d19e3b1bbd27ef1cffd1a7f98d1", "", "mention"], ["p", "8fb140b4e8ddef97ce4b821d247278a1a4353362623f64021484b372f948000c", "", "mention"], ["p", "a80455732d5bfa792f279011a8c871853182971994752b9cf1169611ff91a578", "", "mention"], ["p", "e2ccf7cf20403f3f2a4a55b328f0de3be38558a7d5f33632fdaaefc726c1c8eb", "", "mention"], ["p", "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2", "", "mention"]], "content": "Two years ago, the world felt chaotic, heading in a dangerous direction. I remember seeing a conversation on Stacker News about Nostr, and something clicked—I knew it was our best shot at course-correcting the mess the internet was becoming.  I knew I had to at least have a front row seat. \n\nMy first note was at block 769296 (12/28/22). Within weeks, I was essentially Nostr-only, leaving Xitter and Instagram behind. Since then, I’ve watched Nostr innovate at a pace that still feels magical.\n\nI want to thank all the builders—nostr:npub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9qewqlfnj5z nostr:npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s nostr:npub16c0nh3dnadzqpm76uctf5hqhe2lny344zsmpm6feee9p5rdxaa9q586nvr nostr:npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft nostr:npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6 nostr:npub1zuuajd7u3sx8xu92yav9jwxpr839cs0kc3q6t56vd5u9q033xmhsk6c2ucnostr:npub1w4uswmv6lu9yel005l3qgheysmr7tk9uvwluddznju3nuxalevvs2d0jr5 nostr:npub108pv4cg5ag52nq082kd5leu9ffrn2gdg6g4xdwatn73y36uzplmq9uyev6 nostr:npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn nostr:npub1acg6thl5psv62405rljzkj8spesceyfz2c32udakc2ak0dmvfeyse9p35c nostr:npub1unmftuzmkpdjxyj4en8r63cm34uuvjn9hnxqz3nz6fls7l5jzzfqtvd0j2 nostr:npub1yaul8k059377u9lsu67de7y637w4jtgeuwcmh5n7788l6xnlnrgs3tvjmf nostr:npub137c5pd8gmhhe0njtsgwjgunc5xjr2vmzvglkgqs5sjeh972gqqxqjak37w nostr:npub14qz92uedt0a8jte8jqg63jr3s5cc99cej36jh883z6tprlu354uqqe2q26 nostr:npub1utx00neqgqln72j22kej3ux7803c2k986henvvha4thuwfkper4s7r50e8 nostr:npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m (I am absolutely missing obvious people sorry this is from memory and it was a long night 😆). You’re all incredible.\n\n happy new year and heres to 2025 ☕", "sig": "b1e0a05003884267f21c054d24e0486a3878fe9d645914080bb72bfefeb693f9c321c3f683c236cff0a6a756aa20f92fa94b88e86bdced96a2dc574a0fdc0aec" }, "parsed_content": [{ "text": "Two years ago, the world felt chaotic, heading in a dangerous direction. I remember seeing a conversation on Stacker News about Nostr, and something clicked—I knew it was our best shot at course-correcting the mess the internet was becoming.  I knew I had to at least have a front row seat. \n\nMy first note was at block 769296 (12/28/22). Within weeks, I was essentially Nostr-only, leaving Xitter and Instagram behind. Since then, I’ve watched Nostr innovate at a pace that still feels magical.\n\nI want to thank all the builders—" }, { "mention": "npub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9qewqlfnj5z" }, { "text": " " }, { "mention": "npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s" }, { "text": " " }, { "mention": "npub16c0nh3dnadzqpm76uctf5hqhe2lny344zsmpm6feee9p5rdxaa9q586nvr" }, { "text": " " }, { "mention": "npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft" }, { "text": " " }, { "mention": "npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6" }, { "text": " " }, { "text": "npub1zuuajd7u3sx8xu92yav9jwxpr839cs0kc3q6t56vd5u9q033xmhsk6c2ucnostr" }, { "text": ":" }, { "mention": "npub1w4uswmv6lu9yel005l3qgheysmr7tk9uvwluddznju3nuxalevvs2d0jr5" }, { "text": " " }, { "mention": "npub108pv4cg5ag52nq082kd5leu9ffrn2gdg6g4xdwatn73y36uzplmq9uyev6" }, { "text": " " }, { "mention": "npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn" }, { "text": " " }, { "mention": "npub1acg6thl5psv62405rljzkj8spesceyfz2c32udakc2ak0dmvfeyse9p35c" }, { "text": " " }, { "mention": "npub1unmftuzmkpdjxyj4en8r63cm34uuvjn9hnxqz3nz6fls7l5jzzfqtvd0j2" }, { "text": " " }, { "mention": "npub1yaul8k059377u9lsu67de7y637w4jtgeuwcmh5n7788l6xnlnrgs3tvjmf" }, { "text": " " }, { "mention": "npub137c5pd8gmhhe0njtsgwjgunc5xjr2vmzvglkgqs5sjeh972gqqxqjak37w" }, { "text": " " }, { "mention": "npub14qz92uedt0a8jte8jqg63jr3s5cc99cej36jh883z6tprlu354uqqe2q26" }, { "text": " " }, { "mention": "npub1utx00neqgqln72j22kej3ux7803c2k986henvvha4thuwfkper4s7r50e8" }, { "text": " " }, { "mention": "npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m" }, { "text": " (I am absolutely missing obvious people sorry this is from memory and it was a long night 😆). You’re all incredible.\n\n happy new year and heres to 2025 ☕" }], "profile": { "id": "053db89c0278a14ff63fcb1b2084d428844b7b7b8e31db6d8619159b151ec68d", "pubkey": "40bdcc08888d98d49d03fb93bffd1cc46d9b8f187d08c9fc81b4adf0ad00fd2c", "created_at": 1735660989, "kind": 0, "tags": [], "content": "{\"name\":\"Dan\",\"about\":\"Est. 769,296\",\"deleted\":true,\"display_name\":\"Dan\",\"picture\":\"https://m.primal.net/NLaY.jpg\",\"banner\":\"https://i.nostr.build/ExYm.jpg\",\"nip05\":\"TheFirstDan@primal.net\",\"lud16\":\"djs@getalby.com\",\"displayName\":\"Dan\",\"pubkey\":\"40bdcc08888d98d49d03fb93bffd1cc46d9b8f187d08c9fc81b4adf0ad00fd2c\",\"npub\":\"npub1gz7uczyg3kvdf8grlwfmllguc3kehrcc05yvnlypkjklptgql5kqa0zkqj\",\"created_at\":1735568766,\"userStats\":{\"pubkey\":\"40bdcc08888d98d49d03fb93bffd1cc46d9b8f187d08c9fc81b4adf0ad00fd2c\",\"follows_count\":1239,\"followers_count\":2158,\"note_count\":1725,\"long_form_note_count\":0,\"reply_count\":2738,\"time_joined\":1672240426,\"relay_count\":7,\"total_zap_count\":740,\"total_satszapped\":120853,\"media_count\":579,\"content_zap_count\":216}}", "sig": "f84cf0a3aa33a3710e47adc9c95c5c1b4f0b33b1580b09441a273ec03a43394ffd7b94e7c79600856fd6053f57f2b964b24babc488122be8f479f55cab729281" } },
    most_zapped_post_sats: 837297,
    number_of_posts: 178,
  }
};

export async function getStaticPaths() {
  let stats: Purple2024InReviewStats = PLACEHOLDER_STATS; // TODO: Fetch from API
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
  const stats: Purple2024InReviewStats = PLACEHOLDER_STATS; // TODO: Fetch from API
  const npub = params.npub as string;
  return { props: { stats: stats[npub] } };
}
