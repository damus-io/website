import { Button } from "@/components/ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, MessageCircleIcon, GitBranch, Megaphone, Github } from "lucide-react";
import { MeshGradient4 } from "@/components/effects/MeshGradient.4";
import { GithubIcon } from "@/components/icons/GithubIcon";
import Image from "next/image";

export function ShareFeedback({ className }: { className?: string }) {
  const intl = useIntl();

  return (
    <>
      <div className={cn("bg-black overflow-hidden relative", className)}>
        <div className="container mx-auto px-6 pb-24 pt-24">
          <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
            <div className="relative mb-24 flex flex-col items-center justify-center">
              <Image
                src="/notedeck/share-feedback.png"
                width={192}
                height={110.5}
                className="mb-8"
                alt={"Share feedback icon"}
              />
              <motion.h2 className="mb-8 text-3xl md:text-5xl lg:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-5% to-[#E0A4D3] to-100% font-semibold">
                {intl.formatMessage({
                  id: "notedeck.feedback.headline",
                  defaultMessage: "Share your feedback with us",
                })}
              </motion.h2>
              {(intl.locale != "ja" ||
                process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (
                <motion.div className="text-xl text-center max-w-2xl mb-12 text-white">
                  {intl.formatMessage({
                    id: "notedeck.feedback.subheadline",
                    defaultMessage:
                      "We encourage you to send feedback to our Damus npub over nostr or Github to we can take it in consideration in our Roadmap",
                  })}
                </motion.div>
              )}
              <div className="flex flex-col md:flex-row gap-x-8 gap-y-4">
                {(intl.locale != "ja" ||
                  process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (
                  <Link
                    href="mailto:support@damus.io"
                    target="_blank"
                  >
                    <Button variant="accent" className="w-full md:w-auto">
                      <Megaphone className="mr-2" />
                      {intl.formatMessage({
                        id: "notedeck.feedback.share-feedback",
                        defaultMessage: "Send Feedback",
                      })}
                      <ArrowUpRight className="ml-2" />
                    </Button>
                  </Link>
                )}
                <Link href="https://github.com/damus-io/notedeck/issues/" target="_blank">
                  <Button variant="default" className="w-full md:w-auto">
                    <Github className="mr-2" />
                    {intl.formatMessage({
                      id: "notedeck.feedback.view_github",
                      defaultMessage: "View our GitHub",
                    })}
                    <ArrowUpRight className="ml-2" />
                  </Button>
                </Link>
                {(intl.locale != "ja" ||
                  process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (
                  <Link
                    href="https://njump.me/npub1zafcms4xya5ap9zr7xxr0jlrtrattwlesytn2s42030lzu0dwlzqpd26k5"
                    target="_blank"
                  >
                    <Button variant="default" className="w-full md:w-auto">
                      <MessageCircleIcon className="mr-2" />
                      {intl.formatMessage({
                        id: "contribute.talk_to_a_team_member",
                        defaultMessage: "Talk to a team member",
                      })}
                      <ArrowUpRight className="ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
