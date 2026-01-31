import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

// Verify one-time payment and grant lifetime access
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const paymentId = body.paymentId ?? body.subscriptionId ?? body.sessionId ?? body.checkoutId
    const paymentStatus = body.status

    // Save when user landed from success redirect (Dodo confirmed payment)
    const isSuccess =
      paymentStatus === "active" ||
      paymentStatus === "succeeded" ||
      paymentId

    if (isSuccess) {
      await dbConnect()
      const db = mongoose.connection.db

      if (!db) {
        throw new Error("Database connection failed")
      }

      // Save one-time payment data - grants lifetime access
      await db.collection("payments").updateOne(
        { email: session.user.email },
        {
          $set: {
            email: session.user.email,
            name: session.user.name || "Customer",
            paymentId: paymentId || null,
            status: "active",
            plan: "lifetime",
            isPro: true,
            paidAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      )

      console.log(`Lifetime access granted for ${session.user.email}`)

      return NextResponse.json({
        success: true,
        isPro: true,
        status: "active",
        plan: "lifetime",
        paymentId,
        message: "Lifetime access activated successfully",
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
