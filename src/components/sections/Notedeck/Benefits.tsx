import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Lock, User, Layers, Bell, FileText, LogOut } from "lucide-react";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import { ItemSection } from './ItemSection';

const onest = Onest({ subsets: ['latin'] })

export function Benefits({ className }: { className?: string }) {
    const intl = useIntl()

    const benefits = [
        {
            icon: <Lock className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.benefits.benefit1.name", defaultMessage: "Login with Private Key (nsec)" }),
            description: intl.formatMessage({ id: "notedeck.benefits.benefit1.description", defaultMessage: "Access your account directly with your private key for enhanced security and privacy" }),
        },
        {
            icon: <User className="text-white h-12 w-12 opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.benefits.benefit2.name", defaultMessage: "Login with Public Key (npub)" }),
            description: intl.formatMessage({ id: "notedeck.benefits.benefit2.description", defaultMessage: "Login with any public key for a read-only view of any nostr account" }),
        },
        {
            icon: <Layers className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.benefits.benefit3.name", defaultMessage: "Multiple Accounts" }),
            description: intl.formatMessage({ id: "notedeck.benefits.benefit3.description", defaultMessage: "Easily manage multiple accounts. Great for quickly switching between work and personal accounts" }),
        },
        {
            icon: <Bell className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.benefits.benefit4.name", defaultMessage: "Profile, Notification, and Hashtag columns" }),
            description: intl.formatMessage({ id: "notedeck.benefits.benefit4.description", defaultMessage: "Add columns to view profiles, hashtags, and notifications at a glance" }),
        },
        {
            icon: <FileText className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.benefits.benefit5.name", defaultMessage: "Create and Interact with Posts" }),
            description: intl.formatMessage({ id: "notedeck.benefits.benefit5.description", defaultMessage: "Create posts, reply to others, and quote notes to engage with the nostr community" }),
        },
        {
            icon: <LogOut className="h-12 w-12 text-white opacity-80"/>,
            headline: intl.formatMessage({ id: "notedeck.benefits.benefit6.name", defaultMessage: "Log Out Securely" }),
            description: intl.formatMessage({ id: "notedeck.benefits.benefit6.description", defaultMessage: "Easily log out of your account whenever needed for privacy" }),
        },
    ]

    return (<>
      <ItemSection
        heading={intl.formatMessage({ id: "notedeck.benefits.headline", defaultMessage: "What’s included in Notedeck Alpha with your Damus Purple subscription?" })}
        subHeading={intl.formatMessage({ id: "notedeck.benefits.description", defaultMessage: "These are currently the features you will receive immediately when you subscribe to Damus Purple" })}
        items={benefits}
      />
    </>)
}
