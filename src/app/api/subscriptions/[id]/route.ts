import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import Folder from "@/models/Folder"
import PaymentMethod from "@/models/PaymentMethod"
import {
  requireAuth,
  validateObjectId,
  checkRateLimit,
  validateBody,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
} from "@/lib/api-utils"
import { updateSubscriptionSchema } from "@/lib/validations"

// Ensure models are registered for populate
void Folder
void PaymentMethod

// GET a single subscription
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    const { id } = await params
    const idValidation = validateObjectId(id)
    if (!idValidation.success) {
      return idValidation.response
    }

    const rateLimitResult = checkRateLimit(userId, "api", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    await dbConnect()

    const subscription = await Subscription.findOne({
      _id: id,
      userId, // Security: Only owner can access
    })
      .populate("folderId", "name color")
      .populate("paymentMethodId", "name type lastFour")

    if (!subscription) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    return successResponse(subscription, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// PUT update a subscription
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    const { id } = await params
    const idValidation = validateObjectId(id)
    if (!idValidation.success) {
      return idValidation.response
    }

    const rateLimitResult = checkRateLimit(userId, "update", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Invalid JSON body"))
    }

    // Validate with partial schema (all fields optional for update)
    const validation = validateBody(updateSubscriptionSchema, body)
    if (!validation.success) {
      return validation.response
    }

    const data = validation.data

    await dbConnect()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name.trim()
    if (data.description !== undefined) updateData.description = data.description?.trim()
    if (data.amount !== undefined) updateData.amount = data.amount
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.billingCycle !== undefined) updateData.billingCycle = data.billingCycle
    if (data.nextBillingDate !== undefined) updateData.nextBillingDate = new Date(data.nextBillingDate)
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
    if (data.status !== undefined) updateData.status = data.status
    if (data.category !== undefined) updateData.category = data.category
    if (data.url !== undefined) updateData.url = data.url || undefined
    if (data.logo !== undefined) updateData.logo = data.logo || undefined
    if (data.alertDays !== undefined) updateData.alertDays = data.alertDays
    if (data.folderId !== undefined) updateData.folderId = data.folderId || undefined
    if (data.tagIds !== undefined) updateData.tagIds = data.tagIds
    if (data.paymentMethodId !== undefined) updateData.paymentMethodId = data.paymentMethodId || undefined

    const subscription = await Subscription.findOneAndUpdate(
      { _id: id, userId }, // Security: Only owner can update
      updateData,
      { new: true, runValidators: true }
    )

    if (!subscription) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    return successResponse(subscription, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error updating subscription:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// DELETE a subscription
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    const { id } = await params
    const idValidation = validateObjectId(id)
    if (!idValidation.success) {
      return idValidation.response
    }

    const rateLimitResult = checkRateLimit(userId, "delete", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    await dbConnect()

    const subscription = await Subscription.findOneAndDelete({
      _id: id,
      userId, // Security: Only owner can delete
    })

    if (!subscription) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    return successResponse(
      { message: "Subscription deleted successfully" },
      200,
      rateLimitResult.headers
    )
  } catch (error) {
    console.error("Error deleting subscription:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
