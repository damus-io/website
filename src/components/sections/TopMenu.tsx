import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Zap } from "lucide-react"
import { Button } from "../ui/Button";
import { DAMUS_APP_STORE_URL } from "@/lib/constants";

let regularNavItems: { name: string, href: string }[] = [
    { name: "Media", href: "#media" },
    { name: "Team", href: "#team" },
    { name: "Gallery", href: "#gallery" },
    { name: "History", href: "#history" },
    { name: "Store", href: "#store" },
]

const ENABLE_FULL_MENU = false

export function TopMenu({ className }: { className?: string }) {
    let navItemDefaultStyles = "hover:opacity-80 transition-opacity duration-200 ease-in-out"

    return (
        <NavigationMenu.Root className={cn("flex justify-between items-center", className)}>
            <div>
                <NavigationMenu.Link className={cn(navItemDefaultStyles, "text-white")} href="/">
                    <img src="/logo.png" className="h-12"/>
                </NavigationMenu.Link>
            </div>
            <NavigationMenu.List className={cn("hidden lg:inline-flex space-x-6 items-center justify-self-center")}>
                {ENABLE_FULL_MENU && (<>
                    {regularNavItems.map((item, index) => (
                        <NavigationMenu.Item key={index}>
                            <Link href={item.href} legacyBehavior passHref>
                                <NavigationMenu.Link className={cn(navItemDefaultStyles, "text-white")}>
                                    {item.name}
                                </NavigationMenu.Link>
                            </Link>
                        </NavigationMenu.Item>
                    ))}
                    <NavigationMenu.Item>
                        <Link href="#zap-us" legacyBehavior passHref>
                            <NavigationMenu.Link className={cn("text-yellow-500 flex items-center")}>
                                <Zap className="h-4"/>
                                Zap Us
                            </NavigationMenu.Link>
                        </Link>
                    </NavigationMenu.Item>
                </>)}
            </NavigationMenu.List>
            <Link href={DAMUS_APP_STORE_URL} target="_blank">
                <Button variant="accent">
                    Download
                </Button>
            </Link>
        </NavigationMenu.Root>
    )
}
