"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SignOutButton({ variant = "default", size = "default" }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)

    try {
      // Clear auth cookie
      document.cookie = "quotlyo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      })

      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </>
      )}
    </Button>
  )
}
