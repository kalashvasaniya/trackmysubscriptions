import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import clientPromise from "@/lib/mongodb-client"
import { ObjectId } from "mongodb"
import { sendSubscriptionAlert } from "@/lib/email"
import { auth } from "@/lib/auth"
import {
  requireAuth,
  validateObjectId,
  checkRateLimit,
  errorResponse,
  successResponse,
  ApiErrors,
  logSecurityEvent,
  getClientIp,
} from "@/lib/api-utils"
import { sendAlertSchema } from "@/lib/validations"

// Helper function to calculate days until a date (using date only, ignoring time)
function calculateDaysUntil(targetDate: Date): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  )
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// GET - Cron job endpoint (called by Vercel Cron or external scheduler)
// Uses header-based authentication instead of query params for security
export async function GET(request: Request) {
  try {
    // Verify cron secret via Authorization header (more secure than query param)
    const authHeader = request.headers.get("authorization")
    const querySecret = new URL(request.url).searchParams.get("secret")
    const cronSecret = process.env.CRON_SECRET

    // Check both header and query param for backward compatibility
    const providedSecret = authHeader?.replace("Bearer ", "") || querySecret

    if (!cronSecret || providedSecret !== cronSecret) {
      logSecurityEvent("unauthorized_cron_access", {
        ip: getClientIp(request),
        hasAuthHeader: !!authHeader,
        hasQuerySecret: !!querySecret,
      })
      return errorResponse(ApiErrors.UNAUTHORIZED)
    }

    await dbConnect()

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split("T")[0]

    const alerts: Array<{
      userId: string
      subscriptionId: string
      email: string
      status: string
      daysUntil: number
    }> = []

    const subscriptions = await Subscription.find({
      status: "active",
      alertEnabled: true,
    }).lean()

    for (const subscription of subscriptions) {
      const nextBillingDate = new Date(subscription.nextBillingDate)
      const daysUntil = calculateDaysUntil(nextBillingDate)

      if (daysUntil < 0) continue

      const shouldSendAlert =
        daysUntil === subscription.alertDays ||
        daysUntil === 1 ||
        daysUntil === 0

      if (!shouldSendAlert) continue

      const lastAlertSent = (subscription as { lastAlertSent?: Date }).lastAlertSent
      const lastAlertDate = lastAlertSent
        ? new Date(lastAlertSent).toISOString().split("T")[0]
        : null

      if (lastAlertDate === todayStr) continue

      const userId = subscription.userId.toString()
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
      })

      if (!user || !user.email || user.emailAlerts === false) continue

      try {
        const result = await sendSubscriptionAlert(user.email, {
          subscriptionName: subscription.name,
          amount: subscription.amount,
          currency: subscription.currency,
          billingDate: nextBillingDate,
          daysUntil,
          userName: user.name,
        })

        if (result.success) {
          await Subscription.findByIdAndUpdate(subscription._id, {
            lastAlertSent: new Date(),
          })
        }

        alerts.push({
          userId,
          subscriptionId: subscription._id.toString(),
          email: user.email,
          status: result.success ? "sent" : "failed",
          daysUntil,
        })
      } catch (error) {
        console.error(`Failed to send alert for subscription ${subscription._id}:`, error)
        alerts.push({
          userId,
          subscriptionId: subscription._id.toString(),
          email: user.email,
          status: "error",
          daysUntil,
        })
      }
    }

    return successResponse({
      success: true,
      alertsSent: alerts.filter((a) => a.status === "sent").length,
      alertsFailed: alerts.filter((a) => a.status !== "sent").length,
      details: alerts,
    })
  } catch (error) {
    console.error("Error sending subscription alerts:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// POST - Manual alert trigger (authenticated users only)
export async function POST(request: Request) {
  try {
    // Require authentication
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    // Rate limiting
    const rateLimitResult = checkRateLimit(userId, "email", getClientIp(request))
    if (!rateLimitResult.success) {
      logSecurityEvent("rate_limit_exceeded", { userId, operation: "manual_alert" })
      return rateLimitResult.response
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Invalid JSON body"))
    }

    const validation = sendAlertSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(
        ApiErrors.VALIDATION_ERROR(
          validation.error.issues.map((e) => e.message).join(", ")
        )
      )
    }

    const { subscriptionId } = validation.data

    // Validate ObjectId format
    const idValidation = validateObjectId(subscriptionId)
    if (!idValidation.success) {
      return idValidation.response
    }

    await dbConnect()

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    // CRITICAL: Only allow users to trigger alerts for their OWN subscriptions
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId, // Security: Must match authenticated user
    })

    if (!subscription) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    })

    if (!user || !user.email) {
      return errorResponse(ApiErrors.NOT_FOUND)
    }

    if (user.emailAlerts === false) {
      return errorResponse(
        ApiErrors.VALIDATION_ERROR("Email alerts are disabled in your settings")
      )
    }

    const nextBillingDate = new Date(subscription.nextBillingDate)
    const daysUntil = calculateDaysUntil(nextBillingDate)

    const result = await sendSubscriptionAlert(user.email, {
      subscriptionName: subscription.name,
      amount: subscription.amount,
      currency: subscription.currency,
      billingDate: nextBillingDate,
      daysUntil: Math.max(0, daysUntil),
      userName: user.name,
    })

    if (result.success) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        lastAlertSent: new Date(),
      })
    }

    return successResponse(result, 200, rateLimitResult.headers)
  } catch (error) {
    console.error("Error sending manual alert:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
