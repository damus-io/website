import { cn } from "@/lib/utils"

export function RoundedContainerWithGradientBorder({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn("relative w-24 h-24 flex justify-center items-center backdrop-blur-sm", className)}>
            <div className="z-10 relative p-6 w-full h-full">
                {children}
            </div>
            <div className="absolute z-0 w-full h-full p-[1px] rounded-2xl bg-gradient-to-tr from-gray-800 via-gray-400 to-gray-800 opacity-40 shadow-lg">
                <div className="w-full h-full flex justify-center items-center rounded-2xl bg-gray-900"/>
            </div>
        </div>
    )
}