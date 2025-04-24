import { Suspense } from "react"
import dynamic from "next/dynamic"

const ReportsComponent = dynamic(() => import("@/components/ReportsComponent"), {
  suspense: true,
})

function ReportsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading reports...</div>}>
        <ReportsComponent />
      </Suspense>
    </div>
  )
}

export default ReportsPage
