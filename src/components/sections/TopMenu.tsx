import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Zap } from "lucide-react"
import { Button } from "../ui/Button";
import { DAMUS_APP_STORE_URL, DAMUS_MERCH_STORE_URL } from "@/lib/constants";
import { useIntl } from "react-intl";
import { motion } from "framer-motion";

let regularNavItems: { nameIntlId: string, href: string, target?: string }[] = [
    { nameIntlId: "topbar.store", href: DAMUS_MERCH_STORE_URL, target: "_blank" },
    { nameIntlId: "topbar.events", href: "/#events" },
    { nameIntlId: "topbar.team", href: "/#team" },
    { nameIntlId: "topbar.contribute", href: "/#contribute" },
]

const ENABLE_FULL_MENU = true

export function TopMenu({ className }: { className?: string }) {
    let navItemDefaultStyles = "hover:opacity-80 transition-opacity duration-200 ease-in-out"
    const intl = useIntl()

    // This is needed to allow intl commands to extract the strings
    const topbarItemNameIntl: Record<string, string> = {
        "topbar.store": intl.formatMessage({ id: "topbar.store", defaultMessage: "Store" }),
        "topbar.events": intl.formatMessage({ id: "topbar.events", defaultMessage: "Events" }),
        "topbar.team": intl.formatMessage({ id: "topbar.team", defaultMessage: "Our Team" }),
        "topbar.contribute": intl.formatMessage({ id: "topbar.contribute", defaultMessage: "Contribute" }),
    }

    return (
        <motion.div
            style={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
        >
            <NavigationMenu.Root className={cn("flex justify-between items-center", className)}>
                <div>
                    <NavigationMenu.Link className={cn(navItemDefaultStyles, "text-white")} href="/">
                        <img src="/logo.png" className="h-12" alt={ intl.formatMessage({ id: "topbar.logo_alt_text", defaultMessage: "Damus logo" }) }/>
                    </NavigationMenu.Link>
                </div>
                <NavigationMenu.List className={cn("hidden lg:inline-flex space-x-6 items-center justify-self-center")}>
                    {ENABLE_FULL_MENU && (<>
                        {regularNavItems.map((item, index) => (
                            <NavigationMenu.Item key={index}>
                                <NavigationMenu.Link className={cn(navItemDefaultStyles, "text-white")} href={item.href} target={item.target}>
                                    {topbarItemNameIntl[item.nameIntlId]}
                                </NavigationMenu.Link>
                            </NavigationMenu.Item>
                        ))}
                        <NavigationMenu.Item>
                            <NavigationMenu.Link className={cn("text-yellow-500 flex items-center")} href="lightning:lnurl1dp68gurn8ghj7um9dej8xct5wvhxcmmv9uh8wetvdskkkmn0wahz7mrww4excup0v3sk6atnjmrn5a" target="_blank">
                                <Zap className="h-4"/>
                                { intl.formatMessage({ id: "topbar.zap_us", defaultMessage: "Zap Us" }) }
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </>)}
                </NavigationMenu.List>
                <Link href={DAMUS_APP_STORE_URL} target="_blank">
                    <Button variant="accent">
                        { intl.formatMessage({ id: "topbar.download", defaultMessage: "Download" }) }
                    </Button>
                </Link>
            </NavigationMenu.Root>
        </motion.div>
    )
}
