import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { useIntl } from "react-intl";
import { CheckCircle, Frown, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useState } from "react";
import { MeshGradient5 } from "@/components/effects/MeshGradient.5";
import { MeshGradient4 } from "@/components/effects/MeshGradient.4";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function NotedeckWaitlistForm({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div className={cn("bg-black overflow-hidden relative", className)}>
            <div className="container mx-auto px-6 pb-24 pt-48">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-24 flex flex-col items-center justify-center">
                        <div className="absolute pointer-events-none">
                            <MeshGradient4 />
                        </div>
                        <motion.h2 className="mb-1 md:mb-4 text-4xl md:text-5xl lg:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-5% to-[#E0A4D3] to-100% font-semibold pb-4 whitespace-pre-line leading-relaxed">
                            {intl.formatMessage({ id: "notedeck.waitlist.headline", defaultMessage: "Coming soon!" })}
                        </motion.h2>
                        <motion.label htmlFor="contact" className="text-xl text-center max-w-2xl mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white from-5% to-[#8DEBF8] to-100% whitespace-pre-line leading-loose">
                            {(intl.locale != "ja" || process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (<>
                                {intl.formatMessage({ id: "notedeck.waitlist.subheadline", defaultMessage: "Sign up for our waitlist and be the first to know when notedeck is ready" })}
                            </>)}
                        </motion.label>
                        <motion.div
                            className="flex flex-col items-center md:items-center gap-y-4 gap-x-6"
                            style={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
                        >
                            <Link href="#tally-open=npVXbJ&tally-layout=modal&tally-align-left=1&tally-hide-title=1&tally-emoji-text=🚀&tally-emoji-animation=none&tally-auto-close=68000" className="w-full md:w-auto">
                                <Button variant="default" className="w-full">
                                    {intl.formatMessage({ id: "notedeck.hero.signup-for-the-waitlist", defaultMessage: "Sign up for the waitlist" })}
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}