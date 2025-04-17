"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setEmailNotConfirmed(false)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Check if the error is about email confirmation
        if (error.message.includes("Email not confirmed")) {
          setEmailNotConfirmed(true)
          throw new Error("Please verify your email before signing in. Check your inbox for a confirmation link.")
        }
        throw error
      }

      toast({
        title: "Success",
        description: "You have successfully signed in",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast({
        title: "Error signing in",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerificationEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend the verification email",
        variant: "destructive",
      })
      return
    }

    setIsResendingEmail(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      })
    } catch (error: any) {
      console.error("Error resending verification email:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  return (
    <div className="grid gap-6">
      {emailNotConfirmed && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertTitle>Email not verified</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              Please verify your email before signing in. Check your inbox for a confirmation link.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerificationEmail}
              disabled={isResendingEmail}
              className="mt-1"
            >
              {isResendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend verification email
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSignIn}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isResendingEmail}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isResendingEmail}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isResendingEmail}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={isLoading || isResendingEmail} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
