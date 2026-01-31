import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import PaymentMethod from "@/models/PaymentMethod"
import { NextResponse } from "next/server"

// GET all payment methods for the current user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const paymentMethods = await PaymentMethod.find({
      userId: session.user.id,
    }).sort({ name: 1 })

    return NextResponse.json(paymentMethods)
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// POST create a new payment method
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, type, lastFour } = await request.json()

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 },
      )
    }

    await dbConnect()

    const paymentMethod = await PaymentMethod.create({
      name,
      type,
      lastFour,
      userId: session.user.id,
    })

    return NextResponse.json(paymentMethod, { status: 201 })
  } catch (error) {
    console.error("Error creating payment method:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
