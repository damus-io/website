import { ArrowUpRight, ChevronRight, Globe2, Sparkles } from "lucide-react";
import { MeshGradient1 } from "../effects/MeshGradient.1";
import { TopMenu } from "./TopMenu";
import { Button } from "../ui/Button";
import Image from "next/image"
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { DAMUS_APP_STORE_URL } from "@/lib/constants";
import { motion } from "framer-motion";
import { NostrIcon } from "../icons/NostrIcon";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Hero() {
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
        <div className="bg-black overflow-hidden relative min-h-screen">
            <div className="absolute z-10 pointer-events-none">
                <MeshGradient1 className="-translate-x-1/3"/>
            </div>
            <TopMenu className="w-full" customCTA={
              <InstallNowButton className="hidden lg:block" platform={platform}/>
            }/>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <div className="flex flex-col lg:flex-row items-center justify-center mt-32 lg:mt-16">
                    <div className="w-full z-20 mb-12">
                        <Link href="/purple">
                            <motion.div
                                className="inline-flex items-center text-normal rounded-full bg-gradient-to-r from-damuspink-500/10 to-damuspink-600/10 backdrop-blur-sm shadow-lg shadow-damuspink-500/10  p-2 px-6 text-white border border-damuspink-500/30 active:scale-95 transition cursor-pointer"
                                style={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
                            >
                                <NostrIcon className="h-6 mr-2 text-damuspink-600" aria-hidden="true"/>
                                {/* TODO: Add proper internationalized string */}
                                Get more from Damus with Purple
                                <ChevronRight className="ml-2"/>
                            </motion.div>
                        </Link>
                        <motion.h1
                            className="my-6 text-5xl sm:text-5xl md:text-7xl text-transparent bg-clip-text pb-6 font-semibold whitespace-pre-line max-w-2xl"
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
                            <FormattedMessage defaultMessage="The social network you control" id="home.hero.headline"/>
                        </motion.h1>
                        <motion.h2
                            className="text-white/80 text-normal md:text-xl whitespace-pre-line"
                            style={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
                        >
                            { intl.formatMessage({ id: "home.hero.subheadline", defaultMessage: "Your very own social network for your friends or business.\n Available Now on iOS, Android, and Desktop" }) }
                        </motion.h2>
                        <motion.div
                            className="mt-10 md:mt-6 flex flex-col items-center md:items-start gap-y-4 md:gap-y-1 gap-x-6"
                            style={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
                        >
                            {platform === 'ios' && (
                                <Link href={DAMUS_APP_STORE_URL} target="_blank">
                                    <Button variant="default" className="w-full md:w-auto">
                                        { intl.formatMessage({ id: "home.hero.download_now", defaultMessage: "Download now for iOS" }) }
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
                                        { intl.formatMessage({ id: "home.hero.check-out-damus-android", defaultMessage: "Download Damus for Android" }) }
                                        <ArrowUpRight className="ml-2" />
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                        <motion.div
                            className="text-white/80 text-sm flex flex-col md:flex-row justify-center md:justify-start items-center mt-12 md:mt-8 gap-x-2 gap-y-4"
                            style={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 2, duration: 1 } }}
                        >
                            <div className="flex items-center flex-wrap">
                                <Globe2 className="text-green-500 h-4"/>
                                <div>{ intl.formatMessage({ id: "home.hero.available_in", defaultMessage: "Available in" }) }</div>
                            </div>
                            <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-4">
                                <div className="text-white">English</div>
                                <div className="text-white">Español</div>
                                <div className="text-white">Italiano</div>
                                <div className="text-white">Português</div>
                                <div className="text-white">Deutsch</div>
                                <div className="text-white">日本語</div>
                                <div className="text-white">中文</div>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div
                        className="relative w-full lg:w-3/4 h-[400px] md:h-[800px]"
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
                    >
                        <Image
                            src="/Hero.webp"
                            className="object-contain"
                            sizes="(max-width: 800px) 100vw, 800px"
                            fill
                            alt={"Damus social network running on an iPhone"}
                        />
                        <div className="absolute z-0">
                            {/* Put a big circle with gradient in the very middle of the section */}
                            <div className="hidden lg:block w-[600px] h-[600px] xl:w-[800px] xl:h-[800px] rounded-full bg-black lg:-translate-x-3/4 shadow-[0px_15px_30px_-15px_#5B1442] lg:shadow-[15px_0px_30px_-15px_#5B1442]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </>)
}

export function InstallNowButton({ platform, className }: { platform: string, className?: string }) {
  const intl = useIntl()
    
  let label = intl.formatMessage(
    platform === "ios"
      ? { id: "notedeck.hero.install.ios", defaultMessage: "Get Damus" }
      : platform === "android"
      ? { id: "notedeck.hero.install.android", defaultMessage: "Get Damus" }
      : { id: "notedeck.hero.install.desktop", defaultMessage: "Get Notedeck" }
  )
  
  let url = platform === "ios"
    ? DAMUS_APP_STORE_URL
    : platform === "android"
    ? "/android/install"
    : "/notedeck/install"

  return (
    <Link href={url} className={cn("w-full md:w-auto", className)}>
      <Button variant="accent" className="w-full flex gap-x-2 text-lg font-semibold">
        <Sparkles className="w-4 h-4"/>
        {label}
      </Button>
    </Link>
  )
}
