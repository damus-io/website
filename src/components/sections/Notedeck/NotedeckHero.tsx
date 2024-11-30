import { TopMenu } from "../TopMenu";
import { Onest } from 'next/font/google'
import { Button } from "../../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { NOTEDECK_WAITLIST_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const onest = Onest({ subsets: ['latin'] })

export function NotedeckHero({ className, introducing }: { className?: string, introducing?: boolean }) {
  const intl = useIntl()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  const mobileScreenshotOffsetX = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const bgOpacity = useTransform(scrollYProgress, [0.3, 1], [1.0, 0.0]);

  return (<>
    <div
      ref={ref}
      className={cn("bg-black overflow-hidden flex-col relative min-h-screen", className)}
    >
      <motion.div className="container mt-28 z-10 mx-auto px-6 pt-6 flex flex-col justify-center">
        <motion.div
          className="flex flex-col items-start justify-start h-full grow mt-8 z-10"
          style={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}
        >
          {introducing && (
            <motion.h1
                className={cn("text-2xl uppercase text-white/80 mb-12", onest.className)}
            >
                Introducing
            </motion.h1>
          )}
          <div className="flex gap-x-4 items-center mb-2 md:mb-6">
            <Image
              src="/logo_icon.png"
              alt="damus logo"
              width={80}
              height={80}
              className="rounded-lg md:rounded-xl lg:rounded-2xl w-12 md:w-16 lg:w-20 aspect-square"
            />
            <motion.h1
                className={cn("text-4xl sm:text-4xl md:text-7xl text-transparent bg-clip-text font-semibold whitespace-pre-line max-w-4xl tracking-wide leading-loose", onest.className)}
                style={{
                    backgroundImage: "linear-gradient(to right, #ffffff -100%, #ffffff -80%, #2D175B 100%)",
                    opacity: 0,
                }}
                animate={{
                    backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 100%, #2D175B 180%)",
                    transition: { duration: 3 },
                    opacity: 1
                }}
            >
                Notedeck
            </motion.h1>
          </div>
          <motion.h2
              className={cn("mt-2 text-2xl sm:text-3xl md:text-5xl text-transparent bg-clip-text pb-6 font-semibold whitespace-pre-line max-w-4xl tracking-wide leading-8 md:leading-snug lg:leading-normal", onest.className)}
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
              <FormattedMessage defaultMessage="Damus. Everywhere. The fastest native, customizable nostr experience, for all platforms." id="notedeck.hero.headline"/>
          </motion.h2>
          <motion.div
            className="inline-flex gap-2 items-center text-xs md:text-md rounded-full bg-purple-100/10 backdrop-blur-sm shadow-lg p-1 px-3 text-purple-100/80 border border-purple-100/30 active:scale-95 transition mt-2 mb-8 md:mb-10"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
          >
            <Sparkles className="h-4 mr-1 text-purple-50" aria-hidden="true" />
            {intl.formatMessage({ id: "notedeck.hero.announcement", defaultMessage: "Notedeck Alpha now available on Purple" })}
          </motion.div>
          <motion.div
            className="mt-6 md:mt-4 mb-8 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6 w-full md:w-auto"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
          >
            <InstallNowButton/>
            <a href={"/notedeck#introducing"}>
                <Button variant="link" className="w-full md:w-auto">
                    { intl.formatMessage({ id: "notedeck.hero.learn-more", defaultMessage: "Learn more" }) }

                </Button>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div className="flex justify-end w-full relative">
        {/* Gradient fade to black on the bottom */}
        <div className="w-full h-96 bottom-0 absolute bg-gradient-to-b from-transparent to-black z-10" />
        <motion.div
          className="z-0 w-auto pointer-events-none mt-[-553px] overflow-x-hidden overflow-y-visible flex"
        >
          <motion.img
            src="/notedeck/notedeck-hero-2.png"
            className="block md:hidden"
            style={{
              width: "1728px",
              height: "1106px",
              maxWidth: "1728px",
              marginLeft: mobileScreenshotOffsetX,
              opacity: bgOpacity
            }}
            alt="Notedeck screenshot"
            sizes="1728px"
            width={1728}
            height={1106}
          />
          <motion.img
            src="/notedeck/notedeck-hero-2.png"
            className="hidden md:block"
            style={{
              width: "1728px",
              height: "1106px",
              maxWidth: "1728px",
            }}
            alt="Notedeck screenshot"
            sizes="1728px"
            width={1728}
            height={1106}
          />
        </motion.div>
      </motion.div>
    </div>
  </>)
}

export function InstallNowButton({ className }: { className?: string }) {
  const intl = useIntl()

  return (
    <Link href={"/notedeck/install"} className={cn("w-full md:w-auto", className)}>
      <Button variant="accent" className="w-full flex gap-x-2 text-lg font-semibold">
        <Sparkles className="w-4 h-4"/>
        {intl.formatMessage({ id: "notedeck.hero.install", defaultMessage: "Install now" })}
      </Button>
    </Link>
  )
}
