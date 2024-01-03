import { ArrowUpRight, ChevronRight, Globe2 } from "lucide-react";
import { MeshGradient1 } from "../effects/MeshGradient.1";
import { TopMenu } from "./TopMenu";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { DAMUS_APP_STORE_URL, DAMUS_TESTFLIGHT_URL } from "@/lib/constants";
import { motion } from "framer-motion";
import Image from "next/image";
import { RoundedContainerWithColorGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import { PurpleIcon } from "../icons/PurpleIcon";

export function PurpleHero() {
  const intl = useIntl()

  return (<>
    <div
      className="bg-black overflow-hidden relative min-h-screen"
    >
      <div className="absolute z-0 w-full h-full pointer-events-none">
        <Image src="/stars-bg.webp" fill className="absolute top-0 left-0 object-contain object-center w-full h-full" alt="" aria-hidden="true" />
        <MeshGradient1 className="-translate-x-1/3" />
      </div>
      <div className="container z-10 mx-auto px-6 pb-32 pt-12">
        <TopMenu className="w-full" />
        <div className="relative mb-32 flex flex-col items-center justify-center min-h-screen">
          <div className="flex gap-x-4 items-center mb-6">
            <PurpleIcon />
            <motion.h2 className="text-4xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold break-keep tracking-tight">
              Purple
            </motion.h2>
          </div>
          <motion.div
            className="mt-10 md:mt-6 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
          >
            <Link href={DAMUS_APP_STORE_URL} target="_blank">
              <Button variant="default" className="w-full md:w-auto">
                {intl.formatMessage({ id: "purple.hero.subscribe", defaultMessage: "Subscribe" })}
                <ArrowUpRight className="ml-2" />
              </Button>
            </Link>
            <Link href={DAMUS_TESTFLIGHT_URL} target="_blank">
              <Button variant="link" className="w-full md:w-auto">
                {intl.formatMessage({ id: "purple.hero.learn-more", defaultMessage: "Learn more" })}
                <ArrowUpRight className="text-damuspink-600 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  </>)
}
