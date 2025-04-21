"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const [initialValues, setInitialValues] = useState<ProfileFormValues | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues || {
      fullName: "",
      email: "",
      website: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const { data: user, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("full_name, website, email")
            .eq("id", user.id)
            .single()

          if (profileError) {
            throw profileError
          }

          setInitialValues({
            fullName: profile?.full_name || "",
            email: profile?.email || user.email || "",
            website: profile?.website || "",
          })

          form.reset({
            fullName: profile?.full_name || user.email || "",
            email: profile?.email || "",
            website: profile?.website || "",
          })
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Failed to fetch profile",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, form])

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true)

    try {
      const { data: user } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase
        .from("users")
        .update({
          full_name: values.fullName,
          website: values.website,
        })
        .eq("id", user.user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} type="email" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  )
}
