import { MeshGradient2 } from "../effects/MeshGradient.2";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import Image from "next/image";

const mediaCoverage = [
    {
        mediaLogo: "/brand-logos/forbes.png",
        date: new Date("2022-12-29"),
        headline: "Nostr Is The Decentralized Protocol That Might Replace Elon Musk’s Twitter",
        linkUrl: "https://www.forbes.com/sites/rogerhuang/2022/12/29/nostr-is-the-decentralized-protocol-that-might-replace-elon-musks-twitter/?sh=d8ea5e3442af"
    },
    {
        mediaLogo: "/brand-logos/forbes.png",
        date: new Date("2023-04-11"),
        headline: "How To Get Started With Nostr, Jack Dorsey’s Favorite Decentralized Social Network",
        linkUrl: "https://www.forbes.com/sites/digital-assets/2023/04/11/how-to-get-started-with-nostr/?sh=4a1f84f8406b"
    },
    {
        mediaLogo: "/brand-logos/coindesk-full.png",
        date: new Date("2023-04-17"),
        headline: "Thank Elon for Making the Use Case for Twitter Competitor Nostr",
        linkUrl: "https://www.coindesk.com/consensus-magazine/2023/04/17/nostr-decentralized-social-media/"
    },
    {
        mediaLogo: "/brand-logos/coindesk-full.png",
        date: new Date("2023-04-20"),
        headline: "The Use Case for Twitter Competitor Nostr",
        linkUrl: "https://www.coindesk.com/video/the-use-case-for-twitter-competitor-nostr/"
    },
    {
        mediaLogo: "/brand-logos/youtube.png",
        date: new Date("2023-05-11"),
        headline: "BR034 - Nostr Taking off! Catch-up with NVK ft. Fiatjaf, JB55, Pablo & Odell",
        linkUrl: "https://www.youtube.com/watch?v=Ul74FXtJ6Bw"
    },
    {
        mediaLogo: "/brand-logos/forbes.png",
        date: new Date("2023-05-30"),
        headline: "Meet @Fiatjaf, The Mysterious Nostr Creator Who Has Lured 18 Million Users And $5 Million From Jack Dorsey",
        linkUrl: "https://www.forbes.com/sites/digital-assets/2023/05/30/bitcoin-social-network-nostr-creator-fiatjaf-/?sh=381d061b11c0"
    },
    {
        mediaLogo: "/brand-logos/x.png",
        date: new Date("2023-07-15"),
        headline: "Let's enjoy it together, talk with its creators & featured heroes, and watch extra scenes and a few bloopers.",
        linkUrl: "https://twitter.com/filmfestbtc/status/1680155417031188481"
    },
    {
        mediaLogo: "/brand-logos/youtube.png",
        date: new Date("2023-08-16"),
        headline: "William Casarin | Creator of Damus App | Simply Bitcoin IRL",
        linkUrl: "https://www.youtube.com/watch?v=Xk3jWC-KBZ0"
    },
    {
        mediaLogo: "/brand-logos/youtube.png",
        date: new Date("2023-08-30"),
        headline: "Nostr and the Future of Social Media with Will Casarin (WiM359)",
        linkUrl: "https://www.youtube.com/watch?v=2mLUdBnJ0ls"
    },
    {
        mediaLogo: "/brand-logos/coinmarketcap.png",
        date: new Date("2023-01-01"),
        headline: "Twitter’s Web 3.0 Alternative Damus is Giving Away Satoshi to Incentivize User Engagement",
        linkUrl: "https://coinmarketcap.com/community/articles/63e37f87a1bcb9298d237f7d/"
    },

]

export function DamusOnMedia({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div className={cn("bg-black overflow-hidden relative min-h-screen", className)}>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-32">
                        <motion.h2 className="text-6xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-30% to-cyan-500 to-100% font-semibold">
                            { intl.formatMessage({ id: "damus_on_media.headline", defaultMessage: "Damus on media" }) }
                        </motion.h2>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-16 items-center justify-center">
                        {mediaCoverage.map((item, index) => (
                            <Link key={index} className="max-w-xs flex flex-col items-center justify-center" href={item.linkUrl} target="_blank">
                                <RoundedContainerWithGradientBorder className="hover:scale-105 active:scale-95 transition w-48">
                                    <Image
                                        src={item.mediaLogo}
                                        className="p-6 object-contain"
                                        fill
                                        sizes="300px"
                                        alt=""
                                    />
                                </RoundedContainerWithGradientBorder>
                                <h3 className="text-white/70 text-center text-sm font-semibold mt-8 hover:underline">
                                    { intl.formatDate(item.date, { month: "short", year: "numeric" }) }
                                </h3>
                                <p className="text-transparent bg-clip-text bg-gradient-to-br from-white from-30% to-cyan-200 to-100% text-center text-normal mt-4 hover:underline">
                                    {item.headline}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>)
}