import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // For debugging
  console.log("Middleware path:", req.nextUrl.pathname)
  console.log("Session exists:", !!session)

  // Check if the user is trying to access protected routes
  const isAccessingProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/affiliate-portal")

  // If accessing protected route without session, redirect to login
  if (isAccessingProtectedRoute && !session) {
    console.log("Redirecting to login from protected route")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If accessing auth pages with session, redirect to dashboard
  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/sign-up") && session) {
    console.log("Redirecting to dashboard from auth page")
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

// Update the matcher to be more specific and exclude API routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/affiliate-portal/:path*", "/login", "/sign-up"],
}
