"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const MotionCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "premium" | "gold"
    animate?: boolean
    delay?: number
  }
>(({ className, variant = "default", animate = true, delay = 0, ...props }, ref) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
    hover: {
      y: -5,
      boxShadow:
        variant === "premium"
          ? "0 20px 40px -5px rgba(2, 119, 199, 0.3)"
          : variant === "gold"
            ? "0 20px 40px -5px rgba(234, 179, 8, 0.3)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        variant === "premium" && "premium-card",
        variant === "gold" && "border-gold-200 bg-gold-50/50 shadow-gold",
        className,
      )}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      whileHover="hover"
      variants={variants}
      {...props}
    />
  )
})
MotionCard.displayName = "MotionCard"

const MotionCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
MotionCardHeader.displayName = "MotionCardHeader"

const MotionCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <motion.h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      {...props}
    />
  ),
)
MotionCardTitle.displayName = "MotionCardTitle"

const MotionCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <motion.p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      {...props}
    />
  ),
)
MotionCardDescription.displayName = "MotionCardDescription"

const MotionCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      {...props}
    />
  ),
)
MotionCardContent.displayName = "MotionCardContent"

const MotionCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      {...props}
    />
  ),
)
MotionCardFooter.displayName = "MotionCardFooter"

export { MotionCard, MotionCardHeader, MotionCardFooter, MotionCardTitle, MotionCardDescription, MotionCardContent }
