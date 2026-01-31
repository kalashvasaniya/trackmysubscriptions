import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

// Check payment status from database (webhook sets the actual status)
export async function POST(request: NextRequest) {
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

    if (!db) {
      throw new Error("Database connection failed")
    }

    // Check if payment was confirmed by webhook
    const payment = await db.collection("payments").findOne({
      email: session.user.email,
      status: "active",
      plan: "lifetime",
    })

    if (payment) {
      return NextResponse.json({
        success: true,
        isPro: true,
        status: "active",
        plan: "lifetime",
        message: "Lifetime access confirmed",
      })
    }

    // Payment not yet confirmed by webhook - tell user to wait
    return NextResponse.json({
      success: false,
      isPro: false,
      status: "pending",
      message: "Payment is being processed. Please wait a moment.",
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
