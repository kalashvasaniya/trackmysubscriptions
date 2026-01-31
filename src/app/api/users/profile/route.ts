import clientPromise from "@/lib/mongodb-client"
import { ObjectId } from "mongodb"
import {
  requireAuth,
  checkRateLimit,
  validateBody,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
  logSecurityEvent,
} from "@/lib/api-utils"
import { updateProfileSchema } from "@/lib/validations"
import { z } from "zod"

// GET current user profile
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    const rateLimitResult = checkRateLimit(userId, "api", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    })

    if (!user) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    return successResponse(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        currency: user.currency || "USD",
        defaultAlertDays: user.defaultAlertDays ?? 3,
        emailAlerts: user.emailAlerts ?? true,
        weeklyDigest: user.weeklyDigest ?? false,
        createdAt: user.createdAt,
      },
      200,
      rateLimitResult.headers
    )
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// PUT update user profile
export async function PUT(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

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

    // Validate request body
    const validation = validateBody(updateProfileSchema, body)
    if (!validation.success) {
      return validation.response
    }

    const data = validation.data

    // Build update object with only provided fields
    const updateFields: Record<string, unknown> = {}

    if (data.name !== undefined) {
      updateFields.name = data.name.trim()
    }

    if (data.currency !== undefined) {
      updateFields.currency = data.currency.toUpperCase()
    }

    if (data.defaultAlertDays !== undefined) {
      updateFields.defaultAlertDays = data.defaultAlertDays
    }

    if (data.emailAlerts !== undefined) {
      updateFields.emailAlerts = data.emailAlerts
    }

    if (data.weeklyDigest !== undefined) {
      updateFields.weeklyDigest = data.weeklyDigest
    }

    if (Object.keys(updateFields).length === 0) {
      return errorResponse(ApiErrors.VALIDATION_ERROR("No fields to update"))
    }

    updateFields.updatedAt = new Date()

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
      { returnDocument: "after" }
    )

    if (!result) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    const user = result

    return successResponse(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        currency: user.currency || "USD",
        defaultAlertDays: user.defaultAlertDays ?? 3,
        emailAlerts: user.emailAlerts ?? true,
        weeklyDigest: user.weeklyDigest ?? false,
      },
      200,
      rateLimitResult.headers
    )
  } catch (error) {
    console.error("Error updating user profile:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// DELETE user account - requires explicit confirmation
const deleteAccountSchema = z.object({
  confirmed: z.literal(true, { message: "You must confirm account deletion" }),
})

export async function DELETE(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    // Rate limit delete operations heavily
    const rateLimitResult = checkRateLimit(userId, "delete", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Invalid JSON body"))
    }

    const validation = validateBody(deleteAccountSchema, body)
    if (!validation.success) {
      return validation.response
    }

    const client = await clientPromise
    const db = client.db()
    const userObjectId = new ObjectId(userId)

    // Verify user exists
    const user = await db.collection("users").findOne({ _id: userObjectId })

    if (!user) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    // Log security event
    logSecurityEvent("account_deletion_initiated", {
      userId,
      email: user.email,
      ip: getClientIp(request),
    })

    // Delete all user data from all collections
    const deleteResults = await Promise.all([
      db.collection("subscriptions").deleteMany({ userId }),
      db.collection("tags").deleteMany({ userId }),
      db.collection("folders").deleteMany({ userId }),
      db.collection("paymentmethods").deleteMany({ userId }),
      db.collection("accounts").deleteMany({ userId: userObjectId }), // OAuth accounts
      db.collection("sessions").deleteMany({ userId: userObjectId }), // Sessions
      db.collection("users").deleteOne({ _id: userObjectId }),
    ])

    logSecurityEvent("account_deletion_completed", {
      userId,
      email: user.email,
      deletedCounts: {
        subscriptions: deleteResults[0].deletedCount,
        tags: deleteResults[1].deletedCount,
        folders: deleteResults[2].deletedCount,
        paymentMethods: deleteResults[3].deletedCount,
      },
    })

    return successResponse({ success: true }, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error deleting user account:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
