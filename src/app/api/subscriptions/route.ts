import { auth } from "@/lib/auth"
import {
  fetchExchangeRates,
  convertWithRates,
} from "@/lib/currency"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import User from "@/models/User"
import { NextResponse } from "next/server"

// GET all subscriptions (with amounts in user's display currency)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findById(session.user.id).select("currency").lean()
    const displayCurrency = user?.currency ?? "USD"
    const rates = await fetchExchangeRates("USD")
    const toDisplay = (amount: number, fromCurrency: string) =>
      convertWithRates(amount, fromCurrency, displayCurrency, rates)

    const subscriptions = await Subscription.find({ userId: session.user.id })
      .populate("folderId", "name color")
      .populate("paymentMethodId", "name type lastFour")
      .sort({ nextBillingDate: 1 })
      .lean()

    const subscriptionsWithDisplay = subscriptions.map((sub) => ({
      ...sub,
      displayAmount: Math.round(toDisplay(sub.amount, sub.currency) * 100) / 100,
    }))

    return NextResponse.json({
      subscriptions: subscriptionsWithDisplay,
      displayCurrency,
    })
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
