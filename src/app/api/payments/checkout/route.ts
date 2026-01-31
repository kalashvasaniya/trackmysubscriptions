import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Dodo Payments Checkout API (One-time payment - $9 lifetime access)
// Docs: https://docs.dodopayments.com/api-reference/checkout-sessions/create

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const apiKey = process.env.DODO_PAYMENTS_API_KEY
    const productId = process.env.NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID

    if (!apiKey || !productId) {
      return NextResponse.json(
        { error: "Payment configuration missing" },
        { status: 500 }
      )
    }

    // Create a checkout session with Dodo Payments
    // Using live endpoint - change to test.dodopayments.com for testing
    const response = await fetch("https://test.dodopayments.com/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
        customer: {
          email: session.user.email,
          name: session.user.name || "Customer",
        },
        return_url: `${process.env.NEXTAUTH_URL}/payment/success`,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Dodo Payments error:", errorData)
      return NextResponse.json(
        { error: errorData.message || "Failed to create checkout session" },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      sessionId: data.session_id,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
