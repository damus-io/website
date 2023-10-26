import { MeshGradient2 } from "../effects/MeshGradient.2";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "../ui/SpecialSquareIcon";
import { cn } from "@/lib/utils";
import Image from "next/image";

const bannedInChinaNews = [
    {
        mediaLogo: "/brand-logos/tech-crunch.png",
        name: "Tech Crunch",
        headline: "‘Damus pulled from Apple’s App Store in China after two days’",
        linkUrl: "https://techcrunch.com/2023/02/02/damus-pulled-from-apples-app-store-in-china-after-two-days/"
    },
    {
        mediaLogo: "/brand-logos/epoch-times.png",
        name: "Epoch Times",
        headline: "'That Was Fast': China Bans Decentralized Twitter-Like App Over 'Illegal Content'",
        linkUrl: "https://www.theepochtimes.com/tech/apple-removes-decentralized-twitter-like-app-damus-from-chinese-app-store-5036072"
    },
    {
        mediaLogo: "/brand-logos/coindesk.webp",
        name: "CoinDesk",
        headline: "Jack Dorsey-Based Social Network Nostr's Damus App Banned From China App Store",
        linkUrl: "https://www.coindesk.com/business/2023/02/03/jack-dorsey-based-social-network-nostr-gets-damus-app-banned-from-china-app-store/"
    },
]

export function BannedInChina({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div className={cn("bg-black overflow-y-visible overflow-x-hidden relative", className)}>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-32">
                        <motion.h2 className="text-6xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-[#FF7979] from-30% to-[#9378FF] to-100% font-semibold">
                            { intl.formatMessage({ id: "banned_in_china.headline", defaultMessage: "Banned in China" }) }
                        </motion.h2>
                        <MeshGradient2 className="absolute top-0 left-0 -translate-x-[350px] md:-translate-x-[250px] -translate-y-[250px] scale-75 md:scale-100 pointer-events-none"/>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-16 items-center justify-center">
                        {bannedInChinaNews.map((item, index) => (
                            <Link key={index} className="max-w-xs flex flex-col items-center justify-center" href={item.linkUrl} target="_blank">
                                <RoundedContainerWithGradientBorder className="hover:scale-105 active:scale-95 transition">
                                    <Image
                                        src={item.mediaLogo}
                                        className="p-6 object-contain"
                                        fill
                                        sizes="300px"
                                        alt=""
                                    />
                                </RoundedContainerWithGradientBorder>
                                <h3 className="text-white/70 text-center text-sm font-semibold mt-8 hover:underline">
                                    {item.name}
                                </h3>
                                <p className="text-white/90 text-center text-normal mt-4 hover:underline">
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