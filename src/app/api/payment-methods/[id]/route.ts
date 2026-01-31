import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import PaymentMethod from "@/models/PaymentMethod"
import Subscription from "@/models/Subscription"
import { NextResponse } from "next/server"

// GET single payment method
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await dbConnect()

    const paymentMethod = await PaymentMethod.findOne({
      _id: id,
      userId: session.user.id,
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 },
      )
    }

    // Get subscription count
    const subscriptionCount = await Subscription.countDocuments({
      paymentMethodId: id,
      userId: session.user.id,
    })

    return NextResponse.json({
      ...paymentMethod.toObject(),
      subscriptionCount,
    })
  } catch (error) {
    console.error("Error fetching payment method:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// PUT update payment method
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { name, type, lastFour } = await request.json()

    await dbConnect()

    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name, type, lastFour },
      { new: true, runValidators: true },
    )

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(paymentMethod)
  } catch (error) {
    console.error("Error updating payment method:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// DELETE payment method
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await dbConnect()

    const paymentMethod = await PaymentMethod.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 },
      )
    }

    // Remove payment method reference from all subscriptions
    await Subscription.updateMany(
      { paymentMethodId: id, userId: session.user.id },
      { $unset: { paymentMethodId: "" } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
