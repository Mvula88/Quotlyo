import { ClientList } from "@/components/clients/client-list"

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Clients</h1>
      <ClientList />
    </div>
  )
}
