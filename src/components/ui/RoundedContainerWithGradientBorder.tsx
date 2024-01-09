import { cn } from "@/lib/utils"

export function RoundedContainerWithGradientBorder({ className, allItemsClassName, innerContainerClassName, children }: { className?: string, allItemsClassName?: string, innerContainerClassName?: string, children: React.ReactNode }) {
    return (
        <div className={cn("relative w-24 h-24 flex justify-center items-center backdrop-blur-sm", allItemsClassName, className)}>
            <div className={cn("z-10 relative p-6 w-full h-full", innerContainerClassName)}>
                {children}
            </div>
            <div className={cn("absolute z-0 w-full h-full p-[1px] rounded-2xl bg-gradient-to-tr from-gray-800 via-gray-400 to-gray-800 opacity-40 shadow-lg", allItemsClassName)}>
                <div className={cn("w-full h-full flex justify-center items-center rounded-2xl bg-gray-900", allItemsClassName)}/>
            </div>
        </div>
    )
}

export function RoundedContainerWithColorGradientBorder({ className, allItemsClassName, children }: { className?: string, allItemsClassName?: string, children: React.ReactNode }) {
    return (
        <div className={cn("relative w-24 h-24 flex justify-center items-center backdrop-blur-sm", allItemsClassName, className)}>
            <div className="z-10 relative p-6 w-full h-full">
                {children}
            </div>
            <div className={cn("absolute z-0 w-full h-full p-[1px] rounded-2xl bg-gradient-to-br from-damuspink-500 via-damuspink-500/20 to-deeppurple-700 opacity-40 shadow-lg", allItemsClassName)}>
                <div className={cn("w-full h-full flex justify-center items-center rounded-2xl bg-gray-900", allItemsClassName)}/>
            </div>
        </div>
    )
}
