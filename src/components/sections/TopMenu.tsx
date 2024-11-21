import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Menu, X, Zap } from "lucide-react"
import { Button } from "../ui/Button";
import { DAMUS_APP_STORE_URL, DAMUS_MERCH_STORE_URL } from "@/lib/constants";
import { useIntl } from "react-intl";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

let regularNavItems: { nameIntlId: string, href: string, target?: string }[] = [
    { nameIntlId: "topbar.purple", href: "/purple" },
    { nameIntlId: "topbar.notedeck", href: "/notedeck" },
    { nameIntlId: "topbar.store", href: DAMUS_MERCH_STORE_URL, target: "_blank" },
    { nameIntlId: "topbar.events", href: "/#events" },
    { nameIntlId: "topbar.team", href: "/#team" },
    { nameIntlId: "topbar.contribute", href: "/#contribute" },
]

const ENABLE_FULL_MENU = true

export interface TopMenuProps {
    className?: string
    customCTA?: React.ReactNode
    hideLogoOnTop?: boolean
}

export function TopMenu({ className, customCTA, hideLogoOnTop: hideLogoOnTop = false }: TopMenuProps) {
    let navItemDefaultStyles = "hover:opacity-80 transition-opacity duration-200 ease-in-out"
    const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
    const ref = React.useRef(null)
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "end start"]
    })
    const logoOpacity = useTransform(scrollYProgress, [0.1, 0.5], [hideLogoOnTop ? 0.0 : 1.0, 1.0]);
    const menuBgColor = useTransform(scrollYProgress, [0.1, 0.5], ["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]);
    const intl = useIntl()

    // This is needed to allow intl commands to extract the strings
    const topbarItemNameIntl: Record<string, string> = {
        "topbar.purple": intl.formatMessage({ id: "topbar.purple", defaultMessage: "Purple" }),
        "topbar.notedeck": intl.formatMessage({ id: "topbar.notedeck", defaultMessage: "Notedeck" }),
        "topbar.store": intl.formatMessage({ id: "topbar.store", defaultMessage: "Store" }),
        "topbar.events": intl.formatMessage({ id: "topbar.events", defaultMessage: "Events" }),
        "topbar.team": intl.formatMessage({ id: "topbar.team", defaultMessage: "Our Team" }),
        "topbar.contribute": intl.formatMessage({ id: "topbar.contribute", defaultMessage: "Contribute" }),
    }

    return (<>
        <div ref={ref} className="absolute top-0 h-screen bg-transparent pointer-events-none w-4 left-0" />
        <motion.div
            style={{
              opacity: 0,
              backgroundColor: showMobileMenu ? "rgba(0,0,0,0.5)" : menuBgColor,
              borderColor: showMobileMenu ? "rgba(0,0,0,0.5)" : menuBgColor,
            }}
            animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
            className="w-full border-b z-50 backdrop-blur-sm fixed"
        >
            <NavigationMenu.Root className={cn("flex flex-col items-center z-50", className)}>
              <div className="container justify-between items-center flex p-6">
                <motion.div
                 style={{ opacity: logoOpacity }}
                >
                    <NavigationMenu.Link className={cn(navItemDefaultStyles, "text-white")} href="/">
                        <img src="/logo_icon_2.png" className="h-12" alt={ intl.formatMessage({ id: "topbar.logo_alt_text", defaultMessage: "Damus logo" }) }/>
                    </NavigationMenu.Link>
                </motion.div>
                <div className="hidden lg:block">
                  <NavigationMenu.List className={cn("inline-flex space-x-6 items-center justify-self-center")}>
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
                </div>
                <div className="hidden lg:block">
                  {customCTA ? customCTA : <>
                    <Link href={DAMUS_APP_STORE_URL} target="_blank" className="hidden lg:block">
                      <Button variant="accent">
                        {intl.formatMessage({ id: "topbar.download", defaultMessage: "Download" })}
                      </Button>
                    </Link>
                  </>}
                </div>
                <button className="lg:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  {showMobileMenu ? <X className="h-8 text-white"/> : <Menu className="h-8 text-white"/>}
                </button>
              </div>
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div className="lg:hidden container flex justify-end mb-6" key="mobile-menu">
                    <NavigationMenu.List className={cn("flex flex-col gap-6 justify-start items-end text-3xl font-bold p-6")}>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </NavigationMenu.Root>
        </motion.div>
    </>)
}
