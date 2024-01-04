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

export function PurpleFAQ({ className }: { className?: string }) {
  const intl = useIntl()

  const faq = [
    {
      question: intl.formatMessage({ id: "purple.faq.3.q", defaultMessage: "What is Damus Purple?" }),
      answer: intl.formatMessage({ id: "purple.faq.3.a", defaultMessage: "Damus Purple is a paid subscription to Damus that gives you access to exclusive features, and helps us fund the project" }),
    },
    {
      question: intl.formatMessage({ id: "purple.faq.4.q", defaultMessage: "What are the exclusive features?" }),
      answer: intl.formatMessage({ id: "purple.faq.4.a", defaultMessage: "Currently we offer automatic translations of posts. We are working to add more features as soon as possible." }),
    },
    {
      question: intl.formatMessage({ id: "purple.faq.5.q", defaultMessage: "How much does it cost?" }),
      answer: intl.formatMessage({ id: "purple.faq.5.a", defaultMessage: "Please see the section below for pricing." }),
    },
    {
      question: intl.formatMessage({ id: "purple.faq.1.q", defaultMessage: "Can I pay with Lightning?" }),
      answer: intl.formatMessage({ id: "purple.faq.1.a", defaultMessage: "Yes! You can pay with Lightning if you register on the website. For the iOS app, you can pay with Apple Pay." }),
    },
    {
      question: intl.formatMessage({ id: "purple.faq.6.q", defaultMessage: "Can I pay with fiat?" }),
      answer: intl.formatMessage({ id: "purple.faq.6.a", defaultMessage: "Yes! You can pay with fiat if you register on the iOS app, via Apple Pay." }),
    },
    {
      question: intl.formatMessage({ id: "purple.faq.7.q", defaultMessage: "Can I pay with crypto?" }),
      answer: intl.formatMessage({ id: "purple.faq.7.a", defaultMessage: "Sorry, we do not accept any cryptographic currencies other than Bitcoin via Lightning network." }),
    },
    {
      question: intl.formatMessage({ id: "purple.faq.2.q", defaultMessage: "Can I pay with lightning via the app?" }),
      answer: intl.formatMessage({ id: "purple.faq.2.a", defaultMessage: "Unfortunately not. Apple doesn’t allow apps to accept Lightning payments. but you can register on the website and pay with Lightning there." }),
    },
    {
      question: intl.formatMessage({ id: "purple.faq.8.q", defaultMessage: "Can I simply donate to Damus?" }),
      answer: intl.formatMessage({ id: "purple.faq.8.a", defaultMessage: "Yes! You can donate to Damus via the Lightning network. Please click on \'Zap us\' on the top menu." }),
    }
  ]

  return (<>
    <div className={cn("bg-black overflow-hidden relative", className)}>
      <MeshGradient3 className="absolute top-0 left-0 pointer-events-none translate-y-3/4 overflow-visible scale-150" />
      <div className="container mx-auto px-6 pb-32 pt-20">
        <div className="flex flex-col items-center justify-center mt-16">
          <div className="relative mb-12 flex flex-col items-center">
            <motion.h2 className="text-5xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold pb-8 break-keep">
              {intl.formatMessage({ id: "purple.faq.headline", defaultMessage: "Frequent Questions" })}
            </motion.h2>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full text-white max-w-2xl mx-auto">
          {faq.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </>)
}
