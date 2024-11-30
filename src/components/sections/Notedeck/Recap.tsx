import { Onest } from 'next/font/google'
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "@/components/ui/RoundedContainerWithGradientBorder";
import { cn } from "@/lib/utils";
import { Lock, User, Layers, Bell, FileText, LogOut, Settings2, Gauge, Globe, Sparkles } from "lucide-react";
import { MeshGradient3 } from "@/components/effects/MeshGradient.3";
import { Item, ItemSection } from './ItemSection';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const onest = Onest({ subsets: ['latin'] })

export function Recap({ className }: { className?: string }) {
    const intl = useIntl()

    const items: Item[] = [
        {
          icon: <Settings2 className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "notedeck.feature.customization.name", defaultMessage: "Customization" }),
          description: intl.formatMessage({ id: "notedeck.feature.customization.description", defaultMessage: "Custom feeds, ability to switch between your accounts, follow hashtags in separate columns, the list goes on. Nostr prioritizes user choice and Notedeck takes this to the next level" }),
        },
        {
          icon: <Gauge className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "notedeck.feature.speed.name", defaultMessage: "Speed" }),
          description: intl.formatMessage({ id: "notedeck.feature.speed.description", defaultMessage: "The fastest nostr client. Built from the ground up with an ultra-fast database made exclusively for nostr, leveraging several state-of-the-art performance techniques not available on web clients" }),
        },
        {
          icon: <Globe className="h-12 w-12 text-white opacity-80"/>,
          headline: intl.formatMessage({ id: "notedeck.feature.availability.name", defaultMessage: "Available Everywhere" }),
          description: intl.formatMessage({ id: "notedeck.feature.availability.description", defaultMessage: "We're no longer tied to Apple restrictions... Notedeck will eventually be available on all platforms, for everyone and with the ability to zap without approval. The sky's the limit!" }),
        },
    ]

    return (<>
      <ItemSection
        heading={intl.formatMessage({ id: "notedeck.recap.headline", defaultMessage: "Let’s recap" })}
        subHeading={intl.formatMessage({ id: "notedeck.recap.description", defaultMessage: "Damus Notedeck is a lightning fast native app that allows you to explore the nostr social network in a completely new way, with several power features. **Try it today** with our [Purple](/purple) subscription" })}
        items={items}
        customChild={
          <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 mx-auto my-32 w-full justify-center">
            {(intl.locale != "ja" ||
              process.env.FORCE_LOAD_ALL_JA_SECTIONS) && (
              <Link
                href="/notedeck/install"
                target="_blank"
              >
                <Button variant="accent" className="w-full md:w-auto text-xl">
                  <Sparkles className="mr-2" />
                  {intl.formatMessage({
                    id: "notedeck.recap.try_it_today",
                    defaultMessage: "Install now",
                  })}
                </Button>
              </Link>
            )}
          </div>
        }
      />

    </>)
}
