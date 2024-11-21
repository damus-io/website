import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Columns, Eye, Film, Gauge, Globe, Joystick, KeyRound, Mail, Scale, Search, Settings2, ThumbsUp, Upload, Wallet, Zap, ArrowLeftRightIcon } from "lucide-react";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import { MarkdownView } from '@/components/ui/MarkdownView';
import { Item, ItemSection } from './ItemSection';
import Markdown from 'react-markdown';

const onest = Onest({ subsets: ['latin'] })

export function WhatIsNotedeck({ className }: { className?: string }) {
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
          icon: <Eye className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "notedeck.feature.customization.name", defaultMessage: "Powerful Views" }),
          description: intl.formatMessage({ id: "notedeck.feature.customization.description", defaultMessage: "Add profile, hashtag, and notification columns of any nostr public or private key. Which means you can see the nostr landscape through other peoples' eyes" }),
        },
        {
          icon: <Gauge className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "notedeck.feature.speed.name", defaultMessage: "Speed" }),
          description: intl.formatMessage({ id: "notedeck.feature.speed.description", defaultMessage: "The fastest nostr client. Built from the ground up with an ultra-fast database made exclusively for nostr, leveraging several state-of-the-art performance techniques not available on web clients" }),
        },
        {
          icon: <ArrowLeftRightIcon className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "notedeck.feature.availability.name", defaultMessage: "Switch Between Accounts" }),
          description: intl.formatMessage({ id: "notedeck.feature.availability.description", defaultMessage: "Nostriches can also switch between multiple accounts quickly and easily, drastically improving personal and business use cases" }),
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
                        {intl.formatMessage({ id: "notedeck.what-is.headline", defaultMessage: "Introducing Notedeck" })}
                      </motion.h2>
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 1 }}
                        variants={list}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className={cn("text-white/60 text-4xl leading-relaxed text-left max-w-4xl my-32 break-keep")}
                          variants={item}
                          transition={{ duration: 1 }}
                        >
                          <SpecialMarkdownView>
                            {intl.formatMessage({
                              id: "notedeck.what-is.description1",
                              defaultMessage: "**Nostr is the future of social media** and Notedeck is our latest innovation towards the **future of nostr**.\n\n"
                            })}
                          </SpecialMarkdownView>
                        </motion.div>
                        <motion.div
                          className={cn("text-white/60 text-4xl leading-relaxed text-left max-w-4xl my-32 break-keep")}
                          variants={item}
                          transition={{ duration: 1 }}
                        >
                          <SpecialMarkdownView>
                            {intl.formatMessage({
                              id: "notedeck.what-is.description2",
                              defaultMessage: "A **lightning fast native app** that allows you to explore the nostr social network in a **completely new way**! Notedeck includes several power features to both personal and business use cases, including:"
                            })}
                          </SpecialMarkdownView>
                        </motion.div>
                        {(intl.locale != "ja" || process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (
                            <motion.div
                              className="flex flex-wrap gap-x-8 gap-y-16 items-stretch justify-center mt-28 mb-56"
                              variants={item}
                            >
                                {items.map((item, index) => (
                                    <ItemView key={index} item={item} index={index} />
                                ))}
                            </motion.div>
                        )}
                        <motion.div
                          className={cn("text-white/60 text-4xl leading-relaxed text-left max-w-4xl my-32 break-keep")}
                          variants={item}
                          transition={{ duration: 1 }}
                        >
                          <SpecialMarkdownView>
                            {intl.formatMessage({
                              id: "notedeck.what-is.description3",
                              defaultMessage: "This isn't a web app and it's not just \"another\" social client. This is nostr **like you've never seen it before!**\n\nNotedeck works on **Linux**, **macOS**, and **Windows** on day one. An Android version will be added in 2025, along with iOS and iPadOS eventually.\n\nFuture nostr apps **will run on Notedeck in 2025.**\n\nAn early Notedeck Alpha version is available **today** to our paid [Purple](/purple) subscribers."
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
