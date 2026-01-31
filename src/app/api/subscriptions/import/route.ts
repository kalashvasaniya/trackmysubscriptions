import { parseCSV } from "@/lib/csv"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import {
  requireAuth,
  checkRateLimit,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
  logSecurityEvent,
} from "@/lib/api-utils"
import { MAX_IMPORT_FILE_SIZE, MAX_IMPORT_ROWS } from "@/lib/validations"

// Allowed MIME types for CSV files
const ALLOWED_MIME_TYPES = [
  "text/csv",
  "text/plain",
  "application/csv",
  "application/vnd.ms-excel",
]

export async function POST(request: Request) {
  try {
    // Authentication
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    // Strict rate limiting for imports
    const rateLimitResult = checkRateLimit(userId, "import", getClientIp(request))
    if (!rateLimitResult.success) {
      logSecurityEvent("import_rate_limit", { userId })
      return rateLimitResult.response
    }

    // Parse form data
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Invalid form data"))
    }

    const file = formData.get("file") as File | null

    if (!file) {
      return errorResponse(ApiErrors.VALIDATION_ERROR("No file provided"))
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.endsWith(".csv")) {
      logSecurityEvent("invalid_import_file_type", { userId, fileType: file.type })
      return errorResponse(ApiErrors.VALIDATION_ERROR("Only CSV files are allowed"))
    }

    // Validate file size
    if (file.size > MAX_IMPORT_FILE_SIZE) {
      logSecurityEvent("import_file_too_large", { userId, fileSize: file.size })
      return errorResponse(
        ApiErrors.VALIDATION_ERROR(
          `File too large. Maximum size is ${MAX_IMPORT_FILE_SIZE / 1024 / 1024}MB`
        )
      )
    }

    // Read file content
    let csvContent: string
    try {
      csvContent = await file.text()
    } catch {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Failed to read file"))
    }

    // Check for empty file
    if (!csvContent.trim()) {
      return errorResponse(ApiErrors.VALIDATION_ERROR("File is empty"))
    }

    // Parse CSV with try-catch for malformed files
    let parsedSubscriptions: ReturnType<typeof parseCSV>
    try {
      parsedSubscriptions = parseCSV(csvContent)
    } catch (parseError) {
      logSecurityEvent("csv_parse_error", { userId, error: String(parseError) })
      return errorResponse(
        ApiErrors.VALIDATION_ERROR("Failed to parse CSV. Please check the format.")
      )
    }

    if (parsedSubscriptions.length === 0) {
      return errorResponse(
        ApiErrors.VALIDATION_ERROR("No valid subscriptions found in CSV")
      )
    }

    // Enforce row limit
    if (parsedSubscriptions.length > MAX_IMPORT_ROWS) {
      logSecurityEvent("import_row_limit_exceeded", {
        userId,
        rows: parsedSubscriptions.length,
      })
      return errorResponse(
        ApiErrors.VALIDATION_ERROR(
          `Too many rows. Maximum is ${MAX_IMPORT_ROWS} subscriptions per import.`
        )
      )
    }

    await dbConnect()

    // Validate and sanitize each subscription
    const subscriptionsToCreate = parsedSubscriptions.map((sub) => {
      // Sanitize string fields
      const sanitizedName = sub.name?.trim().slice(0, 100) || "Unnamed"
      const sanitizedDescription = sub.description?.trim().slice(0, 500)
      
      // Validate amount
      const amount = typeof sub.amount === "number" && sub.amount > 0 
        ? Math.min(sub.amount, 1000000) 
        : 0

      // Validate dates
      const nextBillingDate = new Date(sub.nextBillingDate)
      const startDate = sub.startDate ? new Date(sub.startDate) : new Date()
      
      // Validate billing cycle
      const validCycles = ["weekly", "monthly", "quarterly", "yearly"]
      const billingCycle = validCycles.includes(sub.billingCycle) 
        ? sub.billingCycle 
        : "monthly"

      // Validate status
      const validStatuses = ["active", "trial", "paused", "cancelled"]
      const status = validStatuses.includes(sub.status) ? sub.status : "active"

      return {
        name: sanitizedName,
        description: sanitizedDescription,
        amount,
        currency: sub.currency?.toUpperCase().slice(0, 3) || "USD",
        billingCycle,
        nextBillingDate: isNaN(nextBillingDate.getTime()) ? new Date() : nextBillingDate,
        startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
        status,
        category: sub.category?.trim().slice(0, 50),
        alertDays: typeof sub.alertDays === "number" ? Math.min(Math.max(sub.alertDays, 0), 30) : 3,
        alertEnabled: true,
        userId,
      }
    }).filter(sub => sub.amount > 0) // Remove invalid entries

    if (subscriptionsToCreate.length === 0) {
      return errorResponse(
        ApiErrors.VALIDATION_ERROR("No valid subscriptions to import after validation")
      )
    }

    const createdSubscriptions = await Subscription.insertMany(subscriptionsToCreate)

    logSecurityEvent("successful_import", {
      userId,
      count: createdSubscriptions.length,
    })

    return successResponse(
      {
        message: `Successfully imported ${createdSubscriptions.length} subscriptions`,
        count: createdSubscriptions.length,
        skipped: parsedSubscriptions.length - createdSubscriptions.length,
      },
      201,
      rateLimitResult.headers
    )
  } catch (error) {
    console.error("Error importing subscriptions:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
