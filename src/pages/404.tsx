import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Hero } from '@/components/sections/Hero'
import { MeshGradient1 } from '@/components/effects/MeshGradient.1'
import { TopMenu } from '@/components/sections/TopMenu'
import { FormattedMessage } from 'react-intl'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const inter = Inter({ subsets: ['latin'] })

export default function NotFound() {
    const intl = useIntl()
    return (
        <main>
            <div className="bg-black overflow-hidden relative min-h-screen">
                <div className="absolute pointer-events-none">
                    <MeshGradient1 className="-translate-x-1/3" />
                </div>
                <div className="container mx-auto px-6 pb-32 pt-12">
                    <TopMenu className="w-full" />
                    <div className="flex flex-col lg:flex-row items-center justify-center mt-32 lg:mt-16">
                        <div className="">
                            <h1 className="my-6 text-5xl md:text-7xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white from-40% to-100% to-[#2D175B] pb-6 font-semibold whitespace-pre-line max-w-2xl">
                                <FormattedMessage defaultMessage="Page not found" id="404.headline" />
                            </h1>
                            <div className="mt-6 flex justify-center items-center space-x-6">
                                <Link href="/">
                                    <Button variant="default">
                                        {intl.formatMessage({ id: "404.go_home", defaultMessage: "Go home" })}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
