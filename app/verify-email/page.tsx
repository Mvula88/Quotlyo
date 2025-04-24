"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import Loading from "./loading"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const verifyEmail = async () => {
      const token_hash = searchParams.get("token_hash")
      const type = searchParams.get("type")

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (error) {
          toast({
            title: "Email verification failed",
            description: error.message || "There was a problem verifying your email address",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Email verified",
            description: "Your email address has been successfully verified. You can now log in.",
          })
        }
        router.push("/login")
      }
    }

    verifyEmail()
  }, [router, searchParams, supabase])

  return <Loading />
}
