import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-blue-600 hover:underline dark:text-blue-400">
          Sign up
        </Link>
      </p>
    </div>
  )
}
