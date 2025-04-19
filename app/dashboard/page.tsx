"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Bell,
  FileText,
  Globe,
  Repeat,
  Sparkles,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  BarChart2,
  Zap,
  Calendar,
  Crown,
  ChevronRight,
  Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PremiumButton } from "@/components/ui/premium-button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/contexts/language-context"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  const [userName, setUserName] = useState("John")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
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

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return t("dashboard.goodMorning")
    if (hour < 18) return t("dashboard.goodAfternoon")
    return t("dashboard.goodEvening")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-3 md:p-6 lg:p-8 pt-4">
        <motion.div
          className="flex flex-col space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
            {getGreeting()}, {userName}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">{t("dashboard.businessUpdate")}</p>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          className="mt-4 md:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-xl">{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                // Mobile view - scrollable horizontal buttons
                <ScrollArea className="w-full whitespace-nowrap pb-2" orientation="horizontal">
                  <div className="flex space-x-3 px-1">
                    <Link href="/dashboard/quotations/new">
                      <Button variant="outline" className="h-12 min-w-[140px] justify-start">
                        <FileText className="h-5 w-5 mr-2 text-blue-500" />
                        <span>{t("dashboard.createQuote")}</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard/invoices/new">
                      <Button variant="outline" className="h-12 min-w-[140px] justify-start">
                        <FileText className="h-5 w-5 mr-2 text-blue-500" />
                        <span>{t("dashboard.createInvoice")}</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard/clients/new">
                      <Button variant="outline" className="h-12 min-w-[140px] justify-start">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        <span>{t("dashboard.addClient")}</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard/stamp-manager">
                      <Button variant="outline" className="h-12 min-w-[140px] justify-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-5 w-5 mr-2 text-blue-500"
                        >
                          <path d="M5 22h14" />
                          <path d="M5 2h14" />
                          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                        </svg>
                        <span>{t("dashboard.createStamp")}</span>
                      </Button>
                    </Link>
                  </div>
                </ScrollArea>
              ) : (
                // Desktop view - grid layout
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link href="/dashboard/quotations/new">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{t("dashboard.createQuote")}</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/invoices/new">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{t("dashboard.createInvoice")}</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/clients/new">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Users className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{t("dashboard.addClient")}</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/stamp-manager">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-5 w-5 mr-2 text-blue-500"
                      >
                        <path d="M5 22h14" />
                        <path d="M5 2h14" />
                        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                      </svg>
                      <span>{t("dashboard.createStamp")}</span>
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Cards */}
        <div className="mt-4 md:mt-6 grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-2 sm:col-span-1"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t("dashboard.totalRevenue")}</p>
                    <h3 className="text-lg md:text-2xl font-bold text-[#24685]">
                      $<AnimatedCounter value={24685} decimals={2} />
                    </h3>
                    <p className="text-[10px] md:text-xs text-emerald-500 flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 mr-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                          clipRule="evenodd"
                        />
                      </svg>
                      +<AnimatedCounter value={12.5} decimals={1} />% {t("dashboard.fromLastMonth")}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Invoices Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                      {t("dashboard.pendingInvoices")}
                    </p>
                    <h3 className="text-lg md:text-2xl font-bold">
                      <AnimatedCounter value={8} />
                    </h3>
                    <p className="text-[10px] md:text-xs text-blue-500 mt-1">
                      $<AnimatedCounter value={5234} /> {t("dashboard.outstanding")}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paid Invoices Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                      {t("dashboard.paidInvoices")}
                    </p>
                    <h3 className="text-lg md:text-2xl font-bold">
                      <AnimatedCounter value={24} />
                    </h3>
                    <p className="text-[10px] md:text-xs text-emerald-500 flex items-center mt-1">
                      +<AnimatedCounter value={3} /> {t("dashboard.fromLastMonth")}
                    </p>
                  </div>
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Clients Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                      {t("dashboard.activeClients")}
                    </p>
                    <h3 className="text-lg md:text-2xl font-bold">
                      <AnimatedCounter value={12} />
                    </h3>
                    <p className="text-[10px] md:text-xs text-emerald-500 flex items-center mt-1">
                      +<AnimatedCounter value={2} /> {t("dashboard.newThisMonth")}
                    </p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Premium Features Section */}
        <motion.div
          className="mt-4 md:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <AnimatedGradientBorder>
            <Card className="border-0">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5 text-premium-600" />
                  <span className="gradient-text">{t("premium.title")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMobile ? (
                  // Mobile view - scrollable horizontal cards
                  <ScrollArea className="w-full whitespace-nowrap pb-2" orientation="horizontal">
                    <motion.div
                      className="flex space-x-3 px-1"
                      variants={container}
                      initial="hidden"
                      animate={isLoaded ? "show" : "hidden"}
                    >
                      <Link href="/dashboard/premium-features?tab=auto-reminders">
                        <motion.div variants={item} className="min-w-[220px]">
                          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-premium-100/50">
                                <Bell className="h-5 w-5 text-premium-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{t("premium.autoReminders")}</h4>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>

                      <Link href="/dashboard/premium-features?tab=recurring-invoices">
                        <motion.div variants={item} className="min-w-[220px]">
                          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-premium-100/50">
                                <Repeat className="h-5 w-5 text-premium-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{t("premium.recurringInvoices")}</h4>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>

                      <Link href="/dashboard/premium-features?tab=multi-currency-tax">
                        <motion.div variants={item} className="min-w-[220px]">
                          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-premium-100/50">
                                <Globe className="h-5 w-5 text-premium-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{t("premium.multiCurrency")}</h4>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </ScrollArea>
                ) : (
                  // Desktop view - grid layout
                  <motion.div
                    className="grid gap-4 md:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    animate={isLoaded ? "show" : "hidden"}
                  >
                    <Link href="/dashboard/premium-features?tab=auto-reminders">
                      <motion.div variants={item}>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-premium-100/50">
                              <Bell className="h-5 w-5 text-premium-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{t("premium.autoReminders")}</h4>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>

                    <Link href="/dashboard/premium-features?tab=recurring-invoices">
                      <motion.div variants={item}>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-premium-100/50">
                              <Repeat className="h-5 w-5 text-premium-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{t("premium.recurringInvoices")}</h4>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>

                    <Link href="/dashboard/premium-features?tab=multi-currency-tax">
                      <motion.div variants={item}>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-premium-100/50">
                              <Globe className="h-5 w-5 text-premium-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{t("premium.multiCurrency")}</h4>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>

        {/* Revenue Overview and Recent Activity */}
        <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 md:grid-cols-2">
          {/* Revenue Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="order-2 md:order-1"
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  <CardTitle className="text-lg">{t("dashboard.revenueOverview")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px] md:h-[300px] w-full">
                  {/* Placeholder for chart - we'll replace this with a static visualization */}
                  <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{t("dashboard.revenueChart")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("dashboard.revenueChartDesc")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="order-1 md:order-2"
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  <CardTitle className="text-lg">{t("dashboard.recentActivity")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-0">
                  {[
                    {
                      type: t("invoices.title"),
                      number: "#1234",
                      client: "Client A",
                      amount: 1200.0,
                      status: t("invoices.pending"),
                      statusColor: "text-blue-500",
                    },
                    {
                      type: t("quotations.title"),
                      number: "#5678",
                      client: "Client B",
                      amount: 3500.0,
                      status: t("quotations.viewed"),
                      statusColor: "text-amber-500",
                    },
                    {
                      type: t("invoices.title"),
                      number: "#1235",
                      client: "Client C",
                      amount: 850.0,
                      status: t("invoices.paid"),
                      statusColor: "text-emerald-500",
                    },
                    {
                      type: t("quotations.title"),
                      number: "#5679",
                      client: "Client D",
                      amount: 2100.0,
                      status: t("quotations.accepted"),
                      statusColor: "text-emerald-500",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-xs md:text-sm font-medium">
                              {item.type} {item.number}
                            </h4>
                          </div>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {t("dashboard.sentTo")} {item.client}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs md:text-sm font-medium">${item.amount.toLocaleString()}</p>
                          <p className={`text-[10px] md:text-xs ${item.statusColor}`}>{item.status}</p>
                        </div>
                      </div>
                      {index < 3 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs md:text-sm">
                  {t("dashboard.viewAllActivity")}
                  <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Referral Program Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Share2 className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                <CardTitle className="text-lg">{t("dashboard.referFriends")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 md:py-4">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 mr-3 flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <p className="text-xs md:text-sm">{t("dashboard.shareReferralLink")}</p>
                </div>
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 mr-3 flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <p className="text-xs md:text-sm">{t("dashboard.friendsSignUp")}</p>
                </div>
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 mr-3 flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <p className="text-xs md:text-sm">{t("dashboard.bothEarnRewards")}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/referral-program" className="w-full">
                <Button variant="outline" className="w-full text-xs md:text-sm border-blue-200 hover:bg-blue-50">
                  {t("dashboard.startReferring")}
                  <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Upcoming Payments and Upgrade Plan */}
        <div className="mt-4 md:mt-6 grid gap-4 md:gap-6 md:grid-cols-2">
          {/* Upcoming Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  <CardTitle className="text-lg">{t("dashboard.upcomingPayments")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium">{t("invoices.title")} #1234</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        Client A - {t("dashboard.dueInDays", { days: 5 })}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm font-medium">$1,200.00</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium">{t("invoices.title")} #1238</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        Client E - {t("dashboard.dueInDays", { days: 12 })}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm font-medium">$3,450.00</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium">{t("invoices.title")} #1242</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        Client B - {t("dashboard.dueInDays", { days: 18 })}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm font-medium">$850.00</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs md:text-sm">
                  {t("dashboard.viewAllUpcoming")}
                  <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Upgrade Your Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card className="bg-gradient-to-br from-premium-50 to-white border-premium-200">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Crown className="mr-2 h-4 w-4 md:h-5 md:w-5 text-premium-600" />
                  <CardTitle className="text-lg text-premium-700">{t("premium.upgradePlan")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 md:space-y-4 py-2 md:py-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-premium-600 mr-2" />
                    <p className="text-xs md:text-sm">{t("premium.unlimitedInvoices")}</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-premium-600 mr-2" />
                    <p className="text-xs md:text-sm">{t("premium.advancedReporting")}</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-premium-600 mr-2" />
                    <p className="text-xs md:text-sm">{t("premium.multiCurrency")}</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-premium-600 mr-2" />
                    <p className="text-xs md:text-sm">{t("premium.autoReminders")}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <PremiumButton variant="premium" className="w-full text-xs md:text-sm">
                  {t("premium.upgradeNow")}
                  <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </PremiumButton>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
