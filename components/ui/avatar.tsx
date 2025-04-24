import Image from "next/image"
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

export function AvatarImage({ src, alt, ...props }) {
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={50}
      height={50}
      priority // Set priority to true for important images
      {...props}
    />
  )
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  >
    {children}
  </AvatarPrimitive.Root>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
