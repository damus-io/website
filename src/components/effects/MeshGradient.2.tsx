import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MeshGradient2({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" width="1279" height="699" viewBox="0 0 1279 699" fill="none"
        style={{
          transform: "rotate(-3.309deg)"
        }}
      >
        <g filter="url(#filter0_f_3380_30662)">
          <path d="M433.405 498.413L263.962 452.216L200.399 412.895L239.833 230.138L1024.58 200.77L1078.14 279.163L948.256 286.672L962.339 412.827L746.717 315.821L693.901 452.177L610.721 323.683L466.915 374.991L433.405 498.413Z" fill="url(#paint0_linear_3380_30662)" fillOpacity="0.5" />
        </g>
        <defs>
          <filter id="filter0_f_3380_30662" x="0.398651" y="0.769897" width="1277.74" height="697.643" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_3380_30662" />
          </filter>
          <linearGradient id="paint0_linear_3380_30662" x1="190" y1="233.019" x2="786.493" y2="786.28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FD1818" />
            <stop offset="1" stopColor="#440101" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}
