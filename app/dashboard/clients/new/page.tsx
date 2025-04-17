import { ClientForm } from "@/components/clients/client-form"

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Add New Client</h1>
      <ClientForm />
    </div>
  )
}
