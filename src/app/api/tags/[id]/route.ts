import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Tag from "@/models/Tag"
import Subscription from "@/models/Subscription"
import { NextResponse } from "next/server"

// GET single tag
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

    const tag = await Tag.findOne({
      _id: id,
      userId: session.user.id,
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Get subscription count
    const subscriptionCount = await Subscription.countDocuments({
      tagIds: id,
      userId: session.user.id,
    })

    return NextResponse.json({
      ...tag.toObject(),
      subscriptionCount,
    })
  } catch (error) {
    console.error("Error fetching tag:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// PUT update tag
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
    const { name, color } = await request.json()

    await dbConnect()

    const tag = await Tag.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name, color },
      { new: true, runValidators: true },
    )

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error: any) {
    console.error("Error updating tag:", error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// DELETE tag
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

    const tag = await Tag.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Remove tag from all subscriptions
    await Subscription.updateMany(
      { tagIds: id, userId: session.user.id },
      { $pull: { tagIds: id } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
