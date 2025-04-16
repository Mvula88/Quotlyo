"use client"

import { type ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
  initialFile?: string | null
}

export function FileUpload({ onFileChange, accept = ".pdf", maxSize = 5, initialFile = null }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(initialFile)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      setError(null)
      onFileChange(null)
      return
    }

    // Check file type
    if (accept && !selectedFile.type.includes("pdf")) {
      setError("Only PDF files are allowed")
      return
    }

    // Check file size
    if (maxSize && selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setFile(selectedFile)
    setError(null)

    // Create preview URL for PDF
    const fileUrl = URL.createObjectURL(selectedFile)
    setPreview(fileUrl)

    onFileChange(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    onFileChange(null)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="border-premium-100 hover:bg-premium-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </Button>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <input id="file-upload" type="file" accept={accept} onChange={handleFileChange} className="hidden" />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {preview && (
        <div className="flex items-center gap-2 p-2 rounded-md border border-premium-100 bg-premium-50/30 dark:border-gray-700 dark:bg-gray-800/30">
          <FileText className="h-5 w-5 text-premium-600 dark:text-premium-400" />
          <span className="text-sm truncate">{file?.name || "Attached PDF"}</span>
          <a
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-premium-600 hover:text-premium-800 dark:text-premium-400 dark:hover:text-premium-300"
          >
            Preview
          </a>
        </div>
      )}
    </div>
  )
}
