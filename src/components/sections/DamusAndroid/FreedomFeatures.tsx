import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Globe, MessageSquare, Shield, Zap } from "lucide-react";

const onest = Onest({ subsets: ['latin'] })

export function FreedomFeatures({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div id="freedom" className={cn("bg-black w-full py-28 overflow-hidden", className)}>
            <div className="container mx-auto px-6 pt-6">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                    <motion.div 
                        className="flex-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-purple-900/30 text-purple-200 px-4 py-2 rounded-full mb-6">
                            <Shield className="h-5 w-5" />
                            <span className="text-sm font-medium">Freedom Focused</span>
                        </div>
                        <h2 className={cn("text-4xl sm:text-5xl text-white font-semibold mb-6", onest.className)}>
                            <FormattedMessage defaultMessage="Take Back Control of Social Media" id="damus-android.freedom.headline"/>
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            <FormattedMessage defaultMessage="Damus Android gives you the freedom to express yourself without fear of censorship or algorithmic manipulation. Free speech, free money, free communication." id="damus-android.freedom.description"/>
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <MessageSquare className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="No Shadow Banning" id="damus-android.freedom.feature1.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Your posts reach your audience without arbitrary algorithmic filtering or shadow banning." id="damus-android.freedom.feature1.description"/>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <Zap className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Free Money" id="damus-android.freedom.feature2.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Integrated Bitcoin Lightning Network enables direct value transfer without intermediaries or gatekeepers." id="damus-android.freedom.feature2.description"/>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-900/40 p-3 rounded-lg">
                                    <Globe className="h-6 w-6 text-purple-200" />
                                </div>
                                <div>
                                    <h3 className={cn("text-xl text-white font-medium mb-2", onest.className)}>
                                        <FormattedMessage defaultMessage="Censorship Resistant" id="damus-android.freedom.feature3.title"/>
                                    </h3>
                                    <p className="text-white/70">
                                        <FormattedMessage defaultMessage="Built on the decentralized Nostr protocol, Damus Android cannot be shut down or controlled by any single entity." id="damus-android.freedom.feature3.description"/>
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
                          src="/damus-android/feed.png" 
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
