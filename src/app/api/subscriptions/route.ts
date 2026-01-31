import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { NextResponse } from "next/server"

// GET all subscriptions for the current user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const subscriptions = await Subscription.find({ userId: session.user.id })
      .populate("folderId", "name color")
      .populate("paymentMethodId", "name type lastFour")
      .sort({ nextBillingDate: 1 })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// POST create a new subscription
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const {
      name,
      description,
      amount,
      currency,
      billingCycle,
      nextBillingDate,
      startDate,
      status,
      category,
      url,
      logo,
      notes,
      alertDays,
      alertEnabled,
      folderId,
      tagIds,
      paymentMethodId,
    } = body

    if (!name || amount === undefined || !billingCycle || !nextBillingDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    await dbConnect()

    const subscription = await Subscription.create({
      name,
      description,
      amount,
      currency: currency || "USD",
      billingCycle,
      nextBillingDate: new Date(nextBillingDate),
      startDate: startDate ? new Date(startDate) : new Date(),
      status: status || "active",
      category,
      url,
      logo,
      notes,
      alertDays: alertDays ?? 3,
      alertEnabled: alertEnabled ?? true,
      userId: session.user.id,
      folderId,
      tagIds: tagIds || [],
      paymentMethodId,
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
