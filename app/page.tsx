"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Bell,
  FileText,
  Globe,
  Repeat,
  Smartphone,
  Users,
  Sparkles,
  CheckCircle2,
  Star,
  ChevronRight,
  Menu,
  X,
  UserPlus,
  DollarSign,
  Check,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionCard } from "@/components/ui/motion-card"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.05], [0, -50])

  useEffect(() => {
    setIsLoaded(true)

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  const testimonials = [
    {
      quote:
        "Quotlyo transformed how we manage our invoices and client relationships. The automation features alone saved us 15 hours per week!",
      author: "Sarah Johnson",
      role: "CFO, TechVision Inc.",
      rating: 5,
    },
    {
      quote:
        "The multi-currency support and customizable templates have been game-changers for our international business. Worth every penny.",
      author: "Michael Chen",
      role: "Founder, Global Ventures",
      rating: 5,
    },
    {
      quote:
        "After trying multiple platforms, Quotlyo stands out with its intuitive interface and powerful features. Our accounting team loves it!",
      author: "Jessica Williams",
      role: "Operations Director, Nexus Group",
      rating: 5,
    },
  ]

  const stats = [
    { value: 10000, label: "Active Users", prefix: "+", suffix: "" },
    { value: 5, label: "Minutes Saved Per Invoice", prefix: "", suffix: "min" },
    { value: 99.9, label: "Uptime", prefix: "", suffix: "%" },
    { value: 24, label: "Support", prefix: "", suffix: "/7" },
  ]

  // Function to handle button clicks that aren't fully implemented yet
  const handleComingSoonClick = (e) => {
    e.preventDefault()
    alert("This feature is coming soon! Thank you for your interest.")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-premium-50/20">
      {/* Floating elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] h-[500px] w-[500px] rounded-full bg-premium-100/20 blur-[100px]" />
        <div className="absolute top-[20%] -left-[10%] h-[300px] w-[300px] rounded-full bg-gold-100/10 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-premium-200/10 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/quotlyo_full_logo.png" alt="Quotlyo Logo" width={280} height={80} className="h-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex gap-6">
            <a
              href="#features"
              className="text-sm font-medium transition-colors hover:text-premium-600 animated-underline"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium transition-colors hover:text-premium-600 animated-underline"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium transition-colors hover:text-premium-600 animated-underline"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Testimonials
            </a>
            <a
              href="#affiliate-section"
              className="text-sm font-medium transition-colors hover:text-premium-600 animated-underline"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("affiliate-section")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Affiliate
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="border-premium-200 hover:bg-premium-50">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default">Sign up</Button>
            </Link>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image src="/quotlyo_favicon.png" alt="Quotlyo Logo" width={50} height={50} />
                    <span className="font-bold text-xl gradient-text">Quotlyo</span>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {[
                      { name: "Features", id: "features" },
                      { name: "Pricing", id: "pricing" },
                      { name: "Testimonials", id: "testimonials" },
                      { name: "Affiliate", id: "affiliate-section" },
                    ].map((item) => (
                      <a
                        key={item.name}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          setIsMobileMenuOpen(false)
                          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        <Button variant="ghost" className="w-full justify-start">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          {item.name}
                        </Button>
                      </a>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity, y }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-gradient opacity-5 rounded-full blur-[100px]" />
          </motion.div>

          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-premium-100 text-premium-700">
                      <Sparkles className="inline-block w-4 h-4 mr-1" /> The Ultimate Business Platform
                    </span>
                  </motion.div>

                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <span className="gradient-text">Create Smart</span> Quotations and Invoices in 60 Seconds
                  </motion.h1>

                  <motion.p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Quotlyo makes creating professional quotations and invoices fast, simple, and powerful — whether
                    you're a freelancer, a business owner, or building the next big thing.
                  </motion.p>
                </div>

                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1">
                      Try Demo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button size="lg" variant="outline" className="border-premium-200 hover:bg-premium-50">
                      Learn More
                    </Button>
                  </a>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-4 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-gold-400 text-gold-400" />
                  ))}
                  <span className="font-medium">Trusted by 10,000+ businesses</span>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                <AnimatedGradientBorder
                  gradientColors={["#0277c7", "#0c456e", "#eab308", "#0277c7"]}
                  animationDuration={20}
                  className="w-full overflow-hidden rounded-xl shadow-premium-lg"
                >
                  <Image
                    src="/hero-document-icon.png"
                    alt="Quotation Document Icon"
                    width={500}
                    height={500}
                    className="rounded-lg p-8"
                  />
                </AnimatedGradientBorder>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 bg-premium-50/30">
          <div className="container px-4 md:px-6">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {stats.map((stat, index) => (
                <motion.div key={stat.label} className="flex flex-col items-center" variants={item}>
                  <h3 className="text-3xl md:text-4xl font-bold text-premium-700">
                    {stat.prefix}
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 mb-2 text-sm font-medium rounded-full bg-premium-100 text-premium-700">
                  Powerful Features
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Streamline your business operations with our comprehensive suite of tools.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                {
                  icon: FileText,
                  title: "Invoicing",
                  description: "Create and manage professional invoices with automated reminders for overdue payments.",
                  link: "/dashboard/invoices",
                  color: "premium",
                },
                {
                  icon: FileText,
                  title: "Quotations",
                  description:
                    "Design and send detailed quotations to potential clients, convert to invoices with one click.",
                  link: "/dashboard/quotations",
                  color: "premium",
                },
                {
                  icon: Users,
                  title: "Client Management",
                  description:
                    "Store client details, track communication history, and manage relationships effectively.",
                  link: "/dashboard/clients",
                  color: "premium",
                },
                {
                  icon: Bell,
                  title: "Auto-Reminders",
                  description: "Automatically email clients when invoices are due or overdue, improving cash flow.",
                  link: "/dashboard",
                  color: "gold",
                },
                {
                  icon: Repeat,
                  title: "Recurring Invoices",
                  description: "Set up automatic recurring invoices for subscription services on custom schedules.",
                  link: "/dashboard/invoices",
                  color: "gold",
                },
                {
                  icon: Globe,
                  title: "Multi-Currency & Tax",
                  description:
                    "Create invoices in multiple currencies with automatic exchange rates and regional tax rates.",
                  link: "/dashboard",
                  color: "gold",
                },
                {
                  icon: BarChart3,
                  title: "Dashboard Insights",
                  description:
                    "Interactive charts showing revenue trends, outstanding invoices, and payment analytics.",
                  link: "/dashboard/reports",
                  color: "premium",
                },
                {
                  icon: FileText,
                  title: "Template Store",
                  description: "Access a marketplace of professionally designed invoice and quotation templates.",
                  link: "/dashboard",
                  color: "premium",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Friendly",
                  description: "Create invoices, check payments, and manage your business from anywhere on any device.",
                  link: "/dashboard",
                  color: "premium",
                },
              ].map((feature, index) => (
                <motion.div key={feature.title} variants={item}>
                  <MotionCard variant={feature.color as "premium" | "gold"} delay={index} className="h-full">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-premium-100/50">
                        <feature.icon
                          className={`h-6 w-6 ${feature.color === "gold" ? "text-gold-600" : "text-premium-600"}`}
                        />
                      </div>
                      <div className="grid gap-1">
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <Link href={feature.link}>
                        <Button
                          variant="ghost"
                          className={`gap-1 ${feature.color === "gold" ? "text-gold-600 hover:text-gold-700" : "text-premium-600 hover:text-premium-700"} animated-underline`}
                        >
                          Learn more
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </MotionCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-premium-50/30">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 mb-2 text-sm font-medium rounded-full bg-premium-100 text-premium-700">
                  Testimonials
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  What Our Customers Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of satisfied businesses who have transformed their operations with Quotlyo.
                </p>
              </div>
            </motion.div>

            <div className="mx-auto max-w-4xl">
              <AnimatedGradientBorder>
                <div className="relative overflow-hidden rounded-xl bg-background p-8 md:p-10">
                  <div className="absolute top-0 left-0 w-full h-1 bg-premium-gradient" />

                  <div className="flex flex-col items-center">
                    <div className="mb-6 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-6 w-6 fill-gold-400 text-gold-400" />
                      ))}
                    </div>

                    <div className="relative h-[200px] w-full">
                      {testimonials.map((testimonial, index) => (
                        <motion.div
                          key={index}
                          className="absolute inset-0"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: activeTestimonial === index ? 1 : 0,
                            x: activeTestimonial === index ? 0 : activeTestimonial > index ? -20 : 20,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <blockquote className="text-center">
                            <p className="text-xl md:text-2xl font-medium text-foreground mb-6">
                              "{testimonial.quote}"
                            </p>
                            <footer>
                              <div className="font-semibold text-premium-700">{testimonial.author}</div>
                              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                            </footer>
                          </blockquote>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 flex space-x-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          className={`h-2 w-2 rounded-full transition-all ${
                            activeTestimonial === index ? "w-8 bg-premium-600" : "bg-premium-200"
                          }`}
                          onClick={() => setActiveTestimonial(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedGradientBorder>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 mb-2 text-sm font-medium rounded-full bg-premium-100 text-premium-700">
                  Pricing
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for your business needs.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 mt-12"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                {
                  name: "Free Plan",
                  description: "Perfect for small businesses and freelancers just getting started",
                  price: 0,
                  features: [
                    { name: "Quotations & Invoices", available: true, limit: "Limited to 5 / month" },
                    { name: "Client Management", available: true, limit: "Up to 5" },
                    { name: "Premium template access", available: false },
                    { name: "Multi-currency & tax support", available: false },
                    { name: "Auto-Reminders", available: false },
                    { name: "Mobile Friendly", available: true },
                    { name: "Digital Stamp", available: true, limit: "Limited to use 3 / month" },
                    { name: "Financial Reports", available: false },
                    { name: "Recurring Invoices", available: false },
                    { name: "Priority Support", available: false },
                    { name: "Revenue Tracking", available: false },
                    { name: "Export Reports (CSV, PDF)", available: false },
                    { name: "Custom Branding", available: false },
                  ],
                  variant: "default",
                  buttonText: "Start Free",
                },
                {
                  name: "Pro Plan",
                  description: "All the features you need to grow your business",
                  price: 9,
                  features: [
                    { name: "Quotations & Invoices", available: true, limit: "Unlimited" },
                    { name: "Client Management", available: true, limit: "Full (Notes, History)" },
                    { name: "Premium template access", available: true },
                    { name: "Multi-currency & tax support", available: true },
                    { name: "Auto-Reminders", available: true },
                    { name: "Mobile Friendly", available: true },
                    { name: "Digital Stamp", available: true, limit: "Unlimited" },
                    { name: "Financial Reports", available: true },
                    { name: "Recurring Invoices", available: true },
                    { name: "Priority Support", available: true },
                    { name: "Revenue Tracking", available: true },
                    { name: "Export Reports (CSV, PDF)", available: true },
                    { name: "Custom Branding", available: true, limit: "(Future feature)" },
                  ],
                  variant: "premium",
                  buttonText: "Upgrade Anytime",
                  popular: true,
                },
              ].map((plan, index) => (
                <motion.div key={plan.name} variants={item}>
                  <MotionCard
                    variant={plan.variant as "default" | "premium"}
                    delay={index}
                    className={`relative h-full ${plan.popular ? "border-premium-500" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 text-xs font-semibold rounded-full bg-premium-gradient text-white shadow-premium">
                        Most Popular
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4 text-4xl font-bold">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <ul className="grid gap-3 text-sm">
                        {plan.features.map((feature) => (
                          <li key={feature.name} className="flex items-start gap-2">
                            {feature.available ? (
                              <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            ) : (
                              <XIcon className="h-4 w-4 text-red-500 mt-0.5" />
                            )}
                            <span>
                              {feature.name}
                              {feature.limit && (
                                <span className="text-xs text-muted-foreground ml-1">({feature.limit})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Link href="/dashboard" className="w-full">
                        <Button
                          className={`w-full ${plan.variant === "premium" ? "bg-premium-600 hover:bg-premium-700" : ""}`}
                        >
                          {plan.buttonText}
                        </Button>
                      </Link>
                    </CardFooter>
                  </MotionCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Referral Program Section */}
        <section
          id="affiliate-section"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-blue-100/30"
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 mb-2 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                  <UserPlus className="inline-block mr-1 h-4 w-4" />
                  For Partners
                </span>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                  Become a Quotlyo Affiliate
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our affiliate program and earn recurring commissions for every customer you refer
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Why Become an Affiliate?</h3>
                  <p className="text-muted-foreground">
                    Our affiliate program offers generous commissions and provides all the tools you need to succeed.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">15% Recurring Commission</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn 15% of the monthly subscription fee for the lifetime of each customer you refer.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Marketing Materials</h4>
                      <p className="text-sm text-muted-foreground">
                        Access professional banners, email templates, and social media content to promote Quotlyo.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>{" "}
                    </div>
                    <div>
                      <h4 className="font-medium">Dedicated Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Get personalized support from our affiliate team to maximize your earnings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/affiliate-signup">
                    <Button size="lg" className="gap-2">
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/affiliate-portal">
                    <Button variant="outline" size="lg" className="ml-4">
                      Affiliate Login
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatedGradientBorder gradientColors={["#0277c7", "#0c456e", "#0277c7"]} animationDuration={15}>
                  <div className="bg-white p-8 rounded-lg">
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <DollarSign className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold">Earn Up To</h3>
                        <div className="text-5xl font-bold text-blue-600 my-2">$500+</div>
                        <p className="text-muted-foreground">per month in recurring commissions</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Starter Plan ($29/mo)</span>
                          <span className="font-medium">$4.35/mo per referral</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Professional Plan ($79/mo)</span>
                          <span className="font-medium">$11.85/mo per referral</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Enterprise Plan ($199/mo)</span>
                          <span className="font-medium">$29.85/mo per referral</span>
                        </div>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Commissions are paid monthly for the lifetime of the customer
                      </div>
                    </div>
                  </div>
                </AnimatedGradientBorder>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-12 bg-premium-50/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 gradient-text">Quotlyo</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 gradient-text">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-premium-600"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm text-muted-foreground hover:text-premium-600"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 gradient-text">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 gradient-text">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-premium-600">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-premium-100/20 pt-8">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Quotlyo. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm font-medium transition-colors hover:text-premium-600">
                Terms
              </a>
              <a href="#" className="text-sm font-medium transition-colors hover:text-premium-600">
                Privacy
              </a>
              <a href="#" className="text-sm font-medium transition-colors hover:text-premium-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
