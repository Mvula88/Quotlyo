"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Send,
  Trash2,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "@/components/ui/use-toast"

export default function InvoicesPage() {
  const { t } = useLanguage()
  const [invoices] = useState([
    {
      id: "INV-2023-001",
      date: "2023-05-15",
      dueDate: "2023-06-15",
      client: "Acme Inc.",
      amount: "$1,200.00",
      status: "paid",
    },
    {
      id: "INV-2023-002",
      date: "2023-05-20",
      dueDate: "2023-06-20",
      client: "TechSolutions Ltd.",
      amount: "$3,500.00",
      status: "pending",
    },
    {
      id: "INV-2023-003",
      date: "2023-05-25",
      dueDate: "2023-06-25",
      client: "Global Enterprises",
      amount: "$2,800.00",
      status: "overdue",
    },
    {
      id: "INV-2023-004",
      date: "2023-06-01",
      dueDate: "2023-07-01",
      client: "Startup Innovators",
      amount: "$950.00",
      status: "paid",
    },
    {
      id: "INV-2023-005",
      date: "2023-06-05",
      dueDate: "2023-07-05",
      client: "Creative Studios",
      amount: "$1,750.00",
      status: "pending",
    },
  ])

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t("invoices.paid")}
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-orange-200 bg-orange-100 text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900 dark:text-orange-300"
          >
            <Clock className="mr-1 h-3 w-3" />
            {t("invoices.pending")}
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            {t("invoices.overdue")}
          </Badge>
        )
      default:
        return null
    }
  }

  const handleAction = (action, invoice) => {
    switch (action) {
      case "view":
        toast({
          title: "View Invoice",
          description: `Viewing invoice ${invoice.id}`,
        })
        break
      case "edit":
        toast({
          title: "Edit Invoice",
          description: `Editing invoice ${invoice.id}`,
        })
        break
      case "download":
        toast({
          title: "Download Invoice",
          description: `Invoice ${invoice.id} has been downloaded`,
        })
        break
      case "send":
        toast({
          title: "Send Invoice",
          description: `Invoice ${invoice.id} has been sent to ${invoice.client}`,
        })
        break
      case "delete":
        toast({
          title: "Delete Invoice",
          description: `Invoice ${invoice.id} has been deleted`,
          variant: "destructive",
        })
        break
      default:
        break
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("invoices.title")}</h1>
          <p className="text-muted-foreground">{t("invoices.title")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invoices/new">
            <Plus className="mr-2 h-4 w-4" /> {t("invoices.create")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("invoices.title")}</CardTitle>
          <CardDescription>{t("invoices.title")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    {t("invoices.number")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    {t("invoices.date")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    {t("invoices.dueDate")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    {t("invoices.client")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    {t("invoices.amount")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    {t("invoices.status")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>{t("invoices.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t("actions.view")}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions.view")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction("view", invoice)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("actions.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("edit", invoice)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("download", invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          {t("actions.download")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("send", invoice)}>
                          <Send className="mr-2 h-4 w-4" />
                          {t("actions.send")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => handleAction("delete", invoice)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
