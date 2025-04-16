"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Users, UserPlus, DollarSign, BarChart3, AlertTriangle, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link href="/admin/settings">
              <Button variant="outline">Settings</Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+2 new this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Paid</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,234</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.2%</div>
                  <p className="text-xs text-muted-foreground">+0.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-green-100 p-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">New affiliate approved</p>
                        <p className="text-sm text-muted-foreground">Emily Davis from Small Biz Help</p>
                      </div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-blue-100 p-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Commission payment sent</p>
                        <p className="text-sm text-muted-foreground">$875.00 to Jane Cooper</p>
                      </div>
                      <div className="text-sm text-muted-foreground">5 hours ago</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-yellow-100 p-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Pending affiliate application</p>
                        <p className="text-sm text-muted-foreground">Michael Brown from Tech Reviews</p>
                      </div>
                      <div className="text-sm text-muted-foreground">1 day ago</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-red-100 p-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">High commission alert</p>
                        <p className="text-sm text-muted-foreground">Alex Johnson earned $1,200 this month</p>
                      </div>
                      <div className="text-sm text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Affiliates</CardTitle>
                  <CardDescription>Based on commission earned this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium">Jane Cooper</p>
                        <p className="text-xs text-muted-foreground">Marketing Pro</p>
                      </div>
                      <div className="font-medium">$1,245</div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-xs font-medium text-blue-600">2</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium">Alex Johnson</p>
                        <p className="text-xs text-muted-foreground">Sales Guru</p>
                      </div>
                      <div className="font-medium">$985</div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-xs font-medium text-blue-600">3</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium">Sarah Williams</p>
                        <p className="text-xs text-muted-foreground">Finance Blogs</p>
                      </div>
                      <div className="font-medium">$745</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/affiliate-management">
                    <Button variant="outline" className="w-full">
                      View All Affiliates
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all users of the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Management</CardTitle>
                <CardDescription>View and manage all affiliate partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Affiliate Applications</h3>
                      <p className="text-sm text-muted-foreground">Recent applications requiring review</p>
                    </div>
                    <Link href="/admin/affiliate-management">
                      <Button>View All</Button>
                    </Link>
                  </div>
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Emily Davis</p>
                        <p className="text-sm text-muted-foreground">Small Biz Help</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                    <div className="border-t flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Robert Chen</p>
                        <p className="text-sm text-muted-foreground">Business Insights</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Management</CardTitle>
                <CardDescription>Track and manage affiliate commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Commission management content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
