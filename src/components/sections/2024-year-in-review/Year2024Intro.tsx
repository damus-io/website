import { MotionValue, circOut, easeInOut, easeOut, motion, useMotionValue, useScroll, useTime, useTransform } from "framer-motion";
import { PurpleIcon } from "../../icons/PurpleIcon";
import { ArrowDown } from "lucide-react";
import { Orbitron } from "next/font/google";
import { cn } from "@/lib/utils";
import NumberFlow from '@number-flow/react'
import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react";

const orbitron = Orbitron({ subsets: ['latin'] })

export function Year2024Intro() {
  const time = useTime()
  const [year, setYear] = useState<number>(1971)
  const headingOpacity = useTransform(
    time,
    [0, 3000],
    [0, 1],
    {
      clamp: true,
      ease: easeInOut
    }
  )
  const secondaryContentOpacity = useTransform(
    time,
    [2000, 4000],
    [0, 1],
    {
      clamp: true,
      ease: easeInOut
    }
  )

  useEffect(() => {
    setTimeout(() => {
      setYear(2024)
    }, 500)
  }, [])

  return <div className="container z-30 mx-auto px-6 pt-12 h-auto min-h-screen flex flex-col gap-y-4 justify-center items-center">
    <motion.div
      style={{ opacity: secondaryContentOpacity }}
    >
      <PurpleIcon className="w-16 h-16" />
    </motion.div>
    <motion.h1
      className={cn("text-6xl md:text-9xl text-center text-white font-bold break-keep tracking-tight z-30", orbitron.className)}
      style={{
        opacity: headingOpacity,
      }}
    >
      <NumberFlow
        value={year}
        format={{ useGrouping: false }}
        continuous={true}
        transformTiming={{ duration: 1000, easing: "ease-out" }}
        opacityTiming={{ duration: 1000, easing: "ease-out" }}
        trend={1}
      />
    </motion.h1>
    <motion.div
      className="text-center text-purple-200/80 text-lg max-w-lg p-6 space-y-4 z-30"
      style={{ opacity: secondaryContentOpacity }}
    >
      <p>
        2024 was a great year! We continue to fight for a freer, healthier, and more open social network, and as a Purple member you are a key part of that mission!
      </p>
      <p>
        So we would like to extend and share our gratitude with you — and share some nice memories from the past year.
      </p>
      <p className="text-3xl">
        Let’s rewind!!
      </p>
      <div className="pt-8 flex gap-3 w-full justify-center">
        <ArrowDown className="w-12 h-12 animate-bounce" />
      </div>
    </motion.div>
  </div>
}
