import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import { Onest } from 'next/font/google'
import { MarkdownView } from "@/components/ui/MarkdownView";

const onest = Onest({ subsets: ['latin'] })

export function DamusAndroidFAQ({ className }: { className?: string }) {
    const intl = useIntl()

    const faqs = [
        {
            question: intl.formatMessage({ id: "damus-android.faq.q1", defaultMessage: "What is Damus Android?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a1", defaultMessage: "Damus Android is a native Android client for the Nostr protocol. It brings the simplicity and performance Damus iOS users enjoy to the Android platform." }),
        },
        {
            question: intl.formatMessage({ id: "damus-android.faq.q2", defaultMessage: "When will Damus Android be available?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a2", defaultMessage: "Damus Android is available now! Scroll down to see download instructions." }),
        },
        {
            question: intl.formatMessage({ id: "damus-android.faq.q3", defaultMessage: "How much does Damus Android cost?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a3", defaultMessage: "Damus Android is free to download and use. We are planning to create more optional premium features in the future." }),
        },
        {
            question: intl.formatMessage({ id: "damus-android.faq.q4", defaultMessage: "What does 'zapping' mean?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a4", defaultMessage: "Zapping is a way to send Bitcoin directly to content creators through the Lightning Network. It's like tipping, but faster and with lower fees." }),
        },
        {
            question: intl.formatMessage({ id: "damus-android.faq.q5", defaultMessage: "Is Damus Android secure?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a5", defaultMessage: "Yes, Damus Android is built with security in mind. Your private keys stay on your device, keeping you in control of your Nostr identity." }),
        },
        {
            question: intl.formatMessage({ id: "damus-android.faq.q6", defaultMessage: "What is Dave, the AI assistant?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a6", defaultMessage: "Dave is an AI assistant integrated into Damus Android that helps you create content, discover new accounts to follow, and navigate the Nostr ecosystem." }),
        },
        {
            question: intl.formatMessage({ id: "damus-android.faq.q7", defaultMessage: "How is Damus Android different from other social media apps?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a7", defaultMessage: "Damus Android is built on the decentralized Nostr protocol, meaning no single entity controls your data, censor your speech, or algorithmically manipulate the content you see. It also integrates directly with Bitcoin Lightning for payments and tipping." }),
        },
        {
            question: intl.formatMessage({ id: "damus-android.faq.q8", defaultMessage: "Do I need a Nostr account to use Damus Android?" }),
            answer: intl.formatMessage({ id: "damus-android.faq.a8", defaultMessage: "Yes, you'll need a Nostr identity (a public/private key pair). Damus Android can help you create one when you first open the app, or you can import an existing one." }),
        },
    ]

    return (<>
        <div id="faq" className={cn("bg-black overflow-hidden relative", className)}>
            <MeshGradient3 className="absolute top-0 left-0 pointer-events-none translate-y-3/4 overflow-visible scale-150" />
            <div className="container mx-auto px-6 pb-32 pt-20">
                <div className="flex flex-col items-center justify-center mt-16">
                    <div className="relative mb-12 flex flex-col items-center">
                        <motion.h2
                            className={cn("mt-6 text-3xl sm:text-4xl md:text-5xl text-center text-transparent bg-clip-text pb-6 font-semibold whitespace-pre-line max-w-4xl tracking-wide leading-relaxed", onest.className)}
                            style={{
                                backgroundImage: "linear-gradient(to right, #ffffff -100%, #ffffff -40%, #2D175B 100%)",
                                opacity: 0,
                            }}
                            animate={{
                                backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 40%, #2D175B 100%)",
                                transition: { duration: 3 },
                                opacity: 1
                            }}
                        >
                            {intl.formatMessage({ id: "damus-android.faq.headline", defaultMessage: "Frequently Asked Questions" })}
                        </motion.h2>
                    </div>
                </div>
                <Accordion type="single" collapsible className="w-full text-white max-w-2xl mx-auto">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                              <span className="text-left">
                                {faq.question}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="whitespace-pre-line">
                                <MarkdownView>
                                    {faq.answer}
                                </MarkdownView>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    </>)
}
