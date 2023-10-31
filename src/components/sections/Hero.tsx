import { ArrowUpRight, ChevronRight, Globe2 } from "lucide-react";
import { MeshGradient1 } from "../effects/MeshGradient.1";
import { TopMenu } from "./TopMenu";
import { Button } from "../ui/Button";
import Image from "next/image"
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { DAMUS_APP_STORE_URL, DAMUS_TESTFLIGHT_URL } from "@/lib/constants";
import { motion } from "framer-motion";
import { NostrIcon } from "../icons/NostrIcon";

export function Hero() {
    const intl = useIntl()

    return (<>
        <div className="bg-black overflow-hidden relative min-h-screen">
            <div className="absolute z-10 pointer-events-none">
                <MeshGradient1 className="-translate-x-1/3"/>
            </div>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <TopMenu className="w-full"/>
                <div className="flex flex-col lg:flex-row items-center justify-center mt-32 lg:mt-16">
                    <div className="w-full z-20 mb-12">
                        {(intl.locale != "ja" || process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (<>
                            <Link href="https://damus.io/npub18m76awca3y37hkvuneavuw6pjj4525fw90necxmadrvjg0sdy6qsngq955" target="_blank">
                                <motion.div
                                    className="inline-flex items-center text-sm md:text-normal rounded-full bg-white/10 backdrop-blur-sm p-1 px-4 md:p-2 md:px-6 text-white border border-white/30 active:scale-95 transition cursor-pointer"
                                    style={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
                                >
                                    <NostrIcon className="h-6 mr-2 text-damuspink-600" aria-hidden="true"/>
                                    <FormattedMessage defaultMessage="Follow us on Nostr" id="home.hero.follow-us-on-nostr"/>
                                    <ChevronRight className="ml-2"/>
                                </motion.div>
                            </Link>
                        </>)}
                        <motion.h1 
                            className="my-6 text-4xl sm:text-5xl md:text-7xl text-transparent bg-clip-text pb-6 font-semibold whitespace-pre-line max-w-2xl"
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
                            { intl.formatMessage({ id: "home.hero.subheadline", defaultMessage: "Your very own social network for your friends or business.\n Available Now on iOS, iPad and macOS (M1/M2)" }) }
                        </motion.h2>
                        <motion.div
                            className="mt-10 md:mt-6 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6"
                            style={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
                        >
                            <Link href={DAMUS_APP_STORE_URL} target="_blank">
                                <Button variant="default" className="w-full md:w-auto">
                                    { intl.formatMessage({ id: "home.hero.download_now", defaultMessage: "Download now" }) }
                                    <ArrowUpRight className="ml-2" />
                                </Button>
                            </Link>
                            <Link href={DAMUS_TESTFLIGHT_URL} target="_blank">
                                <Button variant="link" className="w-full md:w-auto">
                                    { intl.formatMessage({ id: "home.hero.join_testflight", defaultMessage: "Join TestFlight Beta" }) }
                                    <ArrowUpRight className="text-damuspink-600 ml-2"/>
                                </Button>
                            </Link>
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