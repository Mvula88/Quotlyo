"use client"

import { Chart } from "@/components/ui/chart"

export function AffiliateCommissionChart() {
  // Sample data for the chart
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Commission Paid",
        data: [850, 960, 1250, 1750, 1450, 2100, 1800, 2300, 1950, 2800, 3100, 2650],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: "Pending Commission",
        data: [150, 200, 350, 450, 300, 400, 550, 650, 500, 750, 850, 700],
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        borderColor: "rgba(249, 115, 22, 1)",
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="h-[300px] w-full">
      <Chart
        type="line"
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `$${value}`,
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: {
                boxWidth: 15,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                      context.parsed.y,
                    )
                  }
                  return label
                },
              },
            },
          },
        }}
      />
    </div>
  )
}
