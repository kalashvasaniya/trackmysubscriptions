import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

// Check user's payment/access status (one-time purchase model)
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

    const payment = await db?.collection("payments").findOne({
      email: session.user.email,
    })

    if (!payment) {
      return NextResponse.json({
        isPro: false,
        status: "free",
        plan: "free",
      })
    }

    return NextResponse.json({
      isPro: payment.status === "active" && payment.plan === "lifetime",
      status: payment.status,
      plan: payment.plan,
      paidAt: payment.paidAt,
      paymentId: payment.paymentId,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
