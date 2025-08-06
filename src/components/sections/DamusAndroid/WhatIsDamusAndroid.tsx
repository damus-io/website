import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Eye, Gauge, ArrowLeftRightIcon, Zap, Globe } from "lucide-react";
import Markdown from 'react-markdown';

const onest = Onest({ subsets: ['latin'] })

interface Item {
  icon: React.ReactNode;
  headline: string;
  description: string;
  badgeText?: string;
  badgeClassName?: string;
}

export function WhatIsDamusAndroid({ className }: { className?: string }) {
    const intl = useIntl()

    const list = {
      visible: {
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 2,
        },
      },
      hidden: {
        opacity: 0,
        transition: {
          when: "afterChildren",
        },
      },
    }

    const item = {
      visible: {
        opacity: 1
      },
      hidden: {
        opacity: 0
      },
    }

    const items: Item[] = [
        {
          icon: <Globe className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "damus-android.feature.audience.name", defaultMessage: "Android is for everyone" }),
          description: intl.formatMessage({ id: "damus-android.feature.audience.description", defaultMessage: "Open up the Damus experience to the billions of Android users worldwide. A native app built specifically for Android." }),
        },
        {
          icon: <Zap className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "damus-android.feature.speed.name", defaultMessage: "Lightning Fast Experience" }),
          description: intl.formatMessage({ id: "damus-android.feature.speed.description", defaultMessage: "Enjoy lightning-fast performance with zap integration, multiple columns, and a responsive interface built to handle your social media needs." }),
        },
        {
          icon: <ArrowLeftRightIcon className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "damus-android.feature.compatibility.name", defaultMessage: "Cross-Platform Compatibility" }),
          description: intl.formatMessage({ id: "damus-android.feature.compatibility.description", defaultMessage: "Seamlessly connect with the entire Nostr ecosystem, no matter what device others are using." }),
        },
    ]

    return (<>
      <div id="introducing" className={cn("bg-black overflow-hidden relative", className)}>
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
                              backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 60%, #2D175B 150%)",
                              transition: { duration: 2 },
                              opacity: 1
                          }}
                      >
                        {intl.formatMessage({ id: "damus-android.what-is.headline", defaultMessage: "What is Damus Android?" })}
                      </motion.h2>
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 1 }}
                        variants={list}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className={cn("text-white/60 text-2xl md:text-4xl leading-relaxed text-left max-w-4xl my-32 break-keep")}
                          variants={item}
                          transition={{ duration: 1 }}
                        >
                          <SpecialMarkdownView>
                            {intl.formatMessage({
                              id: "damus-android.what-is.description1",
                              defaultMessage: "**Damus Android brings the powerful, censorship-resistant Nostr experience** to Android devices. It's a **lightning-fast client** that puts you in control of your social media experience.\n\n"
                            })}
                          </SpecialMarkdownView>
                        </motion.div>
                        <motion.div
                          className={cn("text-white/60 text-2xl md:text-4xl leading-relaxed text-left max-w-4xl my-32 break-keep")}
                          variants={item}
                          transition={{ duration: 1 }}
                        >
                          <SpecialMarkdownView>
                            {intl.formatMessage({
                              id: "damus-android.what-is.description2",
                              defaultMessage: "A **native app built specifically for Android** that allows you to explore the Nostr social network with all the features you love, including:"
                            })}
                          </SpecialMarkdownView>
                        </motion.div>
                        <motion.div
                          className="flex flex-wrap gap-x-8 gap-y-16 items-stretch justify-center mt-28 mb-56"
                          variants={item}
                        >
                            {items.map((item, index) => (
                                <ItemView key={index} item={item} index={index} />
                            ))}
                        </motion.div>
                        <motion.div
                          className={cn("text-white/60 text-2xl md:text-4xl leading-relaxed text-left max-w-4xl my-32 break-keep")}
                          variants={item}
                          transition={{ duration: 1 }}
                        >
                          <SpecialMarkdownView>
                            {intl.formatMessage({
                              id: "damus-android.what-is.description3",
                              defaultMessage: "Join the millions of users already experiencing the **future of social media** with Damus. Now available on Android, the world's most popular mobile platform.\n\nDamus Android puts the power back in **your hands**, free from censorship, algorithms, and central control."
                            })}
                          </SpecialMarkdownView>
                        </motion.div>
                      </motion.div>
                  </div>
              </div>
          </div>
      </div>
    </>)
}

interface ItemViewProps {
  item: Item,
  index: number
}

function ItemView({ item, index }: ItemViewProps) {
  return (
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
  )
}

function SpecialMarkdownView({ children, className }: { children?: string | null | undefined, className?: string }) {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 1,
        staggerChildren: 1
      }
    }
  }

  const item = {
    hidden: { opacity: 0.6 },
    show: { opacity: 1 }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      transition={{ duration: 0.5 }}
      variants={container}
      className={className}
    >
      <Markdown components={{
        h1: ({node, ...props}) => <h1 className="opacity-90 font-bold text-6xl mb-6" {...props} />,
        h2: ({node, ...props}) => <h2 className="opacity-90 font-bold text-4xl mb-4" {...props} />,
        h3: ({node, ...props}) => <h3 className="opacity-90 font-bold text-2xl" {...props} />,
        ul: ({node, ...props}) => <ul className="opacity-80 list-disc list-inside mb-5" {...props} />,
        ol: ({node, ...props}) => <ol className="opacity-80 list-decimal list-inside mb-5" {...props} />,
        li: ({node, ...props}) => <li className="opacity-80 m-1" {...props} />,
        em: ({node, ...props}) => <i className="italic" {...props} />,
        // @ts-ignore
        strong: ({node, ...props}) => <motion.strong
          variants={item}
          className="font-bold text-white"
          {...props}
        />,
        p: ({node, ...props}) => <p className="opacity-80 mb-4" {...props} />,
        // @ts-ignore
        a: ({node, ...props}) => <motion.a
          variants={item}
          className="text-white font-bold underline"
          target="_blank"
          {...props}
        />,
        pre: ({node, ...props}) => <pre className="my-2 bg-white/10 overflow-scroll p-3 rounded-lg font-mono" {...props} />,
        code: ({node, ...props}) => {
          return (<code className="my-2 bg-white/10 overflow-scroll p-1 font-mono rounded-sm" {...props} />)
        },
      }} className={className}>{children}</Markdown>
    </motion.div>
  )
}
