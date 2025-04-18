"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { getGreeting } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const data = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Aug", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Sep", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Oct", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Nov", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Dec", uv: 1890, pv: 4800, amt: 2181 },
]

const DashboardPage = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUserName = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.error("Error fetching user:", error)
        return
      }

      if (data?.user?.user_metadata?.full_name) {
        setUserName(data.user.user_metadata.full_name as string)
      } else {
        setUserName("User") // Default name if full_name is not available
      }
    }

    setIsLoaded(true)
    fetchUserName()

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", checkMobile)
    }
  }, [])

  return (
    <div className="container relative pb-6">
      <div className="flex flex-col items-start justify-between gap-4 pb-6 pt-8 md:flex-row md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
            {userName}, {getGreeting()}
          </h2>
          <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <Link href="/products/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoaded ? <div className="text-2xl font-bold">$45,231.89</div> : <Skeleton className="h-8 w-[100px]" />}
            <p className="text-sm text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoaded ? <div className="text-2xl font-bold">2,350</div> : <Skeleton className="h-8 w-[100px]" />}
            <p className="text-sm text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoaded ? <div className="text-2xl font-bold">12,234</div> : <Skeleton className="h-8 w-[100px]" />}
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Time</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoaded ? (
              <div className="text-2xl font-bold">{currentTime.toLocaleTimeString()}</div>
            ) : (
              <Skeleton className="h-8 w-[100px]" />
            )}
            <p className="text-sm text-muted-foreground">Updated every minute</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Calendar className={cn(isMobile ? "md:hidden" : "")} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
