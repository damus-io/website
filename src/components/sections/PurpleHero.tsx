import { ArrowUpRight, ChevronRight, Globe2, LucideZapOff, Sparkles, Star, Zap, ZapIcon, ZapOff } from "lucide-react";
import { MeshGradient1 } from "../effects/MeshGradient.1";
import { TopMenu } from "./TopMenu";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { PurpleIcon } from "../icons/PurpleIcon";
import { AccountInfo } from "@/utils/PurpleUtils";
import { usePurpleLoginSession } from "@/hooks/usePurpleLoginSession";

export function PurpleHero() {
  const intl = useIntl()
  const { accountInfo: loggedInAccountInfo, logout } = usePurpleLoginSession((error) => {
    // Silently ignore errors, knowing whether the user is logged in is not essential in this context.
    console.error("Error fetching account info", error)
  })

  return (<>
    <div
      className="bg-black overflow-hidden relative"
    >
      <div className="absolute z-0 w-full h-full pointer-events-none">
        <Image src="/stars-bg.webp" fill className="absolute top-0 left-0 object-cover lg:object-contain object-center w-full h-full" alt="" aria-hidden="true" />
        <MeshGradient1 className="-translate-x-1/3" />
      </div>
      <div className="container z-10 mx-auto px-6 pt-12 h-full min-h-screen flex flex-col justify-center">
        <TopMenu
          className="w-full"
          customCTA={<>
            {loggedInAccountInfo ?
              <Link href="/purple/account">
                <Button variant="accent">
                  {intl.formatMessage({ id: "purple.hero.menu.go-to-my-account", defaultMessage: "My Account" })}
                </Button>
              </Link>
              :
              <Link href="/purple/login">
                <Button variant="accent">
                  {intl.formatMessage({ id: "purple.hero.menu.login", defaultMessage: "Login" })}
                </Button>
              </Link>
            }
          </>}
        />
        <div className="flex flex-col items-center justify-center h-full grow">
          <Link href="/purple/checkout">
            <motion.div
              className="inline-flex items-center text-xs rounded-full bg-purple-100/10 backdrop-blur-sm shadow-lg p-1 px-3 text-purple-100/80 border border-purple-100/30 active:scale-95 transition cursor-pointer mb-16"
              style={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
            >
              <Sparkles className="h-4 mr-1 text-purple-50" aria-hidden="true" />
              {intl.formatMessage({ id: "purple.hero.renew", defaultMessage: "Already a member? Click here to renew!" })}
              <ChevronRight className="ml-2" />
            </motion.div>
          </Link>
          <div className="flex gap-x-4 items-center mb-12 md:mb-6">
            <PurpleIcon className="w-16 h-16 md:w-24 md:h-24" />
            <motion.h2 className="text-6xl md:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold break-keep tracking-tight">
              Purple
            </motion.h2>
          </div>
          <div className="text-purple-200/70 text-md md:text-lg text-center max-w-2xl mb-2 break-keep">
            {intl.formatMessage({ id: "purple.hero.description", defaultMessage: "For free-speech maximalists" })}
          </div>
          <motion.div
            className="mt-10 md:mt-6 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6 w-full md:w-auto"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
          >
            {loggedInAccountInfo ?
              <>
                <Link href="/purple/account" className="w-full md:w-auto">
                  <Button variant="default" className="w-full">
                    {intl.formatMessage({ id: "purple.hero.go-to-my-account", defaultMessage: "Go to my account" })}
                  </Button>
                </Link>
                <Link href="#benefits" className="w-full md:w-auto">
                  <Button variant="link" className="w-full">
                    {intl.formatMessage({ id: "purple.hero.learn-more", defaultMessage: "Learn more" })}
                  </Button>
                </Link>
              </>
              :
              <>
                <Link href="/purple/checkout" className="w-full md:w-auto">
                  <Button variant="default" className="w-full">
                    {intl.formatMessage({ id: "purple.hero.become-a-member", defaultMessage: "Become a member" })}
                  </Button>
                </Link>
                <Link href="/purple/account" className="w-full md:w-auto">
                  <Button variant="link" className="w-full">
                    {intl.formatMessage({ id: "purple.hero.login", defaultMessage: "Login to my account" })}
                  </Button>
                </Link>
              </>
            }
          </motion.div>
        </div>
      </div>
    </div>
  </>)
}
