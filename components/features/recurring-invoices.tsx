"use client"

import { useState } from "react"
import { CalendarIcon, Check, ChevronRight, Clock, Edit, Plus, Repeat, Trash } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import type { RecurringInvoice, RecurringInterval } from "@/types/invoice"

export function RecurringInvoices() {
  const [activeTab, setActiveTab] = useState("active")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedRecurring, setSelectedRecurring] = useState<RecurringInvoice | null>(null)

  const [newRecurring, setNewRecurring] = useState<Partial<RecurringInvoice>>({
    name: "",
    clientId: "",
    client: "",
    interval: "monthly",
    frequency: 1,
    startDate: new Date().toISOString().split("T")[0],
    nextInvoiceDate: new Date().toISOString().split("T")[0],
    active: true,
    dayOfMonth: 1,
  })

  // Sample data for recurring invoices
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([
    {
      id: "rec-001",
      name: "Monthly Hosting",
      clientId: "client-001",
      client: "Acme Inc.",
      interval: "monthly",
      frequency: 1,
      startDate: "2023-01-01",
      nextInvoiceDate: "2023-06-01",
      lastInvoiceDate: "2023-05-01",
      baseInvoice: {
        id: "inv-template-001",
        number: "TEMPLATE-001",
        client: "Acme Inc.",
        clientId: "client-001",
        amount: "$99.00",
        status: "draft",
        date: "2023-05-01",
        dueDate: "2023-05-15",
        items: [
          {
            id: "item-001",
            description: "Web Hosting - Standard Plan",
            quantity: 1,
            price: 99,
            total: 99,
          },
        ],
      },
      active: true,
      dayOfMonth: 1,
    },
    {
      id: "rec-002",
      name: "Quarterly Maintenance",
      clientId: "client-002",
      client: "Wayne Enterprises",
      interval: "quarterly",
      frequency: 1,
      startDate: "2023-01-15",
      nextInvoiceDate: "2023-07-15",
      lastInvoiceDate: "2023-04-15",
      baseInvoice: {
        id: "inv-template-002",
        number: "TEMPLATE-002",
        client: "Wayne Enterprises",
        clientId: "client-002",
        amount: "$750.00",
        status: "draft",
        date: "2023-04-15",
        dueDate: "2023-04-30",
        items: [
          {
            id: "item-002",
            description: "Quarterly System Maintenance",
            quantity: 1,
            price: 750,
            total: 750,
          },
        ],
      },
      active: true,
      dayOfMonth: 15,
    },
    {
      id: "rec-003",
      name: "Weekly Reporting",
      clientId: "client-003",
      client: "Stark Industries",
      interval: "weekly",
      frequency: 1,
      startDate: "2023-05-01",
      nextInvoiceDate: "2023-05-22",
      lastInvoiceDate: "2023-05-15",
      baseInvoice: {
        id: "inv-template-003",
        number: "TEMPLATE-003",
        client: "Stark Industries",
        clientId: "client-003",
        amount: "$199.00",
        status: "draft",
        date: "2023-05-15",
        dueDate: "2023-05-22",
        items: [
          {
            id: "item-003",
            description: "Weekly Analytics Report",
            quantity: 1,
            price: 199,
            total: 199,
          },
        ],
      },
      active: false,
      dayOfWeek: 1, // Monday
    },
  ])

  const handleCreateRecurring = () => {
    const newId = `rec-${(recurringInvoices.length + 1).toString().padStart(3, "0")}`
    const newRecurringInvoice: RecurringInvoice = {
      ...(newRecurring as RecurringInvoice),
      id: newId,
      baseInvoice: {
        id: `inv-template-${newId}`,
        number: `TEMPLATE-${newId}`,
        client: newRecurring.client || "",
        clientId: newRecurring.clientId || "",
        amount: "$0.00",
        status: "draft",
        date: newRecurring.startDate || "",
        dueDate: newRecurring.startDate || "",
        items: [],
      },
    }

    setRecurringInvoices([...recurringInvoices, newRecurringInvoice])
    setCreateDialogOpen(false)
    toast({
      title: "Recurring invoice created",
      description: `${newRecurringInvoice.name} has been created successfully.`,
    })
  }

  const handleUpdateRecurring = () => {
    if (!selectedRecurring) return

    setRecurringInvoices(recurringInvoices.map((rec) => (rec.id === selectedRecurring.id ? selectedRecurring : rec)))
    setEditDialogOpen(false)
    toast({
      title: "Recurring invoice updated",
      description: `${selectedRecurring.name} has been updated successfully.`,
    })
  }

  const handleDeleteRecurring = (id: string) => {
    setRecurringInvoices(recurringInvoices.filter((rec) => rec.id !== id))
    toast({
      title: "Recurring invoice deleted",
      description: "The recurring invoice has been deleted successfully.",
    })
  }

  const handleToggleActive = (id: string, active: boolean) => {
    setRecurringInvoices(recurringInvoices.map((rec) => (rec.id === id ? { ...rec, active } : rec)))
    toast({
      title: active ? "Recurring invoice activated" : "Recurring invoice paused",
      description: active
        ? "The recurring invoice is now active and will generate invoices on schedule."
        : "The recurring invoice has been paused and will not generate new invoices.",
    })
  }

  const getIntervalLabel = (interval: RecurringInterval, frequency: number) => {
    switch (interval) {
      case "weekly":
        return frequency === 1 ? "Weekly" : `Every ${frequency} weeks`
      case "monthly":
        return frequency === 1 ? "Monthly" : `Every ${frequency} months`
      case "quarterly":
        return "Quarterly"
      case "yearly":
        return "Yearly"
      default:
        return "Custom"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recurring Invoices</h2>
          <p className="text-muted-foreground">Set up automatic recurring invoices for subscription services.</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Recurring Invoice
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            <Check className="mr-2 h-4 w-4" />
            Active ({recurringInvoices.filter((r) => r.active).length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            <Clock className="mr-2 h-4 w-4" />
            Paused ({recurringInvoices.filter((r) => !r.active).length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({recurringInvoices.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {recurringInvoices.filter((r) => r.active).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Repeat className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No active recurring invoices</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any active recurring invoices yet.</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Recurring Invoice
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recurringInvoices
                .filter((r) => r.active)
                .map((recurring) => (
                  <RecurringInvoiceCard
                    key={recurring.id}
                    recurring={recurring}
                    onEdit={() => {
                      setSelectedRecurring(recurring)
                      setEditDialogOpen(true)
                    }}
                    onDelete={() => handleDeleteRecurring(recurring.id)}
                    onToggleActive={(active) => handleToggleActive(recurring.id, active)}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          {recurringInvoices.filter((r) => !r.active).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No paused recurring invoices</h3>
                <p className="text-sm text-muted-foreground">You don't have any paused recurring invoices.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recurringInvoices
                .filter((r) => !r.active)
                .map((recurring) => (
                  <RecurringInvoiceCard
                    key={recurring.id}
                    recurring={recurring}
                    onEdit={() => {
                      setSelectedRecurring(recurring)
                      setEditDialogOpen(true)
                    }}
                    onDelete={() => handleDeleteRecurring(recurring.id)}
                    onToggleActive={(active) => handleToggleActive(recurring.id, active)}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {recurringInvoices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Repeat className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No recurring invoices</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any recurring invoices yet.</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Recurring Invoice
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recurringInvoices.map((recurring) => (
                <RecurringInvoiceCard
                  key={recurring.id}
                  recurring={recurring}
                  onEdit={() => {
                    setSelectedRecurring(recurring)
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => handleDeleteRecurring(recurring.id)}
                  onToggleActive={(active) => handleToggleActive(recurring.id, active)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Recurring Invoice</DialogTitle>
            <DialogDescription>
              Set up a new recurring invoice that will automatically generate on a schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Monthly Subscription"
                  value={newRecurring.name}
                  onChange={(e) => setNewRecurring({ ...newRecurring, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={newRecurring.clientId || ""}
                  onValueChange={(value) => {
                    const clients = {
                      "client-001": "Acme Inc.",
                      "client-002": "Wayne Enterprises",
                      "client-003": "Stark Industries",
                      "client-004": "Umbrella Corp.",
                      "client-005": "Globex Corp.",
                    }
                    setNewRecurring({
                      ...newRecurring,
                      clientId: value,
                      client: clients[value as keyof typeof clients] || "",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client-001">Acme Inc.</SelectItem>
                    <SelectItem value="client-002">Wayne Enterprises</SelectItem>
                    <SelectItem value="client-003">Stark Industries</SelectItem>
                    <SelectItem value="client-004">Umbrella Corp.</SelectItem>
                    <SelectItem value="client-005">Globex Corp.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interval">Interval</Label>
                <Select
                  value={newRecurring.interval || "monthly"}
                  onValueChange={(value) =>
                    setNewRecurring({
                      ...newRecurring,
                      interval: value as RecurringInterval,
                    })
                  }
                >
                  <SelectTrigger id="interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Every</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="frequency"
                    type="number"
                    min="1"
                    className="w-20"
                    value={newRecurring.frequency || 1}
                    onChange={(e) =>
                      setNewRecurring({
                        ...newRecurring,
                        frequency: Number.parseInt(e.target.value) || 1,
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {newRecurring.interval === "weekly"
                      ? "weeks"
                      : newRecurring.interval === "monthly"
                        ? "months"
                        : newRecurring.interval === "quarterly"
                          ? "quarters"
                          : newRecurring.interval === "yearly"
                            ? "years"
                            : "periods"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newRecurring.startDate ? (
                        format(new Date(newRecurring.startDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newRecurring.startDate ? new Date(newRecurring.startDate) : undefined}
                      onSelect={(date) =>
                        date &&
                        setNewRecurring({
                          ...newRecurring,
                          startDate: date.toISOString().split("T")[0],
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="next-date">Next Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newRecurring.nextInvoiceDate ? (
                        format(new Date(newRecurring.nextInvoiceDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newRecurring.nextInvoiceDate ? new Date(newRecurring.nextInvoiceDate) : undefined}
                      onSelect={(date) =>
                        date &&
                        setNewRecurring({
                          ...newRecurring,
                          nextInvoiceDate: date.toISOString().split("T")[0],
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {newRecurring.interval === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="day-of-month">Day of Month</Label>
                <Input
                  id="day-of-month"
                  type="number"
                  min="1"
                  max="31"
                  value={newRecurring.dayOfMonth || 1}
                  onChange={(e) =>
                    setNewRecurring({
                      ...newRecurring,
                      dayOfMonth: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  The day of the month when the invoice will be generated. If the month doesn't have this day, the last
                  day of the month will be used.
                </p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newRecurring.active}
                onCheckedChange={(checked) => setNewRecurring({ ...newRecurring, active: checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRecurring}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Recurring Invoice</DialogTitle>
            <DialogDescription>Update the settings for this recurring invoice.</DialogDescription>
          </DialogHeader>
          {selectedRecurring && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedRecurring.name}
                    onChange={(e) =>
                      setSelectedRecurring({
                        ...selectedRecurring,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-client">Client</Label>
                  <Select
                    value={selectedRecurring.clientId}
                    onValueChange={(value) => {
                      const clients = {
                        "client-001": "Acme Inc.",
                        "client-002": "Wayne Enterprises",
                        "client-003": "Stark Industries",
                        "client-004": "Umbrella Corp.",
                        "client-005": "Globex Corp.",
                      }
                      setSelectedRecurring({
                        ...selectedRecurring,
                        clientId: value,
                        client: clients[value as keyof typeof clients] || "",
                      })
                    }}
                  >
                    <SelectTrigger id="edit-client">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client-001">Acme Inc.</SelectItem>
                      <SelectItem value="client-002">Wayne Enterprises</SelectItem>
                      <SelectItem value="client-003">Stark Industries</SelectItem>
                      <SelectItem value="client-004">Umbrella Corp.</SelectItem>
                      <SelectItem value="client-005">Globex Corp.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-interval">Interval</Label>
                  <Select
                    value={selectedRecurring.interval}
                    onValueChange={(value) =>
                      setSelectedRecurring({
                        ...selectedRecurring,
                        interval: value as RecurringInterval,
                      })
                    }
                  >
                    <SelectTrigger id="edit-interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Every</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="edit-frequency"
                      type="number"
                      min="1"
                      className="w-20"
                      value={selectedRecurring.frequency}
                      onChange={(e) =>
                        setSelectedRecurring({
                          ...selectedRecurring,
                          frequency: Number.parseInt(e.target.value) || 1,
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedRecurring.interval === "weekly"
                        ? "weeks"
                        : selectedRecurring.interval === "monthly"
                          ? "months"
                          : selectedRecurring.interval === "quarterly"
                            ? "quarters"
                            : selectedRecurring.interval === "yearly"
                              ? "years"
                              : "periods"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-next-date">Next Invoice Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(selectedRecurring.nextInvoiceDate), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(selectedRecurring.nextInvoiceDate)}
                        onSelect={(date) =>
                          date &&
                          setSelectedRecurring({
                            ...selectedRecurring,
                            nextInvoiceDate: date.toISOString().split("T")[0],
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {selectedRecurring.interval === "monthly" && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-day-of-month">Day of Month</Label>
                    <Input
                      id="edit-day-of-month"
                      type="number"
                      min="1"
                      max="31"
                      value={selectedRecurring.dayOfMonth || 1}
                      onChange={(e) =>
                        setSelectedRecurring({
                          ...selectedRecurring,
                          dayOfMonth: Number.parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={selectedRecurring.active}
                  onCheckedChange={(checked) =>
                    setSelectedRecurring({
                      ...selectedRecurring,
                      active: checked,
                    })
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRecurring}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface RecurringInvoiceCardProps {
  recurring: RecurringInvoice
  onEdit: () => void
  onDelete: () => void
  onToggleActive: (active: boolean) => void
}

function RecurringInvoiceCard({ recurring, onEdit, onDelete, onToggleActive }: RecurringInvoiceCardProps) {
  const getIntervalLabel = (interval: RecurringInterval, frequency: number) => {
    switch (interval) {
      case "weekly":
        return frequency === 1 ? "Weekly" : `Every ${frequency} weeks`
      case "monthly":
        return frequency === 1 ? "Monthly" : `Every ${frequency} months`
      case "quarterly":
        return "Quarterly"
      case "yearly":
        return "Yearly"
      default:
        return "Custom"
    }
  }

  return (
    <Card className={recurring.active ? "" : "opacity-70"}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{recurring.name}</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Recurring Invoice</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this recurring invoice? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]')
                      if (closeButton instanceof HTMLElement) {
                        closeButton.click()
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      onDelete()
                      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]')
                      if (closeButton instanceof HTMLElement) {
                        closeButton.click()
                      }
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>{recurring.client}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-medium">{recurring.baseInvoice.amount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Frequency</span>
            <span className="font-medium">{getIntervalLabel(recurring.interval, recurring.frequency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Next Invoice</span>
            <span className="font-medium">{format(new Date(recurring.nextInvoiceDate), "MMM d, yyyy")}</span>
          </div>
          {recurring.lastInvoiceDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Invoice</span>
              <span className="font-medium">{format(new Date(recurring.lastInvoiceDate), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch id={`active-${recurring.id}`} checked={recurring.active} onCheckedChange={onToggleActive} />
          <Label htmlFor={`active-${recurring.id}`} className="text-sm">
            {recurring.active ? "Active" : "Paused"}
          </Label>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
