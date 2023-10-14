import { ArrowUpRight, ChevronRight, Globe2 } from "lucide-react";
import { MeshGradient1 } from "../effects/MeshGradient.1";
import { TopMenu } from "./TopMenu";
import { Button } from "../ui/Button";
import Image from "next/image"

export function Hero() {
    return (
        <section className="bg-black overflow-hidden relative min-h-screen">
            <div className="absolute">
                <MeshGradient1 className="-translate-x-1/3"/>
            </div>
            <div className="container mx-auto px-6 pb-32 pt-12">
                <TopMenu className="w-full"/>
                <div className="flex flex-col lg:flex-row items-center justify-center mt-32 lg:mt-16">
                    <div className="">
                        <div className="inline-flex items-center rounded-full bg-white/20 p-2 px-6 text-white border border-white/30">
                            Promote bounties page
                            <ChevronRight className="ml-2"/>
                        </div>
                        <h1 className="my-6 text-7xl text-transparent bg-clip-text bg-gradient-to-r from-white from-40% to-100% to-[#2D175B] pb-6 font-semibold">
                            The social network <br/>you control
                        </h1>
                        <h2 className="text-white/80 text-xl">
                            Your very own social network for your friends or business. <br/>Available Now on iOS, iPad and MacOS (M1/M2)
                        </h2>
                        <div className="mt-6 flex items-center space-x-6">
                            <Button variant="default">
                                Download now 
                                <ArrowUpRight className="ml-2" />
                            </Button>
                            <Button variant="link">
                                Join TestFlight Beta
                                <ArrowUpRight className="text-damuspink-600 ml-2"/>
                            </Button>
                        </div>
                        <div className="text-white/80 text-sm flex items-center mt-8 space-x-2">
                            <Globe2 className="text-green-500 h-4"/>
                            <div>Available in</div>
                            <div className="text-white">English</div>
                            <div className="text-white">Español</div>
                            <div className="text-white">Italiano</div>
                            <div className="text-white">Português</div>
                            <div className="text-white">Deutsch</div>
                            <div className="text-white">日本語</div>
                            <div className="text-white">中文</div>
                        </div>
                    </div>
                    <div className="relative w-1/2 h-[600px]">
                        <Image 
                            src="/Hero.webp"
                            className="object-contain"
                            sizes="(max-width: 800px) 100vw, 800px"
                            fill
                            alt={"Damus social network running on an iPhone"}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}