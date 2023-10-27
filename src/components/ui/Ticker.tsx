import { cn } from "@/lib/utils"
import { motion, useTime, useTransform } from "framer-motion"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { useRef } from "react"

export function Ticker({ className, timePeriod, reverseDirection, children }: { className?: string, timePeriod?: number, reverseDirection?: boolean, children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [childrenWidth, setChildrenWidth] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setChildrenWidth(ref.current?.offsetWidth);
        }
    }, [children]);

    return (
        <div className={cn(`w-full overflow-hidden`, className)}>
            <motion.div
                ref={ref}
                className={cn("flex flex-row gap-x-4 items-center justify-start overflow-visible")}
                animate={{ 
                    x: reverseDirection ? [-childrenWidth, 0] : [0, -childrenWidth],
                    transition: { duration: timePeriod ?? 12, repeat: Infinity, ease: "linear" },
                }}
            >
                <React.Fragment key="ticker-fragment-1">
                    {children}
                </React.Fragment>
                {/* Duplicate for an infinite looping effect */}
                <React.Fragment key="ticker-fragment-2">
                    {children}
                </React.Fragment>
            </motion.div>
        </div>
    );
}

export function TickerImage({ src, className, altText }: { src: string, className?: string, altText: string }) {
    return (<>
        <div className={cn("relative w-48 h-48 shrink-0 rounded-xl overflow-hidden", className)}>
            <Image
                src={src}
                className="object-cover"
                fill
                alt={altText}
            />
        </div>
    </>)
}