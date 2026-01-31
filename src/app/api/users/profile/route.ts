import { auth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

// GET current user profile
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      currency: user.currency,
      defaultAlertDays: user.defaultAlertDays,
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

    const { name, currency, defaultAlertDays, currentPassword, newPassword } =
      await request.json()

    await dbConnect()

    const user = await User.findById(session.user.id).select("+password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update basic fields
    if (name !== undefined) {
      user.name = name
    }

    if (currency !== undefined) {
      user.currency = currency
    }

    if (defaultAlertDays !== undefined) {
      user.defaultAlertDays = defaultAlertDays
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change password" },
          { status: 400 },
        )
      }

      // Verify current password
      if (user.password) {
        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          user.password,
        )

        if (!isPasswordValid) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 },
          )
        }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      user.password = hashedPassword
    }

    await user.save()

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      currency: user.currency,
      defaultAlertDays: user.defaultAlertDays,
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

    const { password } = await request.json()

    await dbConnect()

    const user = await User.findById(session.user.id).select("+password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify password for account deletion (only for credential users)
    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required to delete account" },
          { status: 400 },
        )
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Password is incorrect" },
          { status: 400 },
        )
      }
    }

    // Import models to delete related data
    const Subscription = (await import("@/models/Subscription")).default
    const Tag = (await import("@/models/Tag")).default
    const Folder = (await import("@/models/Folder")).default
    const PaymentMethod = (await import("@/models/PaymentMethod")).default

    // Delete all user data
    await Promise.all([
      Subscription.deleteMany({ userId: session.user.id }),
      Tag.deleteMany({ userId: session.user.id }),
      Folder.deleteMany({ userId: session.user.id }),
      PaymentMethod.deleteMany({ userId: session.user.id }),
      User.findByIdAndDelete(session.user.id),
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
