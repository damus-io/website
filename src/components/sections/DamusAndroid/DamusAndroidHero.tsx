import { TopMenu } from "../TopMenu";
import { Onest } from 'next/font/google'
import { Button } from "../../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronRight, Sparkles, Zap } from "lucide-react";
import { useRef } from "react";
import { MeshGradient1 } from "@/components/effects/MeshGradient.1";

const onest = Onest({ subsets: ['latin'] })

export function DamusAndroidHero({ className, introducing }: { className?: string, introducing?: boolean }) {
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
      className={cn("bg-black overflow-hidden relative min-h-screen", className)}
    >
      {/* Mesh gradient background */}
      <div className="absolute z-10 pointer-events-none">
          <MeshGradient1 className="-translate-x-1/3"/>
      </div>
      <motion.div className="container mx-auto px-6 pb-20 pt-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center mt-28 lg:mt-48">
          <motion.div
            className="w-full z-20 mb-12 lg:pr-8"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}
          >
          {introducing && (
            <motion.h1
                className={cn("text-lg md:text-2xl uppercase text-white/80 mb-8", onest.className)}
            >
                Introducing
            </motion.h1>
          )}
          <div className="flex gap-x-4 items-center mb-4 md:mb-16">
            <Image
              src="/logo_icon.png"
              alt="damus logo"
              width={80}
              height={80}
              className="rounded-lg md:rounded-xl lg:rounded-2xl w-12 md:w-16 lg:w-20 aspect-square"
            />
            <motion.h1
                className={cn("text-3xl sm:text-4xl lg:text-6xl text-transparent bg-clip-text font-semibold whitespace-pre-line max-w-4xl tracking-wide md:leading-loose", onest.className)}
                style={{
                    backgroundImage: "linear-gradient(to right, #ffffff -100%, #ffffff -80%, #6D4D9B 100%)",
                    opacity: 0,
                }}
                animate={{
                    backgroundImage: "linear-gradient(to right, #ffffff 0%, #d9c5ff 50%, #9747FF 100%)",
                    transition: { duration: 3 },
                    opacity: 1
                }}
            >
                Damus Android
            </motion.h1>
          </div>
          <motion.h2
              className="text-white/80 text-normal md:text-xl whitespace-pre-line"
              style={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
          >
              <FormattedMessage defaultMessage="Make the internet social again - bring your friends, zap and get zapped, own your identity." id="damus-android.hero.headline"/>
          </motion.h2>
          <motion.div
            className="inline-flex gap-2 items-center text-xs md:text-md rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-xl shadow-lg p-1.5 px-4 text-purple-100 border border-purple-300/30 active:scale-95 transition mt-4 mb-10 md:mb-12"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 mr-1 text-purple-50" aria-hidden="true" />
            {intl.formatMessage({ id: "damus-android.hero.announcement", defaultMessage: "Now available - free on Android" })}
          </motion.div>
          <motion.div
            className="mt-6 md:mt-6 mb-10 flex flex-col md:flex-row items-center md:items-start gap-y-4 gap-x-6 w-full md:w-auto"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
          >
            <DownloadNowButton/>
            <a href={"/android#introducing"}>
                <Button variant="link" className="w-full md:w-auto">
                    { intl.formatMessage({ id: "damus-android.hero.learn-more", defaultMessage: "Learn more" }) }
                </Button>
            </a>
          </motion.div>
          </motion.div>
          <motion.div
            className="relative w-full mt-6 lg:mt-0 px-12 flex justify-center pb-6"
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
          >
            {/* Gradient fade to black on the bottom */}
            <div className="block lg:hidden w-full h-48 bottom-0 absolute bg-gradient-to-b from-transparent to-black z-10" />
            
            <div className="">
              <motion.div
                style={{
                  opacity: bgOpacity,
                }}
              >
                <Image
                  src="/damus-android/mockup.png"
                  className="object-contain"
                  alt="Damus Android mockup"
                  width={350}
                  height={700}
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(147, 51, 234, 0.4))",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </>)
}

export function DownloadNowButton({ className }: { className?: string }) {
  const intl = useIntl()

  return (
    <Link href="/damus-android/install" className={cn("w-full md:w-auto", className)}>
      <Button variant="accent" className="w-full flex gap-x-2 text-lg font-semibold">
        <Zap className="w-4 h-4"/>
        {intl.formatMessage({ id: "damus-android.hero.download", defaultMessage: "Download now" })}
      </Button>
    </Link>
  )
}
