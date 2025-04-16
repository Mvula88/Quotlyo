"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Plus,
  UserPlus,
  Settings,
  DollarSign,
  PieChart,
  Filter,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Affiliate, AffiliateStats } from "@/types/affiliate"
import { AffiliateStatCards } from "@/components/affiliate/affiliate-stat-cards"
import { AffiliateCommissionChart } from "@/components/affiliate/affiliate-commission-chart"

// Mock data
const affiliates: Affiliate[] = [
  {
    id: "aff-001",
    name: "Jane Cooper",
    email: "jane@marketingpro.com",
    company: "Marketing Pro",
    website: "marketingpro.com",
    commissionRate: 15,
    status: "active",
    dateJoined: "2023-01-15",
    totalReferrals: 48,
    totalCommission: 3750.5,
    paymentMethod: "paypal",
    paymentDetails: {
      paypal: "jane@marketingpro.com",
    },
    customTrackingCode: "MKTPRO15",
    marketingMaterials: [
      {
        id: "mat-001",
        type: "banner",
        name: "Homepage Banner",
        url: "https://quotlyo.com/banners/homepage-1.png",
        clickCount: 450,
        conversionCount: 28,
      },
    ],
    performanceStats: {
      clickThroughRate: 12.5,
      conversionRate: 6.2,
      avgCommissionPerReferral: 78.13,
    },
    lastPaymentDate: "2023-04-05",
    lastPaymentAmount: 875,
  },
  {
    id: "aff-002",
    name: "Alex Johnson",
    email: "alex@salesguru.net",
    company: "Sales Guru",
    website: "salesguru.net",
    commissionRate: 20,
    status: "active",
    dateJoined: "2023-02-21",
    totalReferrals: 35,
    totalCommission: 2850.75,
    paymentMethod: "bank_transfer",
    paymentDetails: {
      bankName: "Chase Bank",
      accountNumber: "****5678",
      routingNumber: "****9012",
    },
    customTrackingCode: "SALES20",
    marketingMaterials: [
      {
        id: "mat-002",
        type: "email_template",
        name: "Monthly Newsletter",
        url: "https://quotlyo.com/templates/email-1.html",
        clickCount: 320,
        conversionCount: 18,
      },
    ],
    performanceStats: {
      clickThroughRate: 10.2,
      conversionRate: 5.6,
      avgCommissionPerReferral: 81.45,
    },
    lastPaymentDate: "2023-04-01",
    lastPaymentAmount: 720,
  },
  {
    id: "aff-003",
    name: "Sarah Williams",
    email: "sarah@financeblogs.com",
    company: "Finance Blogs",
    website: "financeblogs.com",
    commissionRate: 18,
    status: "active",
    dateJoined: "2023-03-10",
    totalReferrals: 29,
    totalCommission: 2320.25,
    paymentMethod: "paypal",
    paymentDetails: {
      paypal: "sarah@financeblogs.com",
    },
    customTrackingCode: "FINBLG18",
    marketingMaterials: [
      {
        id: "mat-003",
        type: "social_media",
        name: "Instagram Post",
        url: "https://quotlyo.com/media/instagram-1.png",
        clickCount: 280,
        conversionCount: 15,
      },
    ],
    performanceStats: {
      clickThroughRate: 9.8,
      conversionRate: 5.3,
      avgCommissionPerReferral: 80.01,
    },
    lastPaymentDate: "2023-03-15",
    lastPaymentAmount: 650,
  },
  {
    id: "aff-004",
    name: "Michael Brown",
    email: "michael@techreviews.io",
    company: "Tech Reviews",
    website: "techreviews.io",
    commissionRate: 12,
    status: "inactive",
    dateJoined: "2023-01-05",
    totalReferrals: 15,
    totalCommission: 890.3,
    paymentMethod: "crypto",
    paymentDetails: {
      cryptoAddress: "0x1a2b3c4d5e6f...",
    },
    customTrackingCode: "TECHRV12",
    marketingMaterials: [
      {
        id: "mat-004",
        type: "banner",
        name: "Sidebar Banner",
        url: "https://quotlyo.com/banners/sidebar-1.png",
        clickCount: 190,
        conversionCount: 8,
      },
    ],
    performanceStats: {
      clickThroughRate: 7.5,
      conversionRate: 4.2,
      avgCommissionPerReferral: 59.35,
    },
    lastPaymentDate: "2023-02-10",
    lastPaymentAmount: 420,
  },
  {
    id: "aff-005",
    name: "Emily Davis",
    email: "emily@smallbizhelp.com",
    company: "Small Biz Help",
    website: "smallbizhelp.com",
    commissionRate: 15,
    status: "pending",
    dateJoined: "2023-04-12",
    totalReferrals: 0,
    totalCommission: 0,
    customTrackingCode: "SMBIZ15",
    marketingMaterials: [],
    performanceStats: {
      clickThroughRate: 0,
      conversionRate: 0,
      avgCommissionPerReferral: 0,
    },
  },
]

// Mock stats
const stats: AffiliateStats = {
  totalAffiliates: 5,
  activeAffiliates: 3,
  totalReferrals: 127,
  conversionRate: 5.8,
  totalCommissionPaid: 9811.8,
  pendingCommissions: 1420.5,
}

