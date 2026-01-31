import type { SVGProps } from "react"
import Image from "next/image"

// SVG Logo component for inline use with color control
export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 133 133" {...props}>
    <path d="M54.75 17.8947C54.75 38.1912 38.2965 54.6447 18 54.6447V79.1447H54.75V115.895H79.25C79.25 95.5981 95.7034 79.1447 116 79.1447V54.6447H79.25V17.8947H54.75Z" />
  </svg>
)

// Image Logo component for use with PNG/SVG files
export const LogoImage = ({ 
  className, 
  size = 32,
  variant = "svg" 
}: { 
  className?: string
  size?: number
  variant?: "svg" | "png"
}) => (
  <Image
    src={variant === "svg" ? "/logo.svg" : "/logo.png"}
    alt="TrackMySubscriptions Logo"
    width={size}
    height={size}
    className={className}
    priority
  />
)
