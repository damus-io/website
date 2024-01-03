import { RoundedContainerWithColorGradientBorder } from "../ui/RoundedContainerWithGradientBorder";
import Image from "next/image";

export const PurpleIcon = () => {
  return (
    <RoundedContainerWithColorGradientBorder className="w-24 h-24 p-[1px]">
      <Image src="logo-icon-dark.png" fill className="overflow-hidden w-full h-full object-fill shadow-xl rounded-2xl" alt="Damus Purple logo" />
    </RoundedContainerWithColorGradientBorder>
  )
};
