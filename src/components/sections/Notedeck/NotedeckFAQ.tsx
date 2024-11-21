import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Award, Badge, Heart, Joystick, KeyRound, Scale, Stars, Wallet } from "lucide-react";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion"
import { Onest } from "next/font/google";
import { MarkdownView } from "@/components/ui/MarkdownView";

const onest = Onest({ subsets: ['latin'] })


export function NotedeckFAQ({ className }: { className?: string }) {
  const intl = useIntl()

  const faq = [
    {
      question: intl.formatMessage({ id: "faq.start", defaultMessage: "How do I get started (private key, public key)?" }),
      answer: intl.formatMessage({
        id: "faq.start.a",
        defaultMessage: `**From iOS Damus:** \`Go to side menu\` -> \`Tap on profile\` -> Tap on the *Copy button* adjacent to npub field\n\n**Any public key:** Go to [nostr.band](https://nostr.band) in your browser, and search for a nostr user of interest (e.g. Terry Yiu) to find their npub (public key). Tap on npub to copy it.\n\n![Npub example](/notedeck/npub_example.png)\n\n**Private key:** From iOS Damus -> go to side menu -> settings -> keys -> copy "secret account login key" and use this to log in to notedeck.`
      }),
    },
    {
      question: intl.formatMessage({ id: "faq.purple.effect", defaultMessage: "How does my purple membership affect notedeck?" }),
      answer: intl.formatMessage({ id: "faq.purple.effect.a", defaultMessage: "You get access to notedeck before anyone else!" }),
    },
    {
      question: intl.formatMessage({ id: "faq.need.purple", defaultMessage: "Do I need purple to get notedeck on day one?" }),
      answer: intl.formatMessage({ id: "faq.need.purple.a", defaultMessage: "Yes!" }),
    },
    {
      question: intl.formatMessage({ id: "faq.day.one", defaultMessage: "What works on day one?" }),
      answer: intl.formatMessage({
        id: "faq.day.one.a",
        defaultMessage: "- Login with public key (npub)\n- Login with private key (nsec)\n- Multiple accounts\n- Add profile columns\n- Add notifications columns\n- Add hashtag columns\n- Create post\n- Reply\n- Quote note\n- Log out`"
      }),
    },
    {
      question: intl.formatMessage({ id: "faq.not.work.day.one", defaultMessage: "Important stuff that doesn't work on day one" }),
      answer: intl.formatMessage({
        id: "faq.not.work.day.one.a",
        defaultMessage: `- Auto suggest tagging\n- Zaps\n- DMs\n- Reposts\n- Likes/reactions\n- Embedded video\n- Upload media\n- Modifying profile\n- Modifying relay list\n- See followers/following count\n- Search, and many more`
      }),
    },
    {
      question: intl.formatMessage({ id: "faq.trouble.feedback", defaultMessage: "Having trouble, or have feedback?" }),
      answer: intl.formatMessage({
        id: "faq.trouble.feedback.a",
        defaultMessage: "Tag damus on nostr, or send an email to [support@damus.io](mailto:support@damus.io)."
      }),
    },
    {
      question: intl.formatMessage({ id: "faq.buy.purple", defaultMessage: "How can I buy purple if I am not a purple member?" }),
      answer: intl.formatMessage({ id: "faq.buy.purple.a", defaultMessage: "[https://damus.io/purple](https://damus.io/purple)" }),
    },
    {
      question: intl.formatMessage({ id: "faq.supported.os", defaultMessage: "Supported operating systems" }),
      answer: intl.formatMessage({ id: "faq.supported.os.a", defaultMessage: `**On day one:**\n\n- Linux\n- Ubuntu\n- Fedora\n- MacOS\n- Windows\n\n**In the future:**\n- Android\n- iOS\n- iPadOS` }),
    },
    {
      question: intl.formatMessage({ id: "faq.support.signer.extension", defaultMessage: "Does notedeck support signer extension?" }),
      answer: intl.formatMessage({ id: "faq.support.signer.extension.a", defaultMessage: "No. Notedeck is a desktop app where key storage is local so a signer extension isn't required. Trust in third party apps is eliminated by using the desktop app Notedeck." }),
    },
  ]

  return (<>
    <div className={cn("bg-black overflow-hidden relative", className)}>
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
              {intl.formatMessage({ id: "purple.faq.headline", defaultMessage: "Frequent Questions" })}
            </motion.h2>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full text-white max-w-2xl mx-auto">
          {faq.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="whitespace-pre-line">
                <MarkdownView>
                {item.answer}
                </MarkdownView>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </>)
}
