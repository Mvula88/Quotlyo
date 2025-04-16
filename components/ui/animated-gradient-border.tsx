"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number
  gradientColors?: string[]
  animationDuration?: number
  children: React.ReactNode
  containerClassName?: string
  backgroundImage?: string
}

export function AnimatedGradientBorder({
  borderWidth = 2,
  gradientColors = ["#0277c7", "#0c456e", "#eab308", "#0277c7"],
  animationDuration = 8,
  children,
  className,
  containerClassName,
  backgroundImage,
  ...props
}: AnimatedGradientBorderProps) {
  return (
    <div
      className={cn("relative rounded-lg p-[2px] overflow-hidden", containerClassName)}
      style={{
        background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
        backgroundSize: "300% 100%",
        animation: `shimmer ${animationDuration}s linear infinite`,
      }}
      {...props}
    >
      <div
        className={cn("relative rounded-[calc(0.5rem-1px)] bg-background h-full w-full", className)}
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  )
}
