import { auth } from "@/lib/auth"
import { sendSubscriptionAlert } from "@/lib/email"
import clientPromise from "@/lib/mongodb-client"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

// POST - Send a test alert email to the current user
export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    })

    // Check if email alerts are enabled
    if (user?.emailAlerts === false) {
      return NextResponse.json(
        { error: "Email alerts are disabled. Enable them in Settings first." },
        { status: 400 },
      )
    }

    // Send a test alert
    const result = await sendSubscriptionAlert(session.user.email, {
      subscriptionName: "Test Subscription (Netflix)",
      amount: 15.99,
      currency: user?.currency || "USD",
      billingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      daysUntil: 3,
      userName: session.user.name || undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send test email", details: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${session.user.email}`,
      data: result.data,
    })
  } catch (error) {
    console.error("Error sending test alert:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    )
  }
}
