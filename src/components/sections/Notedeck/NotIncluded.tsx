import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Film, Joystick, KeyRound, Mail, Scale, Search, ThumbsUp, Upload, Wallet, Zap } from "lucide-react";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import { MarkdownView } from '@/components/ui/MarkdownView';
import { ItemSection } from './ItemSection';

const onest = Onest({ subsets: ['latin'] })

export function NotIncluded({ className }: { className?: string }) {
    const intl = useIntl()

    const itemsNotIncluded = [
        {
          icon: <Zap className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.not-included.feature1.name", defaultMessage: "Zaps" }),
            description: intl.formatMessage({ id: "notedeck.not-included.feature1.description", defaultMessage: "Tip creators and friends on nostr, or get tips for posting content" }),
            badgeText: intl.formatMessage({ id: "notedeck.not-included.feature1.badge", defaultMessage: "Coming 2025 Q1" })
        },
        {
          icon: <Mail className="text-white h-12 w-12 opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.not-included.feature2.name", defaultMessage: "DMs" }),
            description: intl.formatMessage({ id: "notedeck.not-included.feature2.description", defaultMessage: "Send direct messages to friends" }),
            badgeText: intl.formatMessage({ id: "notedeck.not-included.feature2.badge", defaultMessage: "Coming 2025 Q1" })
        },
        {
          icon: <Film className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.not-included.feature3.name", defaultMessage: "Embedded video" }),
            description: intl.formatMessage({ id: "notedeck.not-included.feature3.description", defaultMessage: "View videos directly from your feed" }),
            badgeText: intl.formatMessage({ id: "notedeck.not-included.feature3.badge", defaultMessage: "Coming 2025 Q1" })
        },
        {
          icon: <ThumbsUp className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.not-included.feature4.name", defaultMessage: "Likes/reactions/reposts" }),
            description: intl.formatMessage({ id: "notedeck.not-included.feature4.description", defaultMessage: "React to posts from your friends" }),
            badgeText: intl.formatMessage({ id: "notedeck.not-included.feature4.badge", defaultMessage: "Coming 2025 Q1" })
        },
        {
          icon: <Search className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.not-included.feature5.name", defaultMessage: "Search" }),
            description: intl.formatMessage({ id: "notedeck.not-included.feature5.description", defaultMessage: "Easily search for content on your feed or around the nostr network, and get suggestions when tagging users" }),
            badgeText: intl.formatMessage({ id: "notedeck.not-included.feature5.badge", defaultMessage: "Coming 2025 Q1" })
        },
        {
            icon: <Upload className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.not-included.feature6.name", defaultMessage: "Upload media" }),
            description: intl.formatMessage({ id: "notedeck.not-included.feature6.description", defaultMessage: "Attach images or videos to your posts" }),
            badgeText: intl.formatMessage({ id: "notedeck.not-included.feature6.badge", defaultMessage: "Coming 2025 Q1" })
        },
    ]

    return (<>
      <ItemSection
        heading={intl.formatMessage({ id: "notedeck.not-included.headline", defaultMessage: "What's NOT included so far, but we are building right now" })}
        subHeading={intl.formatMessage({ id: "notedeck.not-included.description", defaultMessage: "We are working very hard to get these features out as soon as possible. If you want to collaborate please check out our [GitHub](https://github.com/damus-io/notedeck/issues)" })}
        items={itemsNotIncluded}
      />
    </>)
}
