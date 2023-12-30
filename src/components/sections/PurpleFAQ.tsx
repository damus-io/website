import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Award, Badge, Heart, Joystick, KeyRound, Scale, Stars, Wallet } from "lucide-react";
import { MeshGradient3 } from "../effects/MeshGradient.3";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion"

const faq = [
  {
    questionIntlString: "purple.faq.1.q",
    answerIntlString: "purple.faq.1.a",
  },
  {
    questionIntlString: "purple.faq.2.q",
    answerIntlString: "purple.faq.2.a",
  }
]


export function PurpleFAQ({ className }: { className?: string }) {
  const intl = useIntl()

  // This type of structure is necessary in this case to make strings get picked up by `npm run i18n`
  const faqIntlStrings: Record<string, string> = {
    "purple.faq.1.q": intl.formatMessage({ id: "purple.faq.question.1.q", defaultMessage: "Can I pay with Lightning?" }),
    "purple.faq.1.a": intl.formatMessage({ id: "purple.faq.answer.1.a", defaultMessage: "Oh yeah! You can pay with Lightning if you register on the website. For the iOS app, you can pay with Apple Pay." }),
    "purple.faq.2.q": intl.formatMessage({ id: "purple.faq.question.2.q", defaultMessage: "But can I pay with lightning via the app?" }),
    "purple.faq.2.a": intl.formatMessage({ id: "purple.faq.answer.2.a", defaultMessage: "Unfortunately not. Apple doesn’t allow apps to accept Lightning payments. but you can register on the website and pay with Lightning there." }),
  }

  return (<>
    <div className={cn("bg-black overflow-hidden relative", className)}>
      <MeshGradient3 className="absolute top-0 left-0 pointer-events-none translate-y-3/4 overflow-visible scale-150" />
      <div className="container mx-auto px-6 pb-32 pt-20">
        <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
          <div className="relative mb-32 flex flex-col items-center">
            <motion.h2 className="text-4xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold pb-8 break-keep">
              {intl.formatMessage({ id: "purple.faq.headline", defaultMessage: "Frequent Questions" })}
            </motion.h2>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full text-white max-w-3xl mx-auto">
          {faq.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faqIntlStrings[item.questionIntlString]}</AccordionTrigger>
              <AccordionContent>
                {faqIntlStrings[item.answerIntlString]}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </>)
}
