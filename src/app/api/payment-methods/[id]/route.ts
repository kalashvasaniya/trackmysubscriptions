import dbConnect from "@/lib/mongodb"
import PaymentMethod from "@/models/PaymentMethod"
import Subscription from "@/models/Subscription"
import {
  requireAuth,
  checkRateLimit,
  validateObjectId,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
  cacheHeaders,
} from "@/lib/api-utils"

// GET single payment method
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

    const paymentMethod = await PaymentMethod.findOne({
      _id: id,
      userId,
    })

    if (!paymentMethod) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    // Get subscription count
    const subscriptionCount = await Subscription.countDocuments({
      paymentMethodId: id,
      userId,
    })

    return successResponse(
      { ...paymentMethod.toObject(), subscriptionCount },
      200,
      { ...cacheHeaders(60), ...rateLimitResult.headers }
    )
  } catch (error) {
    console.error("Error fetching payment method:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// PUT update payment method
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

    const { name, type, lastFour } = body as { 
      name?: string
      type?: string
      lastFour?: string 
    }

    await dbConnect()

    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: id, userId },
      { name, type, lastFour },
      { new: true, runValidators: true },
    )

    if (!paymentMethod) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    return successResponse(paymentMethod, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error updating payment method:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// DELETE payment method
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

    const paymentMethod = await PaymentMethod.findOneAndDelete({
      _id: id,
      userId,
    })

    if (!paymentMethod) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    // Remove payment method reference from all subscriptions
    await Subscription.updateMany(
      { paymentMethodId: id, userId },
      { $unset: { paymentMethodId: "" } },
    )

    return successResponse({ success: true }, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
