"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export type StampColor = "red" | "blue" | "black" | "green"
export type StampShape = "circle" | "square" | "rectangle" | "oval"

interface StampProps {
  text?: string
  date?: string
  shape?: StampShape
  color?: StampColor
  showDate?: boolean
  size?: "small" | "medium" | "large"
  className?: string
  rotation?: number
  borderWidth?: number
  dateFormat?: string
  businessName?: string
  businessDetails?: string[]
  customText?: string
}

export function Stamp({
  text,
  date = new Date().toLocaleDateString(),
  shape = "circle",
  color = "red",
  showDate = true,
  size = "medium",
  className,
  rotation = 0,
  borderWidth = 2,
  dateFormat,
  businessName,
  businessDetails,
  customText,
}: StampProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const colorClasses = {
    red: "border-red-500 text-red-500",
    blue: "border-blue-500 text-blue-500",
    black: "border-gray-800 text-gray-800",
    green: "border-green-500 text-green-500",
  }

  const sizeClasses = {
    small: {
      container: "w-20 h-20",
      text: "text-xs",
      date: "text-[8px]",
    },
    medium: {
      container: "w-32 h-32",
      text: "text-sm",
      date: "text-xs",
    },
    large: {
      container: "w-40 h-40",
      text: "text-base",
      date: "text-sm",
    },
  }

  const shapeClasses = {
    circle: "rounded-full aspect-square",
    square: "aspect-square",
    rectangle: "aspect-[1.5/1]",
    oval: "rounded-full aspect-[1.5/1]",
  }

  const formattedDate = showDate
    ? dateFormat === "MM/DD/YYYY"
      ? new Date(date).toLocaleDateString("en-US")
      : dateFormat === "YYYY-MM-DD"
        ? new Date(date).toISOString().slice(0, 10)
        : new Date(date).toLocaleDateString()
    : ""

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-[3px] border-dashed p-2",
        colorClasses[color],
        shapeClasses[shape],
        sizeClasses[size].container,
        className,
      )}
      style={{ transform: `rotate(${rotation}deg)`, borderWidth: `${borderWidth}px` }}
    >
      {businessName && <div className={cn("font-bold text-center", sizeClasses[size].text)}>{businessName}</div>}
      {businessDetails &&
        businessDetails.map((detail, index) => (
          <div key={index} className={cn("text-center", sizeClasses[size].text)}>
            {detail}
          </div>
        ))}
      {customText && <div className={cn("font-bold text-center", sizeClasses[size].text)}>{customText}</div>}
      {showDate && <div className={cn("text-center", sizeClasses[size].date)}>{formattedDate}</div>}
    </div>
  )
}

export const StampComponent = Stamp
