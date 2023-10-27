import { Button } from "../ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Ticker, TickerImage } from "../ui/Ticker";
import { ArrowUpRight, ShoppingCartIcon } from "lucide-react";
import { DAMUS_MERCH_STORE_URL } from "@/lib/constants";

export function DamusAroundTheWorld({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div className={cn("bg-black overflow-hidden relative min-h-screen", className)}>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-24 flex flex-col items-center justify-center">
                        <motion.h2 className="mb-8 text-6xl md:text-7xl lg:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-[#CF63F4] from-5% via-[#54F3F3] via-50% to-[#90FF7E] to-100% font-semibold">
                            { intl.formatMessage({ id: "damus_around_the_world.headline", defaultMessage: "Damus around the world" }) }
                        </motion.h2>
                        <motion.div className="text-white/80 text-xl text-center max-w-2xl mb-6">
                            { intl.formatMessage({ id: "damus_around_the_world.subheadline", defaultMessage: "Damus store is available, be the cool one within your group of friends, share to the world your love for Damus. You might even appear here." }) }
                        </motion.div>
                        <Link href={DAMUS_MERCH_STORE_URL} target="_blank">
                            <Button variant="default" className="w-full md:w-auto">
                                <ShoppingCartIcon className="mr-2" />
                                { intl.formatMessage({ id: "damus_around_the_world.visit_damus_store_now", defaultMessage: "Visit Damus store now" }) }
                                <ArrowUpRight className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-y-4 md:gap-y-4 items-stretch justify-center">
                        <Ticker className="w-screen" timePeriod={20}>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/1.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_1_alt_text", defaultMessage: "An artistic illustration of a tropical beach with a sailing boat in the shape of the Damus logo" }) }/>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/2.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_2_alt_text", defaultMessage: "Members of the Damus team and friends at a conference booth" }) }/>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/3.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_3_alt_text", defaultMessage: "Members of the Damus team on a video call at the conference booth" }) }/>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/4.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_4_alt_text", defaultMessage: "A picture of the Damus cap" }) }/>
                        </Ticker>
                        <Ticker className="w-screen" timePeriod={20} reverseDirection={true}>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/5.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_5_alt_text", defaultMessage: "Derek Ross making a presentation at a conference" }) }/>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/6.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_6_alt_text", defaultMessage: "A man standing next to a 'Welcome to colorful Colorado' sign" }) }/>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/7.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_7_alt_text", defaultMessage: "A man wearing Damus merch" }) }/>
                            <TickerImage className="w-72 h-48 md:w-96 md:h-72" src="/around-the-world-photos/4.webp" altText={ intl.formatMessage({ id: "damus_around_the_world.photo_4_alt_text", defaultMessage: "A picture of the Damus cap" }) }/>
                        </Ticker>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
