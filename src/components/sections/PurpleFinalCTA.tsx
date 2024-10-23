import { Button } from "../ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowUpRight, MessageCircleIcon, GitBranch, Github } from "lucide-react";
import { PurpleIcon } from "../icons/PurpleIcon";
import { MeshGradient5 } from "../effects/MeshGradient.5";

export function PurpleFinalCTA({ className }: { className?: string }) {
  const intl = useIntl()

  return (<>
    <div className={cn("bg-black overflow-hidden relative", className)}>
      <div className="container mx-auto px-6 pb-24 pt-24">
        <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
          <div className="relative mb-24 flex flex-col items-center justify-center">
            <div className="absolute pointer-events-none">
              <MeshGradient5 />
            </div>
            <div className="relative w-24 h-24 mb-8 rounded-xl overflow-hidden shadow-xl">
              <PurpleIcon />
            </div>
            <motion.h2 className="mb-1 text-4xl md:text-5xl lg:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-5% to-[#E0A4D3] to-100% font-semibold whitespace-pre-line leading-relaxed">
              {intl.formatMessage({ id: "purple.final_cta.headline", defaultMessage: "Get Purple today!" })}
            </motion.h2>
            <motion.h3 className="mb-8 text-2xl md:text-3xl lg:text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-5% to-[#E0A4D3] to-100% font-semibold pb-4 whitespace-pre-line leading-relaxed">
              {intl.formatMessage({ id: "purple.final_cta.subheadline", defaultMessage: "for as little as 15k sats/month" })}
            </motion.h3>
            <motion.div className="text-xl text-center max-w-2xl mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white from-5% to-damuspink-500 to-100% whitespace-pre-line leading-loose">
              {(intl.locale != "ja" || process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (<>
                {intl.formatMessage({ id: "purple.final_cta.text", defaultMessage: "Contribute to the future of the free internet, access exclusive features, and look cool doing it." })}
              </>)}
            </motion.div>
            <motion.div
              className="mt-10 md:mt-6 flex flex-col md:flex-row items-center md:items-center justify-center gap-y-4 gap-x-6 w-full"
              style={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
            >
              <Link href="/purple/checkout" className="w-full md:w-auto">
                <Button variant="default" className="w-full">
                  {intl.formatMessage({ id: "purple.final_cta.become-a-member", defaultMessage: "Become a member" })}
                </Button>
              </Link>
              <Link href="damus:purple:landing" target="_blank" className="w-full md:w-auto">
                <Button variant="link" className="w-full">
                  {intl.formatMessage({ id: "purple.final_cta.open_app", defaultMessage: "Open in Damus" })}
                  <ArrowUpRight className="text-damuspink-600 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </>)
}
