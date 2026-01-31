import { auth } from "@/lib/auth"
import { generateCSV } from "@/lib/csv"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const subscriptions = await Subscription.find({
      userId: session.user.id,
    }).lean()

    const csv = generateCSV(subscriptions)

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="subscriptions-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting subscriptions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
