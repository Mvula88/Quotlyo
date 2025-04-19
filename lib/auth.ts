import { cookies } from "next/headers"
import { cache } from "react"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

const supabase = () =>
  createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value
      },
    },
  })

export const auth = cache(async () => {
  const {
    data: { session },
  } = await supabase().auth.getSession()
  return session
})
