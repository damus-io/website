import { Button } from "../ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Ticker, TickerImage } from "../ui/Ticker";
import { ArrowUpRight, MessageCircleIcon, GitBranch, Github } from "lucide-react";
import { DAMUS_APP_STORE_URL } from "@/lib/constants";
import { MeshGradient4 } from "../effects/MeshGradient.4";
import { GithubIcon } from "../icons/GithubIcon";
import { useEffect, useState } from "react";

export function FinalCTA({ className }: { className?: string }) {
    const intl = useIntl()
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop')

    useEffect(() => {
        // Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase()
        
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios')
        } else if (/android/.test(userAgent)) {
            setPlatform('android')
        } else {
            setPlatform('desktop')
        }
    }, [])

    return (<>
        <div className={cn("bg-black overflow-hidden relative", className)}>
            <div className="container mx-auto px-6 pb-24 pt-24">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-24 flex flex-col items-center justify-center">
                        <div className="absolute pointer-events-none">
                            <MeshGradient4/>
                        </div>
                        <div className="relative w-24 h-24 mb-8 rounded-xl overflow-hidden shadow-xl">
                            <Image
                                src="/logo_icon.png"
                                className="object-cover"
                                fill
                                sizes="300px"
                                alt=""
                                aria-hidden
                            />
                        </div>
                        <motion.h2 className="mb-8 text-4xl md:text-5xl lg:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-5% to-[#E0A4D3] to-100% font-semibold pb-4 whitespace-pre-line leading-relaxed">
                            { intl.formatMessage({ id: "final_cta.headline", defaultMessage: "Download Damus today!" }) }
                        </motion.h2>
                        <motion.div className="text-xl text-center max-w-2xl mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white from-5% to-[#8DEBF8] to-100% whitespace-pre-line leading-loose">
                            {(intl.locale != "ja" || process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (<>
                                { intl.formatMessage({ id: "final_cta.subheadline", defaultMessage: "Damus is available on iOS, Android, and Desktop.\nIt's free and open source." }) }
                            </>)}
                        </motion.div>
                        <motion.div
                            className="mt-10 md:mt-6 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6"
                            style={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
                        >
                            {platform === 'ios' && (
                                <Link href={DAMUS_APP_STORE_URL} target="_blank">
                                    <Button variant="default" className="w-full md:w-auto">
                                        { intl.formatMessage({ id: "home.hero.download_now", defaultMessage: "Download for iOS" }) }
                                        <ArrowUpRight className="ml-2" />
                                    </Button>
                                </Link>
                            )}
                            {platform === 'desktop' && (
                                <Link href={"/notedeck"} target="_blank">
                                    <Button variant="default" className="w-full md:w-auto">
                                        { intl.formatMessage({ id: "home.hero.check-out-notedeck", defaultMessage: "Download Notedeck for Desktop" }) }
                                        <ArrowUpRight className="ml-2" />
                                    </Button>
                                </Link>
                            )}
                            {platform === 'android' && (
                                <Link href={"/android"} target="_blank">
                                    <Button variant="default" className="w-full md:w-auto">
                                        { intl.formatMessage({ id: "home.hero.check-out-damus-android", defaultMessage: "Download for Android" }) }
                                        <ArrowUpRight className="ml-2" />
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
