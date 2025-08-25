import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import React from 'react';

const onest = Onest({ subsets: ['latin'] })

export interface ItemSectionProps {
  className?: string,
  subHeadingClassName?: string,
  heading: string,
  subHeading: string,
  items: Item[],
  customChild?: React.ReactNode
}

export interface Item {
    icon: React.ReactNode
    headline: string
    description: string
    badgeClassName?: string
    badgeText?: string
}

export function ItemSection({ className, subHeadingClassName, heading, subHeading, items, customChild }: ItemSectionProps) {
    const intl = useIntl()

    return (<>
        <div className={cn("bg-black overflow-hidden relative", className)}>
            <div className="container mx-auto px-6 pb-32 pt-20">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-16 flex flex-col items-center">
                        <motion.h2
                            className={cn("mt-6 text-3xl sm:text-4xl md:text-5xl text-center text-transparent bg-clip-text pb-6 font-semibold whitespace-pre-line max-w-4xl tracking-wide leading-relaxed", onest.className)}
                            style={{
                                backgroundImage: "linear-gradient(to right, #ffffff -100%, #ffffff -40%, #2D175B 100%)",
                                opacity: 0,
                            }}
                            animate={{
                                backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 40%, #2D175B 100%)",
                                transition: { duration: 3 },
                                opacity: 1
                            }}
                        >
                          {heading}
                        </motion.h2>
                        <motion.div className={cn("text-white/60 text-xl text-center max-w-2xl mb-4 mt-6 break-keep", subHeadingClassName)}>
                          {subHeading}
                        </motion.div>
                    </div>
                    {(intl.locale != "ja" || process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (
                        <div className="flex flex-wrap gap-x-8 gap-y-16 items-stretch justify-center">
                            {items.map((item, index) => (
                                <div key={index} className="w-72 flex flex-col items-start justify-start">
                                    <div className="flex justify-between w-full items-start">
                                      {item.icon}
                                      {item.badgeText && (
                                        <div className={cn("py-1 px-2 bg-orange-500/30 text-orange-200 rounded-lg", item.badgeClassName)}>
                                          {item.badgeText}
                                        </div>
                                      )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-br text-white text-left text-normal mt-6">
                                        {item.headline}
                                    </h3>
                                    <p className="text-white/80 text-left text-normal mt-4">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {customChild}
            </div>
        </div>
    </>)
}