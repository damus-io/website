import { ArrowUpRight, ChevronRight, Globe2 } from "lucide-react";
import { MeshGradient1 } from "../effects/MeshGradient.1";
import { TopMenu } from "./TopMenu";
import { Button } from "../ui/Button";
import Image from "next/image"
import { FormattedMessage, useIntl } from "react-intl";

export function Hero() {
    const intl = useIntl()

    return (
        <div className="bg-black overflow-hidden relative min-h-screen">
            <div className="absolute z-10">
                <MeshGradient1 className="-translate-x-1/3"/>
            </div>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <TopMenu className="w-full"/>
                <div className="flex flex-col lg:flex-row items-center justify-center mt-32 lg:mt-16">
                    <div className="w-full z-20">
                        <div className="inline-flex items-center text-sm md:text-normal rounded-full bg-white/20 p-1 px-4 md:p-2 md:px-6 text-white border border-white/30">
                            <FormattedMessage defaultMessage="Promote bounties page" id="home.hero.promote-bounties"/>
                            <ChevronRight className="ml-2"/>
                        </div>
                        <h1 className="my-6 text-4xl sm:text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-white from-40% to-100% to-[#2D175B] pb-6 font-semibold whitespace-pre-line max-w-2xl">
                            <FormattedMessage defaultMessage="The social network you control" id="home.hero.headline"/>
                        </h1>
                        <h2 className="text-white/80 text-normal md:text-xl whitespace-pre-line">
                            { intl.formatMessage({ id: "home.hero.subheadline", defaultMessage: "Your very own social network for your friends or business.\n Available Now on iOS, iPad and MacOS (M1/M2)" }) }
                        </h2>
                        <div className="mt-10 md:mt-6 flex flex-col md:flex-row items-center md:items-center gap-y-4 gap-x-6">
                            <Button variant="default" className="w-full md:w-auto">
                                Download now
                                <ArrowUpRight className="ml-2" />
                            </Button>
                            <Button variant="link" className="w-full md:w-auto">
                                Join TestFlight Beta
                                <ArrowUpRight className="text-damuspink-600 ml-2"/>
                            </Button>
                        </div>
                        <div className="text-white/80 text-sm flex flex-col md:flex-row justify-center md:justify-start items-center mt-8 gap-x-2 gap-y-4">
                            <div className="flex items-center flex-wrap">
                                <Globe2 className="text-green-500 h-4"/>
                                <div>Available in</div>
                            </div>
                            <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-4">
                                <div className="text-white">English</div>
                                <div className="text-white">Español</div>
                                <div className="text-white">Italiano</div>
                                <div className="text-white">Português</div>
                                <div className="text-white">Deutsch</div>
                                <div className="text-white">日本語</div>
                                <div className="text-white">中文</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full lg:w-3/4 h-[800px]">
                        <Image 
                            src="/Hero.webp"
                            className="object-contain"
                            sizes="(max-width: 800px) 100vw, 800px"
                            fill
                            alt={"Damus social network running on an iPhone"}
                        />
                        <div className="absolute z-0">
                            {/* Put a big circle with gradient in the very middle of the section */}
                            <div className="hidden lg:block w-[800px] h-[800px] rounded-full bg-black lg:-translate-x-3/4 shadow-[0px_15px_30px_-15px_#5B1442] lg:shadow-[15px_0px_30px_-15px_#5B1442]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}