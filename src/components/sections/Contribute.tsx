import { Button } from "../ui/Button";
import { useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Ticker, TickerImage } from "../ui/Ticker";
import { ArrowUpRight, MessageCircleIcon, GitBranch, Github } from "lucide-react";
import { DAMUS_MERCH_STORE_URL } from "@/lib/constants";
import { MeshGradient4 } from "../effects/MeshGradient.4";
import { GithubIcon } from "../icons/GithubIcon";

export function Contribute({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div className={cn("bg-black overflow-hidden relative", className)}>
            <div className="container mx-auto px-6 pb-24 pt-24">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-24 flex flex-col items-center justify-center">
                        <div className="absolute pointer-events-none">
                            <MeshGradient4/>
                        </div>
                        <GithubIcon className="w-24 h-24 mb-8" />
                        <motion.h2 className="mb-8 text-3xl md:text-5xl lg:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-5% to-[#E0A4D3] to-100% font-semibold">
                            { intl.formatMessage({ id: "contribute.headline", defaultMessage: "Contribute to Damus development" }) }
                        </motion.h2>
                        <motion.div className="text-xl text-center max-w-2xl mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white from-5% to-[#8DEBF8] to-100%">
                            { intl.formatMessage({ id: "contribute.subheadline", defaultMessage: "Be part of the most popular Nostr client, start collaborating with an amazing team of developers, designers, product owners and more. Join us in our mission to make social media more healthy and free!" }) }
                        </motion.div>
                        <div className="flex flex-col md:flex-row gap-x-8 gap-y-4">
                            <Link href="https://github.com/damus-io/damus/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue+😌%22" target="_blank">
                                <Button variant="default" className="w-full md:w-auto">
                                    <div className="mr-2">😌</div>
                                    { intl.formatMessage({ id: "contribute.good_first_issues", defaultMessage: "Good first issues" }) }
                                    <ArrowUpRight className="ml-2" />
                                </Button>
                            </Link>
                            <Link href="https://damus.io/code" target="_blank">
                                <Button variant="default" className="w-full md:w-auto">
                                    <GitBranch className="mr-2" />
                                    { intl.formatMessage({ id: "contribute.go_to_github", defaultMessage: "Go to Github" }) }
                                    <ArrowUpRight className="ml-2" />
                                </Button>
                            </Link>
                            <Link href="https://damus.io/npub1zafcms4xya5ap9zr7xxr0jlrtrattwlesytn2s42030lzu0dwlzqpd26k5" target="_blank">
                                <Button variant="default" className="w-full md:w-auto">
                                    <MessageCircleIcon className="mr-2" />
                                    { intl.formatMessage({ id: "contribute.talk_to_a_team_member", defaultMessage: "Talk to a team member" }) }
                                    <ArrowUpRight className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