export default function AffiliateManagementPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const filteredAffiliates = affiliates.filter((affiliate) => {
    // Apply search filter
    const matchesSearch =
      searchTerm === "" ||
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.customTrackingCode?.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(affiliate.status)

    return matchesSearch && matchesStatus
  })

  const handleStatusFilter = (status: string) => {
    setStatusFilter((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status)
      } else {
        return [...prev, status]
      }
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Affiliate Management</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/affiliate-management/settings">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Program Settings
              </Button>
            </Link>
            <Link href="/dashboard/affiliate-management/new">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Affiliate
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <PieChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="affiliates">
              <UserPlus className="mr-2 h-4 w-4" />
              Affiliates
            </TabsTrigger>
            <TabsTrigger value="commissions">
              <DollarSign className="mr-2 h-4 w-4" />
              Commissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AffiliateStatCards stats={stats} />

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Trend</CardTitle>
                  <CardDescription>Monthly affiliate commission over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <AffiliateCommissionChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Affiliates</CardTitle>
                  <CardDescription>Affiliates with the highest conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {affiliates
                      .filter((a) => a.status === "active")
                      .sort((a, b) => b.performanceStats.conversionRate - a.performanceStats.conversionRate)
                      .slice(0, 5)
                      .map((affiliate, index) => (
                        <div key={affiliate.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium">{affiliate.name}</p>
                              <p className="text-xs text-muted-foreground">{affiliate.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{affiliate.performanceStats.conversionRate}%</p>
                            <p className="text-xs text-muted-foreground">Conversion Rate</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Partners</CardTitle>
                <CardDescription>Manage your affiliate partners and track their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      placeholder="Search affiliates..."
                      className="h-9 w-full md:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes("active")}
                          onCheckedChange={() => handleStatusFilter("active")}
                        >
                          Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes("pending")}
                          onCheckedChange={() => handleStatusFilter("pending")}
                        >
                          Pending
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes("inactive")}
                          onCheckedChange={() => handleStatusFilter("inactive")}
                        >
                          Inactive
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center space-x-1">
                            <span>Name</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-1">
                            <span>Commission Rate</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-1">
                            <span>Referrals</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-1">
                            <span>Total Commission</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAffiliates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No affiliates found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAffiliates.map((affiliate) => (
                          <TableRow key={affiliate.id}>
                            <TableCell className="font-medium">
                              <div>
                                {affiliate.name}
                                {affiliate.company && (
                                  <div className="text-xs text-muted-foreground">{affiliate.company}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{affiliate.email}</TableCell>
                            <TableCell>{affiliate.commissionRate}%</TableCell>
                            <TableCell>{affiliate.totalReferrals}</TableCell>
                            <TableCell>${affiliate.totalCommission.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  affiliate.status === "active"
                                    ? "default"
                                    : affiliate.status === "pending"
                                      ? "outline"
                                      : "secondary"
                                }
                                className={
                                  affiliate.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : affiliate.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                }
                              >
                                {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Link href={`/dashboard/affiliate-management/${affiliate.id}`}>View details</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit affiliate</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View commissions</DropdownMenuItem>
                                  <DropdownMenuItem>Send payment</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {affiliate.status === "active" ? (
                                    <DropdownMenuItem className="text-amber-600">Deactivate</DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem className="text-green-600">Activate</DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Payouts</CardTitle>
                <CardDescription>Manage and track all commission payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search payments..." className="h-9 w-[250px]" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>Paid</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>Last 30 days</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Last 90 days</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>This year</DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href="/dashboard/affiliate-management/commissions/new">
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Record Payment
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center space-x-1">
                            <span>Date</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-1">
                            <span>Amount</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Apr 5, 2023</TableCell>
                        <TableCell>
                          <div className="font-medium">Jane Cooper</div>
                          <div className="text-xs text-muted-foreground">Marketing Pro</div>
                        </TableCell>
                        <TableCell>$875.00</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Download receipt</DropdownMenuItem>
                              <DropdownMenuItem>Mark as unpaid</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apr 1, 2023</TableCell>
                        <TableCell>
                          <div className="font-medium">Alex Johnson</div>
                          <div className="text-xs text-muted-foreground">Sales Guru</div>
                        </TableCell>
                        <TableCell>$720.00</TableCell>
                        <TableCell>Bank Transfer</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Download receipt</DropdownMenuItem>
                              <DropdownMenuItem>Mark as unpaid</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mar 15, 2023</TableCell>
                        <TableCell>
                          <div className="font-medium">Sarah Williams</div>
                          <div className="text-xs text-muted-foreground">Finance Blogs</div>
                        </TableCell>
                        <TableCell>$650.00</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Download receipt</DropdownMenuItem>
                              <DropdownMenuItem>Mark as unpaid</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>May 15, 2023</TableCell>
                        <TableCell>
                          <div className="font-medium">Jane Cooper</div>
                          <div className="text-xs text-muted-foreground">Marketing Pro</div>
                        </TableCell>
                        <TableCell>$935.50</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Mark as paid</DropdownMenuItem>
                              <DropdownMenuItem>Cancel payment</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
