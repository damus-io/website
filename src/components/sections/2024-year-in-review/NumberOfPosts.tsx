import { MotionValue, circOut, easeInOut, easeOut, motion, useMotionValue, useScroll, useTime, useTransform } from "framer-motion";
import { ArrowDown, ZapIcon, StickyNote } from "lucide-react";
import { NostrNoteView, ParsedNote } from "@/components/note/NostrNoteView";
import { Npub2024InReviewStats } from "@/pages/purple/2024-in-review/[npub]";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { Orbitron, Permanent_Marker } from "next/font/google";
import NumberFlow from '@number-flow/react'
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import Image from "next/image";

// const permanentMarker = Permanent_Marker({ weight: "400", subsets: ['latin'] });

export function NumberOfPosts({ numberOfPosts, className, style }: { numberOfPosts: number, className?: string, style?: React.CSSProperties }) {
  const time = useTime()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref
  })
  const [animatedPostAmount, setAnimatedPostAmount] = useState(10);
  const postAmountProgress = useTransform(
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
  const tertiaryContentOpacity = useTransform(
    scrollYProgress,
    [0.8, 1.0],
    [0, 1],
    {
      clamp: true,
      ease: easeInOut
    }
  )

  useInterval(() => {
    if (postAmountProgress.get() > 0.0001) {
      setAnimatedPostAmount(numberOfPosts)
    }
    else {
      setAnimatedPostAmount(10)
    }
  }, 500)

  return <div
    ref={ref}
    className={cn("container z-30 mx-auto px-4 pt-12 h-full min-h-screen flex flex-col gap-y-4 justify-center items-center", className)}
    style={style}
  >
    <motion.h2
      className={cn(
        "text-4xl md:text-6xl text-center text-white font-semibold break-keep tracking-tight z-30",
        // permanentMarker.className
      )}
      style={{
        opacity: headingOpacity,
      }}
    >
      You posted
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
        <StickyNote className="w-8 h-8 md:w-16 md:h-16 text-purple-400" />
      </motion.span>
      <NumberFlow
        value={animatedPostAmount}
        continuous={true}
        transformTiming={{ duration: 1500, easing: "ease-out" }}
        opacityTiming={{ duration: 1500, easing: "ease-out" }}
        trend={1}
      />
      <motion.span
        className="text-purple-400"
        style={{ opacity: secondaryContentOpacity }}
      >
        notes
      </motion.span>
    </motion.h3>
    <motion.div
      className="space-y-4 z-30"
      style={{ opacity: tertiaryContentOpacity }}
    >
      {numberOfPosts > 200 ?
        <Image src="/2024-in-review/cat-typing.webp" alt="Cat typing" width={500} height={500} />
        :
        <Image src="/2024-in-review/ostrich-dancing.webp" alt="Cat typing" width={500} height={500} />
      }
    </motion.div>
  </div>
}
