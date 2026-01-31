import dbConnect from "@/lib/mongodb"
import Folder from "@/models/Folder"
import Subscription from "@/models/Subscription"
import {
  requireAuth,
  checkRateLimit,
  validateObjectId,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
  handleMongoError,
  cacheHeaders,
} from "@/lib/api-utils"

// GET single folder
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    const { id } = await params

    // Validate ObjectId format
    const idValidation = validateObjectId(id)
    if (!idValidation.success) {
      return idValidation.response
    }

    // Rate limiting
    const rateLimitResult = checkRateLimit(userId, "read", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    await dbConnect()

    const folder = await Folder.findOne({
      _id: id,
      userId,
    })

    if (!folder) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    // Get subscription count
    const subscriptionCount = await Subscription.countDocuments({
      folderId: id,
      userId,
    })

    return successResponse(
      { ...folder.toObject(), subscriptionCount },
      200,
      { ...cacheHeaders(60), ...rateLimitResult.headers }
    )
  } catch (error) {
    console.error("Error fetching folder:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// PUT update folder
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    const { id } = await params

    // Validate ObjectId format
    const idValidation = validateObjectId(id)
    if (!idValidation.success) {
      return idValidation.response
    }

    // Rate limiting
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

    await dbConnect()

    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId },
      { name, color },
      { new: true, runValidators: true },
    )

    if (!folder) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    return successResponse(folder, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error updating folder:", error)
    return handleMongoError(error)
  }
}

// DELETE folder
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    const { id } = await params

    // Validate ObjectId format
    const idValidation = validateObjectId(id)
    if (!idValidation.success) {
      return idValidation.response
    }

    // Rate limiting
    const rateLimitResult = checkRateLimit(userId, "write", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    await dbConnect()

    const folder = await Folder.findOneAndDelete({
      _id: id,
      userId,
    })

    if (!folder) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    // Remove folder reference from all subscriptions
    await Subscription.updateMany(
      { folderId: id, userId },
      { $unset: { folderId: "" } },
    )

    return successResponse({ success: true }, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error deleting folder:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
