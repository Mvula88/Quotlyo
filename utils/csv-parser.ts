export interface CSVParseResult<T> {
  data: T[]
  errors: {
    row: number
    message: string
  }[]
  invalidRows: number[]
}

export function parseCSV<T>(
  csvContent: string,
  headers: string[],
  validator: (row: Record<string, string>, rowIndex: number) => { valid: boolean; errors: string[] },
): CSVParseResult<T> {
  const result: CSVParseResult<T> = {
    data: [],
    errors: [],
    invalidRows: [],
  }

  // Split the CSV content into lines
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== "")

  if (lines.length === 0) {
    result.errors.push({ row: 0, message: "CSV file is empty" })
    return result
  }

  // Parse the header row
  const headerRow = lines[0].split(",").map((header) => header.trim())

  // Validate headers
  const missingHeaders = headers.filter((header) => !headerRow.includes(header))
  if (missingHeaders.length > 0) {
    result.errors.push({
      row: 0,
      message: `Missing required headers: ${missingHeaders.join(", ")}`,
    })
    return result
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const rowIndex = i
    const line = lines[i]
    const values = line.split(",").map((value) => value.trim())

    // Skip empty rows
    if (values.every((value) => value === "")) continue

    // Check if row has correct number of columns
    if (values.length !== headerRow.length) {
      result.errors.push({
        row: rowIndex,
        message: `Row ${rowIndex} has ${values.length} columns, expected ${headerRow.length}`,
      })
      result.invalidRows.push(rowIndex)
      continue
    }

    // Create object from row
    const rowData: Record<string, string> = {}
    headerRow.forEach((header, index) => {
      rowData[header] = values[index]
    })

    // Validate row data
    const validation = validator(rowData, rowIndex)
    if (!validation.valid) {
      validation.errors.forEach((error) => {
        result.errors.push({ row: rowIndex, message: error })
      })
      result.invalidRows.push(rowIndex)
      continue
    }

    // Add valid row to result
    result.data.push(rowData as unknown as T)
  }

  return result
}

export function generateCSVTemplate(headers: string[]): string {
  return headers.join(",")
}
