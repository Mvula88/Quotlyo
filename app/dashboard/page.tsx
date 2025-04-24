import React, { Suspense } from "react"

const RevenueChart = React.lazy(() => import("@/components/RevenueChart"))

function DashboardPage() {
  return (
    <div>
      {/* Other components */}
      <Suspense fallback={<div>Loading chart...</div>}>
        <RevenueChart />
      </Suspense>
    </div>
  )
}

export default DashboardPage
