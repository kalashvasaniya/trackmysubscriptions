import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import User from "@/models/User"
import { sendSubscriptionAlert } from "@/lib/email"

// This endpoint can be called by a cron job (e.g., Vercel Cron, GitHub Actions, or external service)
// Add ?secret=YOUR_CRON_SECRET to verify the request
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const now = new Date()
    const alerts: Array<{
      userId: string
      subscriptionId: string
      email: string
      status: string
    }> = []

    // Find all active subscriptions with alerts enabled
    const subscriptions = await Subscription.find({
      status: "active",
      alertEnabled: true,
    }).populate("userId")

    for (const subscription of subscriptions) {
      const nextBillingDate = new Date(subscription.nextBillingDate)
      const daysUntil = Math.ceil(
        (nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )

      // Check if we should send an alert based on alertDays setting
      if (daysUntil === subscription.alertDays || daysUntil === 1 || daysUntil === 0) {
        // Get user email
        const user = await User.findById(subscription.userId)

        // Skip if user has disabled email alerts
        if (user && user.email && user.emailAlerts !== false) {
          try {
            const result = await sendSubscriptionAlert(user.email, {
              subscriptionName: subscription.name,
              amount: subscription.amount,
              currency: subscription.currency,
              billingDate: nextBillingDate,
              daysUntil,
              userName: user.name,
            })

            alerts.push({
              userId: subscription.userId.toString(),
              subscriptionId: subscription._id.toString(),
              email: user.email,
              status: result.success ? "sent" : "failed",
            })
          } catch (error) {
            console.error(
              `Failed to send alert for subscription ${subscription._id}:`,
              error,
            )
            alerts.push({
              userId: subscription.userId.toString(),
              subscriptionId: subscription._id.toString(),
              email: user.email,
              status: "error",
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      alertsSent: alerts.filter((a) => a.status === "sent").length,
      alertsFailed: alerts.filter((a) => a.status !== "sent").length,
      details: alerts,
    })
  } catch (error) {
    console.error("Error sending subscription alerts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// POST endpoint for manually triggering alerts for a specific user
export async function POST(request: Request) {
  try {
    const { userId, subscriptionId } = await request.json()

    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: "userId and subscriptionId are required" },
        { status: 400 },
      )
    }

    await dbConnect()

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId,
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      )
    }

    const user = await User.findById(userId)

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User not found or no email" },
        { status: 404 },
      )
    }

    // Check if user has disabled email alerts
    if (user.emailAlerts === false) {
      return NextResponse.json(
        { error: "Email alerts are disabled for this user" },
        { status: 400 },
      )
    }

    const nextBillingDate = new Date(subscription.nextBillingDate)
    const now = new Date()
    const daysUntil = Math.ceil(
      (nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    )

    const result = await sendSubscriptionAlert(user.email, {
      subscriptionName: subscription.name,
      amount: subscription.amount,
      currency: subscription.currency,
      billingDate: nextBillingDate,
      daysUntil: Math.max(0, daysUntil),
      userName: user.name,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error sending manual alert:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
