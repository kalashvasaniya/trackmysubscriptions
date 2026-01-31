import { NextResponse } from "next/server"
import { auth } from "./auth"
import { rateLimit, getRateLimitKey, rateLimitHeaders, RATE_LIMITS, RateLimitConfig } from "./rate-limit"
import { z } from "zod"

// Standard API error responses
export const ApiErrors = {
  UNAUTHORIZED: { error: "Unauthorized", status: 401 },
  FORBIDDEN: { error: "Forbidden", status: 403 },
  NOT_FOUND: { error: "Resource not found", status: 404 },
  VALIDATION_ERROR: (message: string) => ({ error: message, status: 400 }),
  RATE_LIMITED: { error: "Too many requests. Please try again later.", status: 429 },
  INTERNAL_ERROR: { error: "Internal server error", status: 500 },
} as const

// Create error response
export function errorResponse(
  error: { error: string; status: number },
  headers?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    { error: error.error },
    { status: error.status, headers }
  )
}

// Success response helper
export function successResponse<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): NextResponse {
  return NextResponse.json(data, { status, headers })
}

// Auth check helper
export async function requireAuth(): Promise<
  { success: true; userId: string; session: Awaited<ReturnType<typeof auth>> } |
  { success: false; response: NextResponse }
> {
  const session = await auth()
  
  if (!session?.user?.id) {
    return {
      success: false,
      response: errorResponse(ApiErrors.UNAUTHORIZED),
    }
  }
  
  return {
    success: true,
    userId: session.user.id,
    session,
  }
}

// Rate limit check helper
export function checkRateLimit(
  userId: string | undefined,
  operation: keyof typeof RATE_LIMITS,
  ip?: string
): { success: true; headers: Record<string, string> } | { success: false; response: NextResponse } {
  const config = RATE_LIMITS[operation]
  const key = getRateLimitKey(userId, operation, ip)
  const result = rateLimit(key, config)
  
  if (!result.success) {
    return {
      success: false,
      response: errorResponse(ApiErrors.RATE_LIMITED, rateLimitHeaders(result)),
    }
  }
  
  return {
    success: true,
    headers: rateLimitHeaders(result),
  }
}

// Validation helper
export function validateBody<T extends z.ZodSchema>(
  schema: T,
  body: unknown
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  const result = schema.safeParse(body)
  
  if (!result.success) {
    const message = result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ")
    return {
      success: false,
      response: errorResponse(ApiErrors.VALIDATION_ERROR(message)),
    }
  }
  
  return {
    success: true,
    data: result.data,
  }
}

// Validate ObjectId format
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Validate and get ObjectId from params
export function validateObjectId(
  id: string
): { success: true; id: string } | { success: false; response: NextResponse } {
  if (!isValidObjectId(id)) {
    return {
      success: false,
      response: errorResponse(ApiErrors.VALIDATION_ERROR("Invalid ID format")),
    }
  }
  return { success: true, id }
}

// Log security events (for production, integrate with logging service)
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") {
    // In production, send to logging service
    console.log(JSON.stringify({
      type: "security",
      event,
      timestamp: new Date().toISOString(),
      ...details,
    }))
  } else {
    console.log(`[Security] ${event}:`, details)
  }
}

// Sanitize error messages for client (don't leak internal details)
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose stack traces or internal error messages
    const safeMessages = [
      "not found",
      "unauthorized",
      "forbidden",
      "validation",
      "invalid",
    ]
    const message = error.message.toLowerCase()
    if (safeMessages.some((safe) => message.includes(safe))) {
      return error.message
    }
  }
  return "An error occurred"
}

// Get client IP from request (for rate limiting)
export function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return request.headers.get("x-real-ip") || undefined
}
