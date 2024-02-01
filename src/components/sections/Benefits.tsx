import { MeshGradient2 } from "../effects/MeshGradient.2";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Joystick, KeyRound, Scale, Wallet } from "lucide-react";
import { MeshGradient4 } from "../effects/MeshGradient.4";
import { MeshGradient3 } from "../effects/MeshGradient.3";

export function Benefits({ className }: { className?: string }) {
    const intl = useIntl()

    const benefits = [
        {
            icon: <Joystick className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "benefits.benefit1.name", defaultMessage: "You are in control" }),
            description: intl.formatMessage({ id: "benefits.benefit1.description", defaultMessage: "Built on open internet protocols, there is no platform that can ban or censor you. You are in control of your data & speech." }),
        },
        {
            icon: <KeyRound className="text-white h-12 w-12 opacity-80"/>,
            headline: intl.formatMessage({ id: "benefits.benefit2.name", defaultMessage: "No registration required" }),
            description: intl.formatMessage({ id: "benefits.benefit2.description", defaultMessage: "Creating an account doesn't require a phone number, email or name. Get started right away, and truly own your account — Thanks to advanced cryptography" }),
        },
        {
            icon: <Scale className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "benefits.benefit3.name", defaultMessage: "No addictive algorithms" }),
            description: intl.formatMessage({ id: "benefits.benefit3.description", defaultMessage: "Traditional social media keeps you addicted in order to sell you ads, which is intoxicating society. Damus doesn't. The result? A healthier community." }),
        },
        {
            icon: <Wallet className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "benefits.benefit4.name", defaultMessage: "Free speech meets Free money" }),
            description: intl.formatMessage({ id: "benefits.benefit4.description", defaultMessage: "Tip your friends, earn tips, support creators, and stack sats with Bitcoin & Lightning, the Free and open internet money." }),
        }
    ]

    return (<>
        <div className={cn("bg-black overflow-hidden relative", className)}>
            <MeshGradient3 className="absolute top-0 left-0 pointer-events-none translate-y-3/4 overflow-visible scale-150"/>
            <div className="container mx-auto px-6 pb-32 pt-20">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-32 flex flex-col items-center">
                        <motion.h2 className="text-4xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold pb-8 break-keep">
                            { intl.formatMessage({ id: "benefits.headline", defaultMessage: "You deserve to be Free." }) }
                        </motion.h2>
                        <motion.h3 className="text-3xl md:text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold pb-8 break-keep">
                            { intl.formatMessage({ id: "benefits.subheadline", defaultMessage: "With Damus, you are in control." }) }
                        </motion.h3>
                        <motion.div className="text-white/60 text-xl text-center max-w-2xl mb-6 mt-6 break-keep">
                            { intl.formatMessage({ id: "benefits.description", defaultMessage: "Damus is built on Nostr, a decentralized and open social network protocol. Without ads, toxic algorithms, or censorship, Damus gives you access to the social network that a truly free and healthy society needs — and deserves." }) }
                        </motion.div>
                    </div>
                    {(intl.locale != "ja" || process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (
                        <div className="flex flex-wrap gap-x-8 gap-y-16 items-stretch justify-center">
                            {benefits.map((item, index) => (
                                <div key={index} className="max-w-xs flex flex-col items-center justify-between">
                                    <RoundedContainerWithGradientBorder className="">
                                        {item.icon}
                                    </RoundedContainerWithGradientBorder>
                                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white from-30% to-cyan-200 to-100% text-center text-normal mt-6">
                                        {item.headline}
                                    </h3>
                                    <p className="text-white/80 text-center text-normal mt-4">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>)
}