import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Folder from "@/models/Folder"
import { NextResponse } from "next/server"

// GET all folders for the current user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const folders = await Folder.find({ userId: session.user.id }).sort({
      name: 1,
    })

    return NextResponse.json(folders)
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// POST create a new folder
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, color } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 },
      )
    }

    await dbConnect()

    const folder = await Folder.create({
      name,
      color: color || "#3B82F6",
      userId: session.user.id,
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error: any) {
    console.error("Error creating folder:", error)
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
