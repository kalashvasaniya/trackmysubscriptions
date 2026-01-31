import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"
import crypto from "crypto"

// Dodo Payments Webhook Handler
// Docs: https://docs.dodopayments.com/

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("webhook-signature")
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex")
      
      if (signature !== expectedSignature) {
        console.error("Invalid webhook signature")
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        )
      }
    }

    const event = JSON.parse(body)
    const { type, data } = event

    await dbConnect()
    const db = mongoose.connection.db
    
    if (!db) {
      throw new Error("Database connection failed")
    }

    switch (type) {
      case "payment.succeeded": {
        // Payment was successful
        const { customer, product_id, payment_id } = data
        
        await db.collection("subscriptions_billing").updateOne(
          { email: customer.email },
          {
            $set: {
              email: customer.email,
              name: customer.name,
              productId: product_id,
              paymentId: payment_id,
              status: "active",
              plan: "pro",
              paidAt: new Date(),
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        )
        
        console.log(`Payment succeeded for ${customer.email}`)
        break
      }

      case "payment.failed": {
        // Payment failed
        const { customer } = data
        
        await db.collection("subscriptions_billing").updateOne(
          { email: customer.email },
          {
            $set: {
              status: "payment_failed",
              updatedAt: new Date(),
            },
          }
        )
        
        console.log(`Payment failed for ${customer.email}`)
        break
      }

      case "subscription.active": {
        // Subscription is now active
        const { customer, subscription_id } = data
        
        await db.collection("subscriptions_billing").updateOne(
          { email: customer.email },
          {
            $set: {
              subscriptionId: subscription_id,
              status: "active",
              plan: "pro",
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        )
        
        console.log(`Subscription active for ${customer.email}`)
        break
      }

      case "subscription.cancelled": {
        // Subscription was cancelled
        const { customer } = data
        
        await db.collection("subscriptions_billing").updateOne(
          { email: customer.email },
          {
            $set: {
              status: "cancelled",
              cancelledAt: new Date(),
              updatedAt: new Date(),
            },
          }
        )
        
        console.log(`Subscription cancelled for ${customer.email}`)
        break
      }

      case "refund.succeeded": {
        // Refund was processed
        const { customer } = data
        
        await db.collection("subscriptions_billing").updateOne(
          { email: customer.email },
          {
            $set: {
              status: "refunded",
              refundedAt: new Date(),
              updatedAt: new Date(),
            },
          }
        )
        
        console.log(`Refund processed for ${customer.email}`)
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
