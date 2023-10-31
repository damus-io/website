import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MeshGradient1({ className }: { className?: string }) {
    return (
        <motion.div className={cn("blur-[181px]", className)} animate={{ x: ["-50%", "0%", "-50%"], transition: { duration: 12, repeat: Infinity } }}>
            <svg width="1251" height="389" viewBox="0 0 1251 389" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="625.5" cy="194.5" rx="625.5" ry="194.5" transform="rotate(25.378 625.5 194.5)" fill="url(#paint0_linear)" />
                <defs>
                    <linearGradient id="paint0_linear" x1="625.5" y1="0" x2="625.5" y2="389" gradientUnits="userSpaceOnUse">
                        <motion.stop stopColor="#0DE8FF" stopOpacity="0.32" animate={{ stopColor: ["#0DE8FF", "#D600FC", "#0DE8FF"], transition: { duration: 6, repeat: Infinity } }} />
                        <motion.stop offset="1" stopColor="#D600FC" stopOpacity="0.32" animate={{ stopColor: ["#D600FC", "#0DE8FF", "#D600FC"], transition: { duration: 9, repeat: Infinity } }} />
                    </linearGradient>
                </defs>
            </svg>
        </motion.div>
    )
}