import dbConnect from "@/lib/mongodb"
import Tag from "@/models/Tag"
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

// GET single tag
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

    const tag = await Tag.findOne({
      _id: id,
      userId,
    })

    if (!tag) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    // Get subscription count
    const subscriptionCount = await Subscription.countDocuments({
      tagIds: id,
      userId,
    })

    return successResponse(
      { ...tag.toObject(), subscriptionCount },
      200,
      { ...cacheHeaders(60), ...rateLimitResult.headers }
    )
  } catch (error) {
    console.error("Error fetching tag:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// PUT update tag
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

    const tag = await Tag.findOneAndUpdate(
      { _id: id, userId },
      { name, color },
      { new: true, runValidators: true },
    )

    if (!tag) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    return successResponse(tag, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error updating tag:", error)
    return handleMongoError(error)
  }
}

// DELETE tag
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

    const tag = await Tag.findOneAndDelete({
      _id: id,
      userId,
    })

    if (!tag) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    // Remove tag from all subscriptions
    await Subscription.updateMany(
      { tagIds: id, userId },
      { $pull: { tagIds: id } },
    )

    return successResponse({ success: true }, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error deleting tag:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
