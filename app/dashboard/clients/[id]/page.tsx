import { ClientForm } from "@/components/clients/client-form"

export default function EditClientPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Client</h1>
      <ClientForm clientId={params.id} />
    </div>
  )
}
