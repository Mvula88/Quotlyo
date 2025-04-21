"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const emailSettingsFormSchema = z.object({
  fromEmail: z.string().email({ message: "Please enter a valid email address" }),
  fromName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  replyTo: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
})

type EmailSettingsFormValues = z.infer<typeof emailSettingsFormSchema>

export function EmailSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const [initialValues, setInitialValues] = useState<EmailSettingsFormValues | null>(null)

  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsFormSchema),
    defaultValues: initialValues || {
      fromEmail: "notifications@quotlyo.com",
      fromName: "Quotlyo",
      replyTo: "support@quotlyo.com",
    },
    mode: "onChange",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const { data: settings, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "email_settings")
          .single()

        if (error) {
          throw error
        }

        const emailSettings = settings?.value as EmailSettingsFormValues

        setInitialValues({
          fromEmail: emailSettings?.fromEmail || "notifications@quotlyo.com",
          fromName: emailSettings?.fromName || "Quotlyo",
          replyTo: emailSettings?.replyTo || "support@quotlyo.com",
        })

        form.reset({
          fromEmail: emailSettings?.fromEmail || "notifications@quotlyo.com",
          fromName: emailSettings?.fromName || "Quotlyo",
          replyTo: emailSettings?.replyTo || "support@quotlyo.com",
        })
      } catch (error: any) {
        console.error("Error fetching email settings:", error)
        toast({
          title: "Failed to fetch email settings",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [supabase, form])

  async function onSubmit(values: EmailSettingsFormValues) {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("settings").upsert({
        key: "email_settings",
        value: values,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Email settings saved",
        description: "Your email settings have been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to save email settings",
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
          name="fromEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Email</FormLabel>
              <FormControl>
                <Input placeholder="notifications@quotlyo.com" {...field} type="email" disabled={isLoading} />
              </FormControl>
              <FormDescription>The email address that will appear as the sender.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fromName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Name</FormLabel>
              <FormControl>
                <Input placeholder="Quotlyo" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="replyTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reply-To Email (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="support@quotlyo.com" {...field} type="email" disabled={isLoading} />
              </FormControl>
              <FormDescription>
                If clients reply to automated emails, their response will go to this address.
              </FormDescription>
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
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  )
}
