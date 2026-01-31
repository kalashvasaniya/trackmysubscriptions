import { auth } from "@/lib/auth"
import {
  fetchExchangeRates,
  convertWithRates,
} from "@/lib/currency"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import User from "@/models/User"
import { NextResponse } from "next/server"

// GET analytics data (amounts converted to user's display currency)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id
    const user = await User.findById(userId).select("currency").lean()
    const displayCurrency = user?.currency ?? "USD"

    const rates = await fetchExchangeRates("USD")
    const toDisplay = (amount: number, fromCurrency: string) =>
      convertWithRates(amount, fromCurrency, displayCurrency, rates)

    // Get all subscriptions for the user
    const subscriptions = await Subscription.find({ userId })

    // Calculate metrics
    const totalSubscriptions = subscriptions.length
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "active",
    ).length

    // Calculate monthly spending (normalize to monthly, convert to display currency)
    const monthlySpending = subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, sub) => {
        let monthlyAmount: number
        switch (sub.billingCycle) {
          case "weekly":
            monthlyAmount = sub.amount * 4.33
            break
          case "monthly":
            monthlyAmount = sub.amount
            break
          case "quarterly":
            monthlyAmount = sub.amount / 3
            break
          case "yearly":
            monthlyAmount = sub.amount / 12
            break
          default:
            monthlyAmount = sub.amount
        }
        return sum + toDisplay(monthlyAmount, sub.currency)
      }, 0)

    const yearlySpending = monthlySpending * 12

    // Get spending by category (in display currency)
    const categorySpending: Record<string, number> = {}
    subscriptions
      .filter((s) => s.status === "active")
      .forEach((sub) => {
        const category = sub.category || "Uncategorized"
        const monthlyAmount =
          sub.billingCycle === "yearly"
            ? sub.amount / 12
            : sub.billingCycle === "quarterly"
              ? sub.amount / 3
              : sub.billingCycle === "weekly"
                ? sub.amount * 4.33
                : sub.amount
        const converted = toDisplay(monthlyAmount, sub.currency)
        categorySpending[category] =
          (categorySpending[category] || 0) + converted
      })

    // Get spending by month (last 12 months, in display currency)
    const now = new Date()
    const monthlyTrends: Array<{ month: string; amount: number }> = []

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })

      const monthSpending = subscriptions
        .filter((sub) => {
          const startDate = new Date(sub.startDate)
          const wasActive = startDate <= date && sub.status !== "cancelled"
          return wasActive
        })
        .reduce((sum, sub) => {
          const monthlyAmount =
            sub.billingCycle === "yearly"
              ? sub.amount / 12
              : sub.billingCycle === "quarterly"
                ? sub.amount / 3
                : sub.billingCycle === "weekly"
                  ? sub.amount * 4.33
                  : sub.amount
          return sum + toDisplay(monthlyAmount, sub.currency)
        }, 0)

      monthlyTrends.push({
        month: monthName,
        amount: Math.round(monthSpending * 100) / 100,
      })
    }

    // Get upcoming payments (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const upcomingPayments = subscriptions
      .filter((sub) => {
        const nextBilling = new Date(sub.nextBillingDate)
        return (
          sub.status === "active" && nextBilling <= thirtyDaysFromNow && nextBilling >= now
        )
      })
      .sort(
        (a, b) =>
          new Date(a.nextBillingDate).getTime() -
          new Date(b.nextBillingDate).getTime(),
      )
      .slice(0, 10)
      .map((sub) => ({
        id: sub._id,
        name: sub.name,
        amount: Math.round(toDisplay(sub.amount, sub.currency) * 100) / 100,
        currency: displayCurrency,
        nextBillingDate: sub.nextBillingDate,
        billingCycle: sub.billingCycle,
      }))

    // Get status breakdown
    const statusBreakdown = {
      active: subscriptions.filter((s) => s.status === "active").length,
      trial: subscriptions.filter((s) => s.status === "trial").length,
      paused: subscriptions.filter((s) => s.status === "paused").length,
      cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
    }

    // Get billing cycle breakdown
    const billingCycleBreakdown = {
      weekly: subscriptions.filter((s) => s.billingCycle === "weekly").length,
      monthly: subscriptions.filter((s) => s.billingCycle === "monthly").length,
      quarterly: subscriptions.filter((s) => s.billingCycle === "quarterly")
        .length,
      yearly: subscriptions.filter((s) => s.billingCycle === "yearly").length,
    }

    // Recent subscriptions (last 5 added)
    const recentSubscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("folderId", "name color")

    return NextResponse.json({
      displayCurrency,
      metrics: {
        totalSubscriptions,
        activeSubscriptions,
        monthlySpending: Math.round(monthlySpending * 100) / 100,
        yearlySpending: Math.round(yearlySpending * 100) / 100,
      },
      categorySpending: Object.entries(categorySpending)
        .map(([category, amount]) => ({
          category,
          amount: Math.round(amount * 100) / 100,
        }))
        .sort((a, b) => b.amount - a.amount),
      monthlyTrends,
      upcomingPayments,
      statusBreakdown,
      billingCycleBreakdown,
      recentSubscriptions: recentSubscriptions.map((sub) => ({
        id: sub._id,
        name: sub.name,
        amount: Math.round(toDisplay(sub.amount, sub.currency) * 100) / 100,
        currency: displayCurrency,
        billingCycle: sub.billingCycle,
        status: sub.status,
        category: sub.category,
        nextBillingDate: sub.nextBillingDate,
        folder: sub.folderId,
        createdAt: sub.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
