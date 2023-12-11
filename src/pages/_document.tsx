import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content="Damus"/>
        <meta property="og:description" content="A new social network that you control"/>
        <meta property="og:image" content="https://damus.io/logo_icon.png"/>
        <meta property="og:url" content="https://damus.io"/>
        <meta name="keywords" content="Damus, nostr client, decentralized, social media, censorship resistant, open source, iOS, iPad, macOS"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:image" content="https://damus.io/logo_icon.png"/>
        <meta name="twitter:description" content="Damus - A new social network that you control"/>
        <meta name="twitter:title" content="Damus"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
