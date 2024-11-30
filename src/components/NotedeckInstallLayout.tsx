import { motion, useScroll, useTransform } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "./ui/RoundedContainerWithGradientBorder";
import { PurpleIcon } from "./icons/PurpleIcon";
import { MeshGradient5 } from "./effects/MeshGradient.5";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";
import { ArrowLeft, LifeBuoy } from "lucide-react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import { Onest } from "next/font/google";
import StarField from "./effects/StarField";
import { MeshGradient1 } from "@/components/effects/MeshGradient.1";
import { useRef } from "react";
import { TopMenu } from "./sections/TopMenu";
import { MeshGradient2 } from "./effects/MeshGradient.2";
import { MeshGradient3 } from "./effects/MeshGradient.3";

const onest = Onest({ subsets: ['latin'] })


export function NotedeckInstallLayout({ children }: { children: React.ReactNode }) {
  const intl = useIntl()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  const mobileScreenshotOffsetX = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const bgOpacity = useTransform(scrollYProgress, [0.3, 1], [1.0, 0.0]);

  return (
    <div
      className="bg-black overflow-hidden relative min-h-screen"
    >
      <TopMenu/>
      <motion.div className="absolute z-0 w-full h-full pointer-events-none" style={{ opacity: bgOpacity }}>
        <MeshGradient3 className="-translate-x-1/3" />
      </motion.div>

      <div className="container z-10 mx-auto max-w-2xl px-6 pt-6 h-full flex flex-col justify-start mt-36">
        {children}
      </div>
    </div>
  )
}
