"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, Filter, Plus, ArrowUp, MessageSquare, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Mock data for feature requests
const mockFeatureRequests = [
  {
    id: 1,
    title: "PDF attachment support for invoices",
    description: "Allow attaching PDF files to invoices for additional documentation or terms.",
    category: "Invoicing",
    status: "Under Review",
    votes: 42,
    comments: 8,
    author: "Sarah J.",
    date: "2 days ago",
    hasVoted: false,
  },
  {
    id: 2,
    title: "Bulk client import from CSV",
    description: "Add the ability to import multiple clients at once using a CSV file upload.",
    category: "Client Management",
    status: "Planned",
    votes: 38,
    comments: 5,
    author: "Michael T.",
    date: "5 days ago",
    hasVoted: true,
  },
  {
    id: 3,
    title: "Dark mode support",
    description: "Add a dark mode option for the dashboard to reduce eye strain when working at night.",
    category: "UI/UX",
    status: "In Progress",
    votes: 76,
    comments: 12,
    author: "Alex W.",
    date: "1 week ago",
    hasVoted: false,
  },
  {
    id: 4,
    title: "Mobile app for iOS and Android",
    description: "Create native mobile apps to manage invoices and quotations on the go.",
    category: "Mobile",
    status: "Under Review",
    votes: 95,
    comments: 18,
    author: "Jessica L.",
    date: "2 weeks ago",
    hasVoted: false,
  },
  {
    id: 5,
    title: "Integration with accounting software",
    description: "Add integrations with popular accounting software like QuickBooks and Xero.",
    category: "Integrations",
    status: "Implemented",
    votes: 124,
    comments: 22,
    author: "Robert K.",
    date: "3 weeks ago",
    hasVoted: true,
  },
]

// Status badge colors
const statusColors = {
  "Under Review": "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Planned: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "In Progress": "bg-purple-100 text-purple-800 hover:bg-purple-100",
  Implemented: "bg-green-100 text-green-800 hover:bg-green-100",
  Declined: "bg-red-100 text-red-800 hover:bg-red-100",
}

