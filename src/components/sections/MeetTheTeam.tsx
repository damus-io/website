import { MeshGradient2 } from "../effects/MeshGradient.2";
import { Button } from "../ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { RoundedContainerWithGradientBorder } from "../ui/SpecialSquareIcon";
import { cn } from "@/lib/utils";
import Image from "next/image";

const team = [
    {
        profilePicture: "/team-photos/will-casarin.webp",
        roleIntlString: "roles.founder-and-developer",
        fullName: "William Casarin",
        shortName: "Will",
        nostrNpub: "npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s",
    },
    {
        profilePicture: "/team-photos/vanessa-gray.png",
        roleIntlString: "roles.marketer",
        fullName: "Vanessa Gray",
        shortName: "@vrod",
        nostrNpub: "npub1h50pnxqw9jg7dhr906fvy4mze2yzawf895jhnc3p7qmljdugm6gsrurqev",
    },
    {
        profilePicture: "/team-photos/elsat.png",
        roleIntlString: "roles.product-janitor",
        fullName: "elsat",
        shortName: "elsat",
        nostrNpub: "npub1zafcms4xya5ap9zr7xxr0jlrtrattwlesytn2s42030lzu0dwlzqpd26k5",
    },
    {
        profilePicture: "/team-photos/roberto-agreda.png",
        roleIntlString: "roles.designer",
        fullName: "Roberto",
        shortName: "Rob",
        nostrNpub: "npub1uapy44zhu5f0markfftt7m2z3gr2zwssq6h3lw8qlce0d5pjvhrs3q9pmv",
    },
    {
        profilePicture: "/team-photos/daniel-daquino.png",
        roleIntlString: "roles.developer",
        fullName: "Daniel D’Aquino",
        shortName: "Daniel",
        nostrNpub: "npub13v47pg9dxjq96an8jfev9znhm0k7ntwtlh9y335paj9kyjsjpznqzzl3l8",
    },
    {
        profilePicture: "/team-photos/joel-klabo.png",
        roleIntlString: "roles.developer",
        fullName: "Joel Klabo",
        shortName: "Joel",
        nostrNpub: "npub19a86gzxctwtz68l8zld2u9y2fjvyyj4juyx8m5geylssrmfj27eqs22ckt"
    },
    {
        profilePicture: "/team-photos/suhail-saqan.png",
        roleIntlString: "roles.developer",
        fullName: "Suhail Saqan",
        shortName: "Suhail",
        nostrNpub: "npub1k92qsr95jcumkpu6dffurkvwwycwa2euvx4fthv78ru7gqqz0nrs2ngfwd"
    },
    {
        profilePicture: "/team-photos/terry-yiu.png",
        roleIntlString: "roles.developer",
        fullName: "Terry Yiu",
        shortName: "Terry",
        nostrNpub: "npub1yaul8k059377u9lsu67de7y637w4jtgeuwcmh5n7788l6xnlnrgs3tvjmf"
    },
    {
        profilePicture: "/team-photos/eric-holguin.png",
        roleIntlString: "roles.developer",
        fullName: "Eric Holguin",
        shortName: "Eric",
        nostrNpub: "npub12gyrpse550melzx2ey69srfxlyd8svkxkg0mjcjkjr4zakqm2cnqwa3jj5"
    },
    {
        profilePicture: "/team-photos/bryan-montz.png",
        roleIntlString: "roles.developer",
        fullName: "Bryan Montz",
        shortName: "Bryan",
        nostrNpub: "npub1qlk0nqupxmlyxravg0aqscxmcc4q4tq898z6x003rykwwh3npj0syvyayc",
    },
    {
        profilePicture: "/team-photos/ben-weeks.png",
        roleIntlString: "roles.developer",
        fullName: "Ben Weeks",
        shortName: "Ben",
        nostrNpub: "npub1jutptdc2m8kgjmudtws095qk2tcale0eemvp4j2xnjnl4nh6669slrf04x",
    },
    {
        profilePicture: "/team-photos/fishcake.png",
        roleIntlString: "roles.developer",
        fullName: "Fishcake",
        shortName: "",
        nostrNpub: "npub137c5pd8gmhhe0njtsgwjgunc5xjr2vmzvglkgqs5sjeh972gqqxqjak37w",
    },
    {
        profilePicture: "/team-photos/cr0bar.png",
        roleIntlString: "roles.developer",
        fullName: "cr0bar",
        shortName: "cr0bar",
        nostrNpub: "npub1794vv7hl7y6q2qw0y7m7h60rpphmvt5h7pzt5sr78z6assj6w0eqagwjhd",
    },
    {
        profilePicture: "/team-photos/thesamecat.png",
        roleIntlString: "roles.developer",
        fullName: "TheSameCat",
        shortName: "",
        nostrNpub: "npub1wtuh24gpuxjyvnmjwlvxzg8k0elhasagfmmgz0x8vp4ltcy8ples54e7js",
    },
    {
        profilePicture: "/team-photos/jeroen.png",
        roleIntlString: "roles.first-business-intern",
        fullName: "Jeroen",
        shortName: "Jeroen",
        nostrNpub: "npub17plqkxhsv66g8quxxc9p5t9mxazzn20m426exqnl8lxnh5a4cdns7jezx0"
    }
]

