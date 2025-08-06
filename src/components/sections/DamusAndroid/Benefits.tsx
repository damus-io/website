import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Users, Key, Zap, Columns, MessageSquare, Shield } from "lucide-react";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import { ItemSection } from './ItemSection';

const onest = Onest({ subsets: ['latin'] })

export function Benefits({ className }: { className?: string }) {
    const intl = useIntl()

    const benefits = [
        {
            icon: <Users className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "damus-android.benefits.benefit1.name", defaultMessage: "Social by Design" }),
            description: intl.formatMessage({ id: "damus-android.benefits.benefit1.description", defaultMessage: "Make the internet social again - bring your friends with you, zap them, get zapped, and build real connections" }),
        },
        {
            icon: <Key className="text-white h-12 w-12 opacity-80"/>,
            headline: intl.formatMessage({ id: "damus-android.benefits.benefit2.name", defaultMessage: "Own Your Identity" }),
            description: intl.formatMessage({ id: "damus-android.benefits.benefit2.description", defaultMessage: "Take control of your online presence with true ownership of your identity - no corporate overlords" }),
        },
        {
            icon: <Zap className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "damus-android.benefits.benefit3.name", defaultMessage: "Lightning Integration" }),
            description: intl.formatMessage({ id: "damus-android.benefits.benefit3.description", defaultMessage: "Seamless Bitcoin Lightning Network integration for zapping your favorite content creators" }),
        },
        {
            icon: <Columns className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "damus-android.benefits.benefit4.name", defaultMessage: "Multiple Columns" }),
            description: intl.formatMessage({ id: "damus-android.benefits.benefit4.description", defaultMessage: "Customize your experience with multiple columns to view different feeds, profiles, and topics simultaneously" }),
        },
        {
            icon: <MessageSquare className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "damus-android.benefits.benefit5.name", defaultMessage: "AI Assistant (Dave)" }),
            description: intl.formatMessage({ id: "damus-android.benefits.benefit5.description", defaultMessage: "Integrated AI assistant to help you navigate, create content, and enhance your social media experience" }),
        },
        {
            icon: <Shield className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "damus-android.benefits.benefit6.name", defaultMessage: "Censorship Resistant" }),
            description: intl.formatMessage({ id: "damus-android.benefits.benefit6.description", defaultMessage: "No shadow banning, no censorship - a truly free platform for expression and communication" }),
        },
    ]

    return (<>
      <div className="relative bg-black py-20">
        <div className="absolute inset-0 opacity-30">
          <MeshGradient3 />
        </div>
        <ItemSection
          heading={intl.formatMessage({ id: "damus-android.benefits.headline", defaultMessage: "Key Benefits of Damus Android" })}
          subHeading={intl.formatMessage({ id: "damus-android.benefits.description", defaultMessage: "Experience the power of decentralized social media on your Android device" })}
          items={benefits}
        />
      </div>
    </>)
}