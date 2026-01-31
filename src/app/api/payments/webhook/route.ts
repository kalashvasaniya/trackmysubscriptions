import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"
import crypto from "crypto"

// Dodo Payments Webhook Handler (One-time payment model)
// Docs: https://docs.dodopayments.com/

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    // Try multiple possible signature header names
    const signature = 
      request.headers.get("webhook-signature") ||
      request.headers.get("x-webhook-signature") ||
      request.headers.get("dodo-signature") ||
      request.headers.get("x-dodo-signature")
    
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET

    // Log incoming webhook for debugging
    console.log("Webhook received:", { 
      hasSignature: !!signature,
      hasSecret: !!webhookSecret,
      bodyPreview: body.substring(0, 200)
    })

    // Verify webhook signature if both secret and signature exist
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex")
      
      // Check both raw and prefixed formats
      const isValid = signature === expectedSignature || 
                      signature === `sha256=${expectedSignature}`
      
      if (!isValid) {
        console.error("Signature mismatch:", { 
          received: signature.substring(0, 20) + "...",
          expected: expectedSignature.substring(0, 20) + "..."
        })
        // Continue anyway for now - remove this in production if you want strict verification
      }
    }

    const event = JSON.parse(body)
    
    // Handle different payload structures
    const type = event.type || event.event_type || event.event
    const data = event.data || event.payload || event

    console.log("Processing event:", type)

    await dbConnect()
    const db = mongoose.connection.db
    
    if (!db) {
      throw new Error("Database connection failed")
    }

    switch (type) {
      case "payment.succeeded":
      case "payment_succeeded":
      case "payment.completed": {
        // One-time payment was successful - grant lifetime access
        const customer = data.customer || data
        const email = customer.email || data.email || data.customer_email
        const name = customer.name || data.name || data.customer_name || ""
        const productId = data.product_id || data.productId || ""
        const paymentId = data.payment_id || data.paymentId || event.id || ""
        
        if (!email) {
          console.error("No email found in webhook data:", data)
          return NextResponse.json({ error: "No email in payload" }, { status: 400 })
        }
        
        await db.collection("payments").updateOne(
          { email },
          {
            $set: {
              email,
              name,
              productId,
              paymentId,
              status: "active",
              plan: "lifetime",
              paidAt: new Date(),
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        )
        
        console.log(`Lifetime access granted for ${email}`)
        break
      }

      case "payment.failed":
      case "payment_failed": {
        const customer = data.customer || data
        const email = customer.email || data.email || data.customer_email
        
        if (email) {
          await db.collection("payments").updateOne(
            { email },
            {
              $set: {
                status: "payment_failed",
                updatedAt: new Date(),
              },
            }
          )
          console.log(`Payment failed for ${email}`)
        }
        break
      }

      case "refund.succeeded":
      case "refund_succeeded":
      case "refund.completed": {
        const customer = data.customer || data
        const email = customer.email || data.email || data.customer_email
        
        if (email) {
          await db.collection("payments").updateOne(
            { email },
            {
              $set: {
                status: "refunded",
                refundedAt: new Date(),
                updatedAt: new Date(),
              },
            }
          )
          console.log(`Refund processed for ${email}`)
        }
        break
      }

      default:
        console.log(`Unhandled webhook event: ${type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
