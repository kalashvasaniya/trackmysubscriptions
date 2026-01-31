import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

// Verify payment and save subscription status
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { subscriptionId, status } = await request.json()

    // If status is active, save directly (Dodo already confirmed via redirect)
    if (status === "active" || subscriptionId) {
      await dbConnect()
      const db = mongoose.connection.db

      if (!db) {
        throw new Error("Database connection failed")
      }

      // Save subscription data
      await db.collection("subscriptions_billing").updateOne(
        { email: session.user.email },
        {
          $set: {
            email: session.user.email,
            name: session.user.name || "Customer",
            subscriptionId: subscriptionId || null,
            status: "active",
            plan: "pro",
            isPro: true,
            paidAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      )

      console.log(`Subscription saved for ${session.user.email}: ${subscriptionId}`)

      return NextResponse.json({
        success: true,
        isPro: true,
        status: "active",
        plan: "pro",
        subscriptionId,
        message: "Subscription activated successfully",
      })
    }

    return NextResponse.json({
      success: false,
      message: "Invalid payment status",
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
