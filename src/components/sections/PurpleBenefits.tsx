import { MeshGradient2 } from "../effects/MeshGradient.2";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Award, Badge, Heart, Joystick, KeyRound, Scale, Stars, Wallet } from "lucide-react";
import { MeshGradient4 } from "../effects/MeshGradient.4";
import { MeshGradient3 } from "../effects/MeshGradient.3";

export function PurpleBenefits({ className }: { className?: string }) {
  const intl = useIntl()

  const benefits = [
    {
      icon: <Heart className="h-12 w-12 text-white opacity-80" />,
      headline: intl.formatMessage({ id: "purple.benefits.benefit1.name", defaultMessage: "Help Build The Future" }),
      description: intl.formatMessage({ id: "purple.benefits.benefit1.description", defaultMessage: "Support Damus development to help build the future of decentralized communication on the web." }),
    },
    {
      icon: <Stars className="text-white h-12 w-12 opacity-80" />,
      headline: intl.formatMessage({ id: "purple.benefits.benefit2.name", defaultMessage: "Exclusive features" }),
      description: intl.formatMessage({ id: "purple.benefits.benefit2.description", defaultMessage: "Be the first to access upcoming premium features: Automatic translations, longer note storage, and more" }),
    },
    {
      icon: <Award className="h-12 w-12 text-white opacity-80" />,
      headline: intl.formatMessage({ id: "purple.benefits.benefit3.name", defaultMessage: "Supporter Badge" }),
      description: intl.formatMessage({ id: "purple.benefits.benefit3.description", defaultMessage: "Get a special badge on your profile to show everyone your contribution to Freedom tech" }),
    },
  ]

  return (<>
    <div className={cn("bg-black overflow-hidden relative min-h-screen", className)}>
      <MeshGradient3 className="absolute top-0 left-0 pointer-events-none translate-y-3/4 overflow-visible scale-150" />
      <div className="container mx-auto px-6 pt-20">
        <div className="flex flex-col items-center justify-center lg:mt-16">
          <div className="relative mb-16 md:mb-32 flex flex-col items-center">
            <motion.h2 className="text-5xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold pb-8 break-keep">
              {intl.formatMessage({ id: "purple.benefits.headline", defaultMessage: "Get more from Damus." })}
            </motion.h2>
            <motion.div className="text-white/60 text-xl text-center max-w-2xl mb-6 mt-6 break-keep">
              {intl.formatMessage({ id: "purple.benefits.description", defaultMessage: "Help us stay independent in our mission for Freedom tech with our Purple subscription, and look cool doing it!" })}
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
