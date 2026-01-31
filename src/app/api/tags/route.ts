import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Tag from "@/models/Tag"
import { NextResponse } from "next/server"

// GET all tags for the current user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const tags = await Tag.find({ userId: session.user.id }).sort({ name: 1 })

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// POST create a new tag
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, color } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 },
      )
    }

    await dbConnect()

    const tag = await Tag.create({
      name,
      color: color || "#6B7280",
      userId: session.user.id,
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error: any) {
    console.error("Error creating tag:", error)
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
