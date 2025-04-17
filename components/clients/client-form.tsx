"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"

type Client = Database["public"]["Tables"]["clients"]["Row"]
type ClientInput = Database["public"]["Tables"]["clients"]["Insert"]

interface ClientFormProps {
  clientId?: string
}

export function ClientForm({ clientId }: ClientFormProps) {
  const [client, setClient] = useState<ClientInput>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (clientId) {
      setIsEdit(true)
      const fetchClient = async () => {
        try {
          const { data, error } = await supabase.from("clients").select("*").eq("id", clientId).single()

          if (error) {
            throw error
          }

          if (data) {
            setClient(data)
          }
        } catch (error: any) {
          toast({
            title: "Error fetching client",
            description: error.message,
            variant: "destructive",
          })
        }
      }

      fetchClient()
    }
  }, [clientId, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        const { error } = await supabase.from("clients").update(client).eq("id", clientId)

        if (error) {
          throw error
        }

        toast({
          title: "Client updated",
          description: "The client has been updated successfully.",
        })
      } else {
        const { error } = await supabase.from("clients").insert(client)

        if (error) {
          throw error
        }

        toast({
          title: "Client created",
          description: "The client has been created successfully.",
        })
      }

      router.push("/dashboard/clients")
    } catch (error: any) {
      toast({
        title: `Error ${isEdit ? "updating" : "creating"} client`,
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Client" : "Add New Client"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" value={client.name || ""} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" value={client.company || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={client.email || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={client.phone || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" value={client.address || ""} onChange={handleChange} rows={3} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clients")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Client" : "Create Client"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