export default function FeatureRequestsPage() {
  const [featureRequests, setFeatureRequests] = useState(mockFeatureRequests)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    category: "",
  })

  // Handle voting
  const handleVote = (id: number) => {
    setFeatureRequests(
      featureRequests.map((request) => {
        if (request.id === id) {
          return {
            ...request,
            votes: request.hasVoted ? request.votes - 1 : request.votes + 1,
            hasVoted: !request.hasVoted,
          }
        }
        return request
      }),
    )
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!newRequest.title || !newRequest.description || !newRequest.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newFeatureRequest = {
      id: featureRequests.length + 1,
      ...newRequest,
      status: "Under Review",
      votes: 1,
      comments: 0,
      author: "You",
      date: "Just now",
      hasVoted: true,
    }

    setFeatureRequests([newFeatureRequest, ...featureRequests])
    setNewRequest({ title: "", description: "", category: "" })
    setIsDialogOpen(false)

    toast({
      title: "Feature request submitted",
      description: "Your feature request has been submitted successfully.",
    })
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl flex items-center">
                <Lightbulb className="mr-2 h-6 w-6 text-blue-500" />
                Feature Requests
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Submit and vote on features you'd like to see in Quotlyo
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Submit a Feature Request</DialogTitle>
                  <DialogDescription>
                    Share your ideas for improving Quotlyo. Be specific and concise to help us understand your needs.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Feature Title</Label>
                    <Input
                      id="title"
                      placeholder="E.g., PDF attachment support for invoices"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newRequest.category}
                      onValueChange={(value) => setNewRequest({ ...newRequest, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Invoicing">Invoicing</SelectItem>
                        <SelectItem value="Quotations">Quotations</SelectItem>
                        <SelectItem value="Client Management">Client Management</SelectItem>
                        <SelectItem value="Reports">Reports</SelectItem>
                        <SelectItem value="UI/UX">UI/UX</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Integrations">Integrations</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your feature request in detail..."
                      className="min-h-[100px]"
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!newRequest.title || !newRequest.description || !newRequest.category}
                  >
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <div className="mt-6">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="top">Top Voted</TabsTrigger>
                <TabsTrigger value="my">My Requests</TabsTrigger>
                <TabsTrigger value="implemented">Implemented</TabsTrigger>
              </TabsList>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {featureRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex flex-col items-center justify-start p-4 border-r bg-muted/30 w-[80px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex flex-col items-center p-2 ${request.hasVoted ? "text-blue-600" : ""}`}
                          onClick={() => handleVote(request.id)}
                        >
                          <ArrowUp className={`h-5 w-5 ${request.hasVoted ? "fill-blue-600" : ""}`} />
                          <span className="text-sm font-bold mt-1">{request.votes}</span>
                        </Button>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{request.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{request.category}</Badge>
                              <Badge variant="outline" className={statusColors[request.status]}>
                                {request.status === "Implemented" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.author} · {request.date}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
                        <div className="mt-4 flex items-center">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {request.comments} Comments
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="top" className="space-y-4">
              {featureRequests
                .sort((a, b) => b.votes - a.votes)
                .map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="flex flex-col items-center justify-start p-4 border-r bg-muted/30 w-[80px]">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex flex-col items-center p-2 ${request.hasVoted ? "text-blue-600" : ""}`}
                            onClick={() => handleVote(request.id)}
                          >
                            <ArrowUp className={`h-5 w-5 ${request.hasVoted ? "fill-blue-600" : ""}`} />
                            <span className="text-sm font-bold mt-1">{request.votes}</span>
                          </Button>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{request.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{request.category}</Badge>
                                <Badge variant="outline" className={statusColors[request.status]}>
                                  {request.status === "Implemented" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                  {request.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.author} · {request.date}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
                          <div className="mt-4 flex items-center">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              {request.comments} Comments
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              {featureRequests
                .filter((request) => request.author === "You")
                .map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="flex flex-col items-center justify-start p-4 border-r bg-muted/30 w-[80px]">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex flex-col items-center p-2 ${request.hasVoted ? "text-blue-600" : ""}`}
                            onClick={() => handleVote(request.id)}
                          >
                            <ArrowUp className={`h-5 w-5 ${request.hasVoted ? "fill-blue-600" : ""}`} />
                            <span className="text-sm font-bold mt-1">{request.votes}</span>
                          </Button>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{request.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{request.category}</Badge>
                                <Badge variant="outline" className={statusColors[request.status]}>
                                  {request.status === "Implemented" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                  {request.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.author} · {request.date}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
                          <div className="mt-4 flex items-center">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              {request.comments} Comments
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {featureRequests.filter((request) => request.author === "You").length === 0 && (
                <div className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">You haven't submitted any feature requests yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Have an idea for improving Quotlyo? Share it with us and the community!
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="implemented" className="space-y-4">
              {featureRequests
                .filter((request) => request.status === "Implemented")
                .map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="flex flex-col items-center justify-start p-4 border-r bg-muted/30 w-[80px]">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex flex-col items-center p-2 ${request.hasVoted ? "text-blue-600" : ""}`}
                            onClick={() => handleVote(request.id)}
                          >
                            <ArrowUp className={`h-5 w-5 ${request.hasVoted ? "fill-blue-600" : ""}`} />
                            <span className="text-sm font-bold mt-1">{request.votes}</span>
                          </Button>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{request.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{request.category}</Badge>
                                <Badge variant="outline" className={statusColors[request.status]}>
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  {request.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.author} · {request.date}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
                          <div className="mt-4 flex items-center">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              {request.comments} Comments
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {featureRequests.filter((request) => request.status === "Implemented").length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No implemented features yet</h3>
                  <p className="text-muted-foreground">
                    Check back later to see which feature requests have been implemented.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
