import { auth } from "@/lib/auth"
import { parseCSV } from "@/lib/csv"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const csvContent = await file.text()
    const parsedSubscriptions = parseCSV(csvContent)

    if (parsedSubscriptions.length === 0) {
      return NextResponse.json(
        { error: "No valid subscriptions found in CSV" },
        { status: 400 },
      )
    }

    await dbConnect()

    const subscriptionsToCreate = parsedSubscriptions.map((sub) => ({
      ...sub,
      nextBillingDate: new Date(sub.nextBillingDate),
      startDate: new Date(sub.startDate),
      userId: session.user.id,
    }))

    const createdSubscriptions =
      await Subscription.insertMany(subscriptionsToCreate)

    return NextResponse.json(
      {
        message: `Successfully imported ${createdSubscriptions.length} subscriptions`,
        count: createdSubscriptions.length,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error importing subscriptions:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
