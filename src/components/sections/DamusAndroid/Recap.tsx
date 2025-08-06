import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import { Zap, Download, ArrowRight } from "lucide-react";
import Image from "next/image";

const onest = Onest({ subsets: ['latin'] })

export function Recap({ className }: { className?: string }) {
    const intl = useIntl()

    return (<>
        <div id="download" className={cn("relative bg-black w-full py-28 overflow-hidden", className)}>
            <div className="container relative z-10 mx-auto px-6 pt-6">
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={cn("text-4xl sm:text-5xl md:text-6xl text-white font-semibold mb-6", onest.className)}>
                        <FormattedMessage defaultMessage="Ready to Take Back Control?" id="damus-android.recap.headline"/>
                    </h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
                        <FormattedMessage 
                            defaultMessage="Join thousands of users already experiencing the future of social media on the Nostr protocol." 
                            id="damus-android.recap.closing"
                        />
                    </p>
                    
                    <div className="flex justify-center items-center max-w-lg mx-auto">
                        <Button variant="accent" size="lg" className="w-full md:w-auto flex items-center gap-2 text-lg font-semibold">
                            <Download className="w-5 h-5" />
                            {intl.formatMessage({ id: "damus-android.recap.download", defaultMessage: "Download Now" })}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    </>)
}
