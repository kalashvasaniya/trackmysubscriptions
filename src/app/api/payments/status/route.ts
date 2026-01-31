import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

// Check user's subscription status
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    await dbConnect()
    const db = mongoose.connection.db

    const subscription = await db?.collection("subscriptions_billing").findOne({
      email: session.user.email,
    })

    if (!subscription) {
      return NextResponse.json({
        isPro: false,
        status: "free",
        plan: "free",
      })
    }

    return NextResponse.json({
      isPro: subscription.status === "active" && subscription.plan === "pro",
      status: subscription.status,
      plan: subscription.plan,
      paidAt: subscription.paidAt,
      subscriptionId: subscription.subscriptionId,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
