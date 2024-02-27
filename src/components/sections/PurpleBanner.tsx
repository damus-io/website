import { ArrowUpRight, ChevronRight, Globe2, LucideZapOff, Zap, ZapIcon, ZapOff } from "lucide-react";
import { MeshGradient1 } from "../effects/MeshGradient.1";
import { TopMenu } from "./TopMenu";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { DAMUS_APP_STORE_URL, DAMUS_TESTFLIGHT_URL } from "@/lib/constants";
import { motion } from "framer-motion";
import Image from "next/image";
import { PurpleIcon } from "../icons/PurpleIcon";

export function PurpleBanner() {
  const intl = useIntl()

  return (<>
    <div
      className="bg-black overflow-hidden relative"
    >
      <div className="absolute z-0 w-full h-full pointer-events-none">
        <Image src="/stars-bg.webp" fill className="absolute top-0 left-0 object-cover lg:object-contain object-center w-full h-full" alt="" aria-hidden="true" />
      </div>
      <div className="container z-10 mx-auto px-6 pt-12 h-full min-h-screen flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center h-full grow">
        <div className="inline-flex items-center mb-24 text-sm md:text-sm rounded-full bg-gradient-to-r from-damuspink-500/10 to-damuspink-600/10 backdrop-blur-sm shadow-lg shadow-damuspink-500/10  p-1 px-4 md:p-1 md:px-4 text-pink-100 border border-damuspink-500/30 active:scale-95 transition cursor-pointer">
            {/* TODO: Localize */}
            Want more?
          </div>
          <div className="text-damuspink-500/90 text-lg md:text-xl text-center max-w-2xl mb-4 md:mb-8 break-keep capitalize tracking-widest font-semibold">
            {/* TODO: Localize */}
            INTRODUCING
          </div>
          <div className="flex gap-x-4 items-center mb-12 md:mb-6">
            <PurpleIcon className="w-16 h-16 md:w-24 md:h-24" />
            <motion.h2 className="text-6xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold break-keep tracking-tight">
              Purple
            </motion.h2>
          </div>
          <div className="text-purple-200/70 text-md md:text-lg text-center max-w-2xl mb-2 break-keep">
            {/* TODO: Localize */}
            Help us stay independent in our mission for Freedom tech with our Purple membership, get exclusive benefits, and look cool doing it!
          </div>
          <motion.div
            className="mt-10 md:mt-6 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6 w-full md:w-auto"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
          >
            <Link href="/purple/checkout" className="w-full md:w-auto">
              <Button variant="default" className="w-full">
                {intl.formatMessage({ id: "purple.hero.become-a-member", defaultMessage: "Become a member" })}
              </Button>
            </Link>
            <Link href="/purple" className="w-full md:w-auto">
              <Button variant="link" className="w-full">
                {intl.formatMessage({ id: "purple.hero.learn-more", defaultMessage: "Learn more" })}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  </>)
}
