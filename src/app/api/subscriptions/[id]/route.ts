import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

// GET a single subscription
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid subscription ID" },
        { status: 400 },
      )
    }

    await dbConnect()

    const subscription = await Subscription.findOne({
      _id: id,
      userId: session.user.id,
    })
      .populate("folderId", "name color")
      .populate("paymentMethodId", "name type lastFour")

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// PUT update a subscription
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid subscription ID" },
        { status: 400 },
      )
    }

    const body = await request.json()

    await dbConnect()

    const subscription = await Subscription.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      {
        ...body,
        nextBillingDate: body.nextBillingDate
          ? new Date(body.nextBillingDate)
          : undefined,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
      },
      { new: true, runValidators: true },
    )

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// DELETE a subscription
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid subscription ID" },
        { status: 400 },
      )
    }

    await dbConnect()

    const subscription = await Subscription.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ message: "Subscription deleted successfully" })
  } catch (error) {
    console.error("Error deleting subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
