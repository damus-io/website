import { MotionValue, circOut, easeInOut, easeOut, motion, useMotionValue, useScroll, useTime, useTransform } from "framer-motion";
import { PurpleIcon } from "../../icons/PurpleIcon";
import { ArrowDown, ZapIcon } from "lucide-react";
import { NostrNoteView, ParsedNote } from "@/components/note/NostrNoteView";
import { Npub2024InReviewStats } from "@/pages/purple/2024-in-review/[npub]";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { Orbitron } from "next/font/google";
import NumberFlow from '@number-flow/react'
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

const orbitron = Orbitron({ subsets: ['latin'] })

export function MostZappedNote({ stats, className, style }: { stats: Npub2024InReviewStats, className?: string, style?: React.CSSProperties }) {
  const time = useTime()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref
  })
  const [animatedZapAmount, setAnimatedZapAmount] = useState(10000);
  const zapProgress = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    [
      0.0,
      1.0
    ],
    {
      clamp: true,
      ease: circOut
    }
  )
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.4],
    [0, 1],
    {
      clamp: true,
      ease: easeInOut
    }
  )
  const secondaryContentOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    [0, 1],
    {
      clamp: true,
      ease: easeInOut
    }
  )

  useInterval(() => {
    if (zapProgress.get() > 0.0001) {
      setAnimatedZapAmount(stats.most_zapped_post_sats)
    }
    else {
      setAnimatedZapAmount(10000)
    }
  }, 500)

  return <div
    ref={ref}
    className={cn("container z-30 mx-auto px-4 pt-12 h-full min-h-screen flex flex-col gap-y-4 justify-center items-center", className)}
    style={style}
  >
    <motion.h2
      className="text-4xl md:text-6xl text-center text-yellow-50 drop-shadow font-semibold break-keep tracking-tight z-30"
      style={{
        textShadow: "0 0 60px #facc15",
        opacity: headingOpacity,
      }}
    >
      Your most zapped note received
    </motion.h2>
    <motion.h3
      className="flex items-center gap-4 text-3xl md:text-8xl text-center text-white font-semibold break-keep tracking-tight z-30"
      style={{
        opacity: secondaryContentOpacity,
      }}
    >
      <motion.span
        style={{ opacity: secondaryContentOpacity }}
      >
        <ZapIcon className="w-8 h-8 md:w-16 md:h-16 text-amber-300" />
      </motion.span>
      <NumberFlow
        value={animatedZapAmount}
        continuous={true}
        transformTiming={{ duration: 1500, easing: "ease-out" }}
        opacityTiming={{ duration: 1500, easing: "ease-out" }}
        trend={1}
      />
      <motion.span
        className="text-amber-300"
        style={{ opacity: secondaryContentOpacity }}
      >
        sats
      </motion.span>
    </motion.h3>
    <motion.div
      className="space-y-4 z-30 w-full max-w-lg"
      style={{ opacity: secondaryContentOpacity }}
    >
      <NostrNoteView note={stats.most_zapped_post} className="w-full max-w-lg" />
    </motion.div>
  </div>
}
