import { SubscriptionStatus } from "@/components/subscription-status"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-200 p-4">
        {/* Sidebar content */}
        Sidebar
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header content */}
            Header
          </div>
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">
          <SubscriptionStatus />
          <div>Dashboard Content</div>
        </main>
      </div>
    </div>
  )
}
