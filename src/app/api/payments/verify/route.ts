import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const checkoutId = request.nextUrl.searchParams.get("checkout_id");

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has paid
    const isPaid = user.payment?.status === "paid";
    
    // Also check if checkout ID matches (for immediate verification after payment)
    const checkoutMatches = checkoutId && user.payment?.polarCheckoutId === checkoutId;

    return NextResponse.json({
      verified: isPaid,
      status: user.payment?.status || "free",
      checkoutMatches,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
