import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "./ui/RoundedContainerWithGradientBorder";
import { PurpleIcon } from "./icons/PurpleIcon";
import { MeshGradient5 } from "./effects/MeshGradient.5";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";
import { ArrowLeft, LifeBuoy } from "lucide-react";
import { useIntl } from "react-intl";


export function PurpleLayout({ children }: { children: React.ReactNode }) {
  const intl = useIntl()

  return (
    <div
      className="bg-black overflow-hidden relative"
    >
      <div className="absolute z-0 w-full h-full pointer-events-none">
        <Image src="/stars-bg.webp" fill className="absolute top-0 left-0 object-cover lg:object-contain object-center w-full h-full" alt="" aria-hidden="true" />
        <MeshGradient5 className="translate-y-1/4 translate-x-32" />
      </div>
      <div className="container z-10 mx-auto px-6 pt-12 h-full min-h-screen flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center h-full grow">
          <RoundedContainerWithGradientBorder className="w-full max-w-md h-full mb-4" innerContainerClassName="w-full">
            <div className="flex gap-x-4 items-center mb-12 mx-auto justify-center">
              <PurpleIcon className="w-16 h-16" />
              <motion.h2 className="text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-damuspink-500 from-30% to-damuspink-600 to-100% font-semibold break-keep tracking-tight">
                Purple
              </motion.h2>
            </div>
            {children}
          </RoundedContainerWithGradientBorder>
          <Link href="/purple" className="w-full md:w-auto opacity-70 hover:opacity-100 transition mb-4">
            <Button variant="link" className="w-full text-sm">
              <ArrowLeft className="text-damuspink-600 mr-2" />
              {intl.formatMessage({ id: "purple.account.back", defaultMessage: "Go back" })}
            </Button>
          </Link>
          <div className="flex flex-col rounded-xl px-4 text-purple-200 w-full mt-4 gap-1">
            <div className="flex justify-center">
              <LifeBuoy className="mr-2" />
              {intl.formatMessage({ id: "purple.account.contact-support", defaultMessage: "Contact support" })}
            </div>
            <div className="flex justify-center">
              <Link href="mailto:support@damus.io" className="w-full md:w-auto opacity-70 hover:opacity-100 transition text-sm">
                <Button variant="link" className="w-full text-sm">
                  {intl.formatMessage({ id: "purple.account.email-support", defaultMessage: "Via email" })}
                </Button>
              </Link>
              <Link href="nostr:npub18m76awca3y37hkvuneavuw6pjj4525fw90necxmadrvjg0sdy6qsngq955" className="w-full md:w-auto opacity-70 hover:opacity-100 transition text-sm">
                <Button variant="link" className="w-full text-sm">
                  {intl.formatMessage({ id: "purple.account.nostr-support", defaultMessage: "Via Nostr" })}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
