import Head from "next/head";
import { useIntl } from "react-intl";
import { Npub2024InReviewStats } from "@/pages/purple/2024-in-review/[npub]";
import { Year2024Intro } from "../sections/2024-year-in-review/Year2024Intro";
import { motion, useScroll, useTransform } from "framer-motion";
import StarField from "@/components/sections/2024-year-in-review/StarField"
import { MostZappedNote } from "../sections/2024-year-in-review/MostZappedNote";
import { EndThankYou } from "../sections/2024-year-in-review/EndThankYou";
import { useRef } from "react";
import { NumberOfPosts } from "../sections/2024-year-in-review/NumberOfPosts";


export function Purple2024YearInReview({ stats }: { stats: Npub2024InReviewStats }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const bgOpacity = useTransform(scrollYProgress, [0.7, 0.98], [1.0, 0.0]);

  return (<>
    <Head>
      <title>2024 in review</title>
    </Head>
    <main style={{ scrollBehavior: "smooth" }} className="bg-black">
      <div ref={ref} className="relative w-full" style={{ height: 1300 }}>
        <motion.div className="absolute top-0 z-0 w-full h-full pointer-events-none" style={{ opacity: bgOpacity }}>
          <StarField scrollYProgress={scrollYProgress} className="z-0 fixed top-0 left-0 object-cover object-center w-full h-full"/>
        </motion.div>
        <Year2024Intro />
      </div>
      {stats.number_of_posts && <NumberOfPosts numberOfPosts={stats.number_of_posts} style={{ paddingTop: "500px" }} />}
      <MostZappedNote stats={stats} style={{ paddingTop: "500px" }} />
      <EndThankYou />
    </main>
  </>)
}
