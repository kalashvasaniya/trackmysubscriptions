import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Folder from "@/models/Folder"
import Subscription from "@/models/Subscription"
import { NextResponse } from "next/server"

// GET single folder
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

    const folder = await Folder.findOne({
      _id: id,
      userId: session.user.id,
    })

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    // Get subscription count
    const subscriptionCount = await Subscription.countDocuments({
      folderId: id,
      userId: session.user.id,
    })

    return NextResponse.json({
      ...folder.toObject(),
      subscriptionCount,
    })
  } catch (error) {
    console.error("Error fetching folder:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// PUT update folder
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

    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name, color },
      { new: true, runValidators: true },
    )

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    return NextResponse.json(folder)
  } catch (error: any) {
    console.error("Error updating folder:", error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A folder with this name already exists" },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// DELETE folder
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

    const folder = await Folder.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    // Remove folder reference from all subscriptions
    await Subscription.updateMany(
      { folderId: id, userId: session.user.id },
      { $unset: { folderId: "" } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
