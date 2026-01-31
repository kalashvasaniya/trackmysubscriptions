import { z } from "zod"

// Common validators
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")

export const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format")

export const urlSchema = z.string().url().optional().or(z.literal(""))

export const currencyCodeSchema = z.string().length(3).toUpperCase()

// Subscription schemas
export const billingCycleSchema = z.enum(["weekly", "monthly", "quarterly", "yearly"])

export const subscriptionStatusSchema = z.enum(["active", "trial", "paused", "cancelled"])

export const categorySchema = z.enum([
  "Entertainment",
  "Music",
  "Development",
  "Design",
  "Cloud",
  "Productivity",
  "Finance",
  "Health",
  "Education",
  "Other",
])

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount too large"),
  currency: currencyCodeSchema,
  billingCycle: billingCycleSchema,
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  nextBillingDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  status: subscriptionStatusSchema.default("active"),
  category: categorySchema.optional(),
  description: z.string().max(500, "Description too long").optional(),
  url: urlSchema,
  logo: urlSchema,
  alertDays: z.number().int().min(0).max(30).optional(),
  folderId: objectIdSchema.optional().nullable(),
  tagIds: z.array(objectIdSchema).max(10).optional(),
  paymentMethodId: objectIdSchema.optional().nullable(),
})

export const updateSubscriptionSchema = createSubscriptionSchema.partial()

// Folder schemas
export const createFolderSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long").trim(),
  color: hexColorSchema,
})

export const updateFolderSchema = createFolderSchema.partial()

// Tag schemas
export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name too long").trim(),
  color: hexColorSchema,
})

export const updateTagSchema = createTagSchema.partial()

// Payment Method schemas
export const paymentMethodTypeSchema = z.enum([
  "credit_card",
  "debit_card",
  "paypal",
  "bank_account",
  "other",
])

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long").trim(),
  type: paymentMethodTypeSchema,
  lastFour: z.string().regex(/^\d{4}$/, "Must be 4 digits").optional().nullable(),
})

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial()

// User profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  currency: currencyCodeSchema.optional(),
  defaultAlertDays: z.number().int().min(1).max(30).optional(),
  emailAlerts: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
})

// Alert schemas
export const sendAlertSchema = z.object({
  subscriptionId: objectIdSchema,
})

// Import validation
export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_IMPORT_ROWS = 500

// Validation helper
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      return { success: false, error: message }
    }
    return { success: false, error: "Validation failed" }
  }
}

// Sanitization helpers
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}
