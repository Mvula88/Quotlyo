import type { Metadata } from "next"
import LoginForm from "./LoginForm"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Login | Quotlyo",
  description: "Login to your Quotlyo account",
}

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-premium-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            <Image src="/quotlyo_full_logo.png" alt="Quotlyo Logo" width={200} height={50} className="h-auto" />
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Quotlyo has transformed how we manage our invoices and client relationships. The automation features
              alone saved us 15 hours per week!"
            </p>
            <footer className="text-sm">Sarah Johnson - CFO, TechVision Inc.</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your email and password to sign in to your account</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