export function MeetTheTeam({ className }: { className?: string }) {
    const intl = useIntl()

    // This type of structure is necessary in this case to make strings get picked up by `npm run i18n`
    const roleIntlStrings: Record<string, string> = {
        "roles.founder-and-developer": intl.formatMessage({ id: "roles.founder-and-developer", defaultMessage: "Founder & Developer" }),
        "roles.marketer": intl.formatMessage({ id: "roles.marketer", defaultMessage: "Marketer" }),
        "roles.product-janitor": intl.formatMessage({ id: "roles.product-janitor", defaultMessage: "Product Janitor" }),
        "roles.designer": intl.formatMessage({ id: "roles.designer", defaultMessage: "Designer" }),
        "roles.developer": intl.formatMessage({ id: "roles.developer", defaultMessage: "Developer" }),
        "roles.first-business-intern": intl.formatMessage({ id: "roles.first-business-intern", defaultMessage: "First Business Intern" }),
    }

    return (<>
        <div className={cn("bg-black overflow-hidden relative min-h-screen", className)}>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <div className="flex flex-col items-center justify-center mt-32 lg:mt-16">
                    <div className="relative mb-32">
                        <motion.h2 className="text-6xl md:text-7xl lg:text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-30% to-green-500 to-100% font-semibold">
                            { intl.formatMessage({ id: "meet_the_team.headline", defaultMessage: "Meet the Damus team" }) }
                        </motion.h2>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-8 md:gap-y-16 items-stretch justify-center">
                        {team.map((item, index) => (
                            <div key={index} className="max-w-xs flex flex-col items-center justify-center h-full">
                                <RoundedContainerWithGradientBorder className="w-48 h-full">
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                                            <Image
                                                src={item.profilePicture}
                                                className="object-contain"
                                                fill
                                                sizes="300px"
                                                alt=""
                                            />
                                        </div>
                                        <h3 className="text-white/70 text-center text-xs font-normal mt-4">
                                            { roleIntlStrings[item.roleIntlString] }
                                        </h3>
                                        <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white from-30% to-cyan-200 to-100% text-center text-normal mt-1">
                                            {item.fullName}
                                        </p>
                                        <Link href={"https://damus.io/" + item.nostrNpub} target="_blank" className="mt-4">
                                            <Button variant="secondary" className="flex items-center">
                                                <img src="/nostrich.png" className="h-4 mr-2"/>
                                                <span className="text-xs">{ intl.formatMessage({ id: "meet_the_team.view_profile", defaultMessage: "Follow {shortName}"} , { shortName: item.shortName }) }</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </RoundedContainerWithGradientBorder>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>)
}