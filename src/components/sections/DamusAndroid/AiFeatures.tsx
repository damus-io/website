import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BrainCircuit, Bot, ArrowRight, Sparkles } from "lucide-react";

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
                            <FormattedMessage defaultMessage="Damus Android incorporates cutting-edge AI to enhance your social media experience. Dave is your personal assistant, helping you navigate the nostr ecosystem." id="damus-android.ai.description"/>
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <Bot className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Content Creation" id="damus-android.ai.feature1.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Dave can help draft notes, suggest hashtags, and generate creative content based on your preferences." id="damus-android.ai.feature1.description"/>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <ArrowRight className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Discovery" id="damus-android.ai.feature2.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Discover new content and users that align with your interests through Dave's intelligent recommendations." id="damus-android.ai.feature2.description"/>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <Sparkles className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Personalization" id="damus-android.ai.feature3.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Dave learns from your interactions to deliver a more personalized experience over time." id="damus-android.ai.feature3.description"/>
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
                          src="/damus-android/dave2.png" 
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
