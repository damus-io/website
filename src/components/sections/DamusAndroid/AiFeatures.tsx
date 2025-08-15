import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BrainCircuit, Search, FileText, HelpCircle } from "lucide-react";

const onest = Onest({ subsets: ['latin'] })

export function AiFeatures({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div className={cn("bg-black w-full py-28 overflow-hidden", className)}>
            <div className="container mx-auto px-6 pt-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <motion.div 
                        className="flex-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-purple-900/30 text-purple-200 px-4 py-2 rounded-full mb-6">
                            <BrainCircuit className="h-5 w-5" />
                            <span className="text-sm font-medium">AI-Powered</span>
                        </div>
                        <h2 className={cn("text-4xl sm:text-5xl text-white font-semibold mb-6", onest.className)}>
                            <FormattedMessage defaultMessage="Meet Dave, Your AI Assistant" id="damus-android.ai.headline"/>
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            <FormattedMessage defaultMessage="Damus Android incorporates cutting-edge AI to enhance your nostr experience. Dave is your intelligent assistant, helping you search, understand, and interact with content across the network." id="damus-android.ai.description"/>
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <Search className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Search" id="damus-android.ai.feature1.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Dave can help users search and find content across the network with advanced contextual understanding." id="damus-android.ai.feature1.description"/>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <FileText className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Summarization" id="damus-android.ai.feature2.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Dave can summarize the content it searches, helping you quickly understand conversations and topics without reading every note." id="damus-android.ai.feature2.description"/>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Question Answering" id="damus-android.ai.feature3.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Dave can answer questions based on notes it sees on the network, giving you insights and information from across the nostr ecosystem." id="damus-android.ai.feature3.description"/>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="flex-1 flex justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Image 
                          src="/damus-android/dave2.webp"
                          width={300} 
                          height={600} 
                          alt="Freedom of expression in Damus Android"
                          className="rounded-lg shadow-xl"
                      />
                    </motion.div>
                </div>
            </div>
        </div>
    </>)
}
