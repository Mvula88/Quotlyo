"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AffiliateSignupSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/quotlyo_full_logo.png" alt="Quotlyo Logo" width={180} height={50} className="h-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>Thank you for applying to the Quotlyo Affiliate Program</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              We've received your application and our team will review it shortly. You'll receive an email notification
              once your application has been approved.
            </p>
            <div className="rounded-lg bg-muted p-4 text-left">
              <h3 className="text-sm font-medium">What happens next?</h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Our team reviews your application (typically within 2-3 business days)</li>
                <li>You'll receive an email with the approval decision</li>
                <li>If approved, you'll get access to your affiliate dashboard</li>
                <li>Start promoting Quotlyo and earning commissions!</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Link href="/" className="w-full">
              <Button className="w-full">Return to Homepage</Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              Have questions?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact our team
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/quotlyo_favicon.png" alt="Quotlyo Logo" width={24} height={24} />
              <span className="text-sm font-medium">© 2023 Quotlyo. All rights reserved.</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
