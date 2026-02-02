import { NextResponse } from "next/server"
import connectMongoDB from "@/lib/mongodb"
import User from "@/models/User"
import Subscription from "@/models/Subscription"

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300

export async function GET() {
  try {
    await connectMongoDB()

    // Get aggregated stats from database
    const [totalUsers, totalSubscriptions, activeSubscriptions, totalSpendingResult] =
      await Promise.all([
        User.countDocuments(),
        Subscription.countDocuments(),
        Subscription.countDocuments({ status: "active" }),
        Subscription.aggregate([
          { $match: { status: "active" } },
          {
            $project: {
              monthlyAmount: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$billingCycle", "weekly"] }, then: { $multiply: ["$amount", 4.33] } },
                    { case: { $eq: ["$billingCycle", "monthly"] }, then: "$amount" },
                    { case: { $eq: ["$billingCycle", "quarterly"] }, then: { $divide: ["$amount", 3] } },
                    { case: { $eq: ["$billingCycle", "yearly"] }, then: { $divide: ["$amount", 12] } },
                  ],
                  default: "$amount",
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              totalMonthlySpending: { $sum: "$monthlyAmount" },
            },
          },
        ]),
      ])

    const totalMonthlySpending = totalSpendingResult[0]?.totalMonthlySpending || 0
    // Estimate total tracked value (assuming avg 12 months per subscription)
    const totalTrackedValue = totalMonthlySpending * 12

    return NextResponse.json(
      {
        totalUsers,
        totalSubscriptions,
        activeSubscriptions,
        totalMonthlySpending: Math.round(totalMonthlySpending),
        totalTrackedValue: Math.round(totalTrackedValue),
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
        },
      }
    )
  } catch (error) {
    console.error("Error fetching public stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
