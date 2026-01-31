import dbConnect from "@/lib/mongodb"
import PaymentMethod from "@/models/PaymentMethod"
import {
  requireAuth,
  checkRateLimit,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
  cacheHeaders,
} from "@/lib/api-utils"

// GET all payment methods for the current user
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    // Rate limiting for read operations
    const rateLimitResult = checkRateLimit(userId, "read", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    await dbConnect()

    const paymentMethods = await PaymentMethod.find({ userId }).sort({ name: 1 })

    // Return with cache headers (60 seconds) and rate limit headers
    return successResponse(paymentMethods, 200, {
      ...cacheHeaders(60),
      ...rateLimitResult.headers,
    })
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// POST create a new payment method
export async function POST(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    // Rate limiting for write operations
    const rateLimitResult = checkRateLimit(userId, "write", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Invalid JSON body"))
    }

    const { name, type, lastFour } = body as { 
      name?: string
      type?: string
      lastFour?: string 
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Name is required"))
    }

    if (!type || typeof type !== "string" || type.trim().length === 0) {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Type is required"))
    }

    await dbConnect()

    const paymentMethod = await PaymentMethod.create({
      name: name.trim(),
      type: type.trim(),
      lastFour,
      userId,
    })

    return successResponse(paymentMethod, 201, rateLimitResult.headers)
  } catch (error) {
    console.error("Error creating payment method:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
