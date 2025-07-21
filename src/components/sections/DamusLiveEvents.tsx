import { MeshGradient2 } from "../effects/MeshGradient.2";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MeshGradient3 } from "../effects/MeshGradient.3";

const events = [
    {
        picture: "/event-logos/vancouver.jpeg",
        linkUrl: "https://www.learningbitcoin.ca/",
        locationIntlString: "events.location.vancouver_canada",
        name: "Learning Bitcoin Vancouver 2025",
        startDate: new Date(2025, 7, 16), // Month is 0-indexed in JavaScript, so 7 = August
        endDate: new Date(2025, 7, 17),
    },
    {
        picture: "/event-logos/bitcoin-is-for-everyone.png",
        linkUrl: "https://bitcoinisforeveryone.com/tickets",
        locationIntlString: "events.location.portland_oregon",
        name: "Bitcoin is for Everyone 2025",
        startDate: new Date(2025, 7, 1), // Month is 0-indexed in JavaScript, so 7 = August
        endDate: new Date(2025, 7, 1),
    },
    {
        picture: "/event-logos/bitcoin-asia.png",
        linkUrl: "https://b.tc/conference/asia",
        locationIntlString: "events.location.hong_kong",
        name: "Bitcoin Asia 2025",
        startDate: new Date(2025, 7, 28), // Month is 0-indexed in JavaScript, so 7 = August
        endDate: new Date(2025, 7, 29),
    },
    {
        picture: "/event-logos/canadian-bitcoin-conference.png",
        linkUrl: "https://canadianbitcoinconf.com",
        locationIntlString: "events.location.montreal_canada",
        name: "Canadian Bitcoin Conference 2025",
        startDate: new Date(2025, 9, 16), // Month is 0-indexed in JavaScript, so 9 = October
        endDate: new Date(2025, 9, 18),
    },
]

export function DamusLiveEvents({ className }: { className?: string }) {
    const intl = useIntl()

    // This type of structure is necessary in this case to make strings get picked up by `npm run i18n`
    const locationIntlStrings: Record<string, string> = {
        "events.location.vancouver_canada": intl.formatMessage({ id: "events.location.vancouver_canada", defaultMessage: "Vancouver, Canada" }),
        "events.location.portland_oregon": intl.formatMessage({ id: "events.location.portland_oregon", defaultMessage: "Portland, Oregon" }),
        "events.location.hong_kong": intl.formatMessage({ id: "events.location.hong_kong", defaultMessage: "Hong Kong" }),
        "events.location.montreal_canada": intl.formatMessage({ id: "events.location.montreal_canada", defaultMessage: "Montreal, Canada" }),
    }

    return (<>
        <div className={cn("bg-black overflow-hidden relative min-h-screen", className)}>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <RoundedContainerWithGradientBorder className="w-full h-full max-w-6xl overflow-hidden" allItemsClassName="rounded-3xl">
                        <div className="absolute pointer-events-none top-0 left-0">
                            <MeshGradient3/>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center justify-between p-4 md:p-6 px-4 md:px-12">
                            <motion.h1 
                                className="my-6 text-5xl sm:text-5xl md:text-8xl !leading-relaxed text-transparent bg-clip-text pb-6 font-semibold whitespace-pre-line text-center lg:text-left"
                                style={{
                                    backgroundImage: "linear-gradient(to right, #ffffff -100%, #ffffff -40%, #2D175B 100%)",
                                    opacity: 0
                                }}
                                animate={{ 
                                    backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 40%, #2D175B 100%)",
                                    transition: { duration: 3 },
                                    opacity: 1
                                }}
                            >
                                { intl.formatMessage({ id: "damus_live_events.headline", defaultMessage: "Damus.\nLive.\nEvents." }) }
                            </motion.h1>
                            {/* Vertical line */}
                            <div className="hidden lg:block w-px h-96 bg-white/10 backdrop-blur-sm"/>
                            <div className="flex flex-col gap-4">
                                {events.map((item, index) => (
                                    <div key={index} className="w-full max-w-lg flex flex-col md:flex-row items-center justify-between h-full bg-white/20 rounded-xl p-6 gap-4">
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                            <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden">
                                                <Image
                                                    src={item.picture}
                                                    className="object-cover"
                                                    fill
                                                    sizes="300px"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center items-center md:items-start">
                                                <div className="text-white/70 text-center text-xs font-semibold">
                                                    {intl.formatMessage({ id: "damus_live_events.date_range", defaultMessage: "{startDate} – {endDate}" }, { 
                                                        startDate: intl.formatDate(item.startDate, { month: "short", day: "numeric", timeZone: "UTC" }), 
                                                        endDate: intl.formatDate(item.endDate, { month: "short", day: "numeric", timeZone: "UTC" }) 
                                                    })}
                                                </div>
                                                <div className="text-xl text-white font-bold mt-1 text-center md:text-left">
                                                    {item.name}
                                                </div>
                                                <div className="text-white/70 text-center text-xs font-normal mt-1">
                                                    {locationIntlStrings[item.locationIntlString]}
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={item.linkUrl} target="_blank" className="mt-4">
                                            <Button variant="secondary" className="flex items-center rounded-lg px-6">
                                                <span className="text-md whitespace-nowrap">{intl.formatMessage({ id: "damus_live_events.visit_button.label", defaultMessage: "Visit" })}</span>
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RoundedContainerWithGradientBorder>
                </div>
            </div>
        </div>
    </>)
}
