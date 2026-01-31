import dbConnect from "@/lib/mongodb"
import Tag from "@/models/Tag"
import {
  requireAuth,
  checkRateLimit,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
  handleMongoError,
  cacheHeaders,
} from "@/lib/api-utils"

// GET all tags for the current user
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

    const tags = await Tag.find({ userId }).sort({ name: 1 })

    // Return with cache headers (60 seconds) and rate limit headers
    return successResponse(tags, 200, {
      ...cacheHeaders(60),
      ...rateLimitResult.headers,
    })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// POST create a new tag
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

    const { name, color } = body as { name?: string; color?: string }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Tag name is required"))
    }

    await dbConnect()

    const tag = await Tag.create({
      name: name.trim(),
      color: color || "#6B7280",
      userId,
    })

    return successResponse(tag, 201, rateLimitResult.headers)
  } catch (error) {
    console.error("Error creating tag:", error)
    return handleMongoError(error)
  }
}
