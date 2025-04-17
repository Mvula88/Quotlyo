"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Button variant="ghost" onClick={handleSignOut} className="gap-2">
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </Button>
  )
}
