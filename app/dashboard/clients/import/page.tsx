"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Download, FileText, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseCSV, generateCSVTemplate } from "@/utils/csv-parser"
import { toast } from "@/components/ui/use-toast"

// Define the client data structure
interface ClientData {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  status: string
}

// Required headers for the CSV file
const REQUIRED_HEADERS = [
  "firstName",
  "lastName",
  "company",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "zip",
  "country",
  "status",
]

// Sample data for the template
const SAMPLE_DATA = [
  "John,Doe,Acme Inc,john@acmeinc.com,(555) 123-4567,123 Main St,New York,NY,10001,US,active",
  "Jane,Smith,Globex Corp,jane@globexcorp.com,(555) 987-6543,456 Park Ave,San Francisco,CA,94107,US,active",
]

export default function ImportClientsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<{
    data: ClientData[]
    errors: { row: number; message: string }[]
    invalidRows: number[]
  } | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    imported: number
    failed: number
    message: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setParseResult(null)
    setImportResult(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const csvContent = event.target?.result as string

      // Parse and validate the CSV content
      const result = parseCSV<ClientData>(csvContent, REQUIRED_HEADERS, validateClientRow)

      setParseResult(result)
    }

    reader.readAsText(selectedFile)
  }

  const validateClientRow = (row: Record<string, string>, rowIndex: number) => {
    const errors: string[] = []

    // Validate email format
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push(`Row ${rowIndex}: Invalid email format`)
    }

    // Validate status
    if (row.status && !["active", "inactive", "prospect"].includes(row.status.toLowerCase())) {
      errors.push(`Row ${rowIndex}: Status must be one of: active, inactive, prospect`)
    }

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email"]
    requiredFields.forEach((field) => {
      if (!row[field] || row[field].trim() === "") {
        errors.push(`Row ${rowIndex}: ${field} is required`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  const handleImport = () => {
    // In a real app, this would process the CSV and import clients
    toast({
      title: "Clients imported",
      description: `${parseResult?.data.length} clients have been imported successfully.`,
    })

    // Redirect to clients list after a short delay
    setTimeout(() => {
      window.location.href = "/dashboard/clients"
    }, 1500)
  }

  const downloadTemplate = () => {
    const template = generateCSVTemplate(REQUIRED_HEADERS) + "\n" + SAMPLE_DATA.join("\n")
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "client_import_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setFile(null)
    setParseResult(null)
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Import Clients</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/clients">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Clients
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Client Import</CardTitle>
            <CardDescription>Import multiple clients at once using a CSV file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!importResult ? (
              <>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importing}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {file ? "Change File" : "Select CSV File"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={downloadTemplate} disabled={importing}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {file && (
                      <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={resetImport}
                          disabled={importing}
                          className="ml-auto h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {parseResult && (
                    <div className="space-y-4">
                      <Tabs defaultValue="preview">
                        <TabsList>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                          <TabsTrigger value="errors" disabled={parseResult.errors.length === 0}>
                            Errors {parseResult.errors.length > 0 && `(${parseResult.errors.length})`}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="space-y-4">
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>First Name</TableHead>
                                  <TableHead>Last Name</TableHead>
                                  <TableHead>Company</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {parseResult.data.length > 0 ? (
                                  parseResult.data.slice(0, 5).map((client, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{client.firstName}</TableCell>
                                      <TableCell>{client.lastName}</TableCell>
                                      <TableCell>{client.company}</TableCell>
                                      <TableCell>{client.email}</TableCell>
                                      <TableCell>{client.phone}</TableCell>
                                      <TableCell>
                                        <Badge variant={client.status === "active" ? "default" : "secondary"}>
                                          {client.status}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                      No valid data found in the CSV file.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>

                          {parseResult.data.length > 5 && (
                            <p className="text-sm text-muted-foreground">
                              Showing 5 of {parseResult.data.length} clients
                            </p>
                          )}

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">{parseResult.data.length}</span> valid clients ready to
                                import
                              </p>
                              {parseResult.errors.length > 0 && (
                                <p className="text-sm text-destructive">
                                  <span className="font-medium">{parseResult.errors.length}</span> errors found
                                </p>
                              )}
                            </div>

                            <Button onClick={handleImport} disabled={parseResult.data.length === 0 || importing}>
                              {importing ? "Importing..." : "Import Clients"}
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="errors">
                          {parseResult.errors.length > 0 ? (
                            <div className="space-y-2">
                              {parseResult.errors.map((error, index) => (
                                <Alert key={index} variant="destructive">
                                  <AlertTitle>Error in row {error.row}</AlertTitle>
                                  <AlertDescription>{error.message}</AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          ) : (
                            <Alert>
                              <Check className="h-4 w-4" />
                              <AlertTitle>No errors found</AlertTitle>
                              <AlertDescription>Your CSV file is valid and ready to import.</AlertDescription>
                            </Alert>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>

                <div className="rounded-md border p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">CSV Format Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>The first row must contain headers</li>
                    <li>Required columns: firstName, lastName, email</li>
                    <li>Status must be one of: active, inactive, prospect</li>
                    <li>Email addresses must be valid</li>
                    <li>Download the template for the correct format</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Alert variant={importResult.success ? "default" : "destructive"}>
                  <Check className="h-4 w-4" />
                  <AlertTitle>Import Complete</AlertTitle>
                  <AlertDescription>{importResult.message}</AlertDescription>
                </Alert>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center p-2 rounded-md border bg-muted/30">
                    <span>Successfully imported</span>
                    <Badge variant="default">{importResult.imported}</Badge>
                  </div>
                  {importResult.failed > 0 && (
                    <div className="flex justify-between items-center p-2 rounded-md border bg-muted/30">
                      <span>Failed to import</span>
                      <Badge variant="destructive">{importResult.failed}</Badge>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetImport}>
                    Import Another File
                  </Button>
                  <Link href="/dashboard/clients">
                    <Button>Go to Clients</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/30 flex justify-between">
            <p className="text-sm text-muted-foreground">
              Need help? Check out our{" "}
              <Link href="#" className="underline">
                documentation
              </Link>{" "}
              on importing clients.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
