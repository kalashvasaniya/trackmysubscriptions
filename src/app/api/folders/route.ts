import dbConnect from "@/lib/mongodb"
import Folder from "@/models/Folder"
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

// GET all folders for the current user
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

    const folders = await Folder.find({ userId }).sort({ name: 1 })

    // Return with cache headers (60 seconds) and rate limit headers
    return successResponse(folders, 200, {
      ...cacheHeaders(60),
      ...rateLimitResult.headers,
    })
  } catch (error) {
    console.error("Error fetching folders:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// POST create a new folder
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
      return errorResponse(ApiErrors.VALIDATION_ERROR("Folder name is required"))
    }

    await dbConnect()

    const folder = await Folder.create({
      name: name.trim(),
      color: color || "#3B82F6",
      userId,
    })

    return successResponse(folder, 201, rateLimitResult.headers)
  } catch (error) {
    console.error("Error creating folder:", error)
    return handleMongoError(error)
  }
}
