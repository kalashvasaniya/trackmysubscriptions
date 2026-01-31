import { auth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb-client"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

// GET current user profile
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use native MongoDB client to read all fields correctly
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({
      _id: new ObjectId(session.user.id),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      currency: user.currency || "USD",
      defaultAlertDays: user.defaultAlertDays ?? 3,
      emailAlerts: user.emailAlerts ?? true,
      weeklyDigest: user.weeklyDigest ?? false,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// PUT update user profile
export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, currency, defaultAlertDays, emailAlerts, weeklyDigest } = body

    // Build update object with only provided fields
    const updateFields: Record<string, unknown> = {}

    if (name !== undefined) {
      updateFields.name = name
    }

    if (currency !== undefined) {
      updateFields.currency = currency
    }

    if (defaultAlertDays !== undefined) {
      updateFields.defaultAlertDays = defaultAlertDays
    }

    if (emailAlerts !== undefined) {
      updateFields.emailAlerts = emailAlerts
    }

    if (weeklyDigest !== undefined) {
      updateFields.weeklyDigest = weeklyDigest
    }

    // Use native MongoDB client to ensure fields are saved
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(session.user.id) },
      { $set: updateFields },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = result

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      currency: user.currency || "USD",
      defaultAlertDays: user.defaultAlertDays ?? 3,
      emailAlerts: user.emailAlerts ?? true,
      weeklyDigest: user.weeklyDigest ?? false,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// DELETE user account
export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { confirmed } = await request.json()

    if (!confirmed) {
      return NextResponse.json(
        { error: "Deletion must be confirmed" },
        { status: 400 },
      )
    }

    const client = await clientPromise
    const db = client.db()
    const userId = new ObjectId(session.user.id)

    // Check if user exists
    const user = await db.collection("users").findOne({ _id: userId })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete all user data from all collections
    await Promise.all([
      db.collection("subscriptions").deleteMany({ userId: session.user.id }),
      db.collection("tags").deleteMany({ userId: session.user.id }),
      db.collection("folders").deleteMany({ userId: session.user.id }),
      db.collection("paymentmethods").deleteMany({ userId: session.user.id }),
      db.collection("users").deleteOne({ _id: userId }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
