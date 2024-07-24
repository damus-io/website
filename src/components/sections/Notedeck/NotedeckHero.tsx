import { ArrowUpRight, ChevronRight, Globe2, LucideZapOff, Sparkles, Star, Zap, ZapIcon, ZapOff } from "lucide-react";
import { MeshGradient1 } from "../../effects/MeshGradient.1";
import { TopMenu } from "../TopMenu";
import { Button } from "../../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import StarField from "@/components/effects/StarField";
import { useScroll, useTransform } from "framer-motion";
import { NOTEDECK_WAITLIST_URL } from "@/lib/constants";

export function NotedeckHero({ className }: { className?: string }) {
  const intl = useIntl()
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0.55, 0.8], [1.0, 0.0]);
  const bgOpacity = useTransform(scrollYProgress, [0.3, 0.55], [1.0, 0.0]);
  const mobileScreenshotOffsetX = useTransform(scrollYProgress, [0.2, 1], [0, -800]);

  return (<>
    <motion.div
      className={`bg-black overflow-hidden relative ${className}`}
    >
      <motion.div className="absolute z-0 w-full h-full pointer-events-none" style={{ opacity: bgOpacity }}>
        <StarField className="z-0 fixed top-0 left-0 object-cover object-center w-full h-full"/>
        <MeshGradient1 className="-translate-x-1/3" />
      </motion.div>
      <motion.div className="container z-10 mx-auto px-6 pt-6 h-full min-h-screen flex flex-col justify-center" style={{ opacity: heroOpacity }}>
        <motion.div 
          className="w-full z-10 backdrop-blur-sm bg-black/20 rounded-xl p-4 shadow-xl border border-black/30"
          style={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
        >
          <TopMenu
            className="w-full z-10"
            customCTA={
              <Link href={NOTEDECK_WAITLIST_URL}>
                <Button variant="accent" className="w-full">
                  {intl.formatMessage({ id: "notedeck.hero.menu.signup-for-the-waitlist", defaultMessage: "Sign up" })}
                </Button>
              </Link>
            }
          />
        </motion.div>
        <motion.div
          className="flex flex-col items-center justify-center h-full grow mt-32 z-10"
          style={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}
        >
          <div className="flex gap-x-4 items-center mb-2 md:mb-2">
            <Image 
              src="/notedeck/notedeck-logo.png" 
              alt="notedeck logo"
              width={500}
              height={105}
            />
          </div>
          <div className="text-purple-200/70 text-lg md:text-2xl text-center max-w-2xl mb-8 break-keep">
            {intl.formatMessage({ id: "notedeck.hero.description", defaultMessage: "Damus. Everywhere. The fastest native, customizable nostr experience, for all platforms." })}
          </div>
          <motion.div
            className="mt-6 md:mt-4 mb-8 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6 w-full md:w-auto"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
          >
            <Link href={NOTEDECK_WAITLIST_URL} className="w-full md:w-auto">
              <Button variant="default" className="w-full">
                {intl.formatMessage({ id: "notedeck.hero.signup-for-the-waitlist", defaultMessage: "Sign up for the waitlist" })}
              </Button>
            </Link>
          </motion.div>
          <div className="hidden md:flex gap-x-4 items-center mb-12 md:mb-6 z-20 relative">
            <Image 
              src="/notedeck/notedeck-hero.png" 
              alt="notedeck screenshot"
              className=""
              width={1200}
              height={105}
            />
          </div>
          <div className="flex md:hidden mb-12 md:mb-6 z-20 relative overflow-hidden w-screen">
            <motion.img 
              src="/notedeck/notedeck-hero.png" 
              alt="notedeck screenshot"
              className="max-w-fit"
              style={{
                marginLeft: mobileScreenshotOffsetX
              }}
              width={1200}
              height={105}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  </>)
}
