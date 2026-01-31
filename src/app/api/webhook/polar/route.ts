import { Webhooks } from "@polar-sh/nextjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    // Log the webhook event for debugging
    console.log("Polar webhook received:", payload.type);
  },
  onCheckoutUpdated: async (payload) => {
    const checkout = payload.data;
    console.log("Checkout updated:", checkout.id, checkout.status);

    // When checkout is confirmed, save the checkout ID to user for verification
    if (checkout.status === "confirmed" && checkout.customerEmail) {
      await dbConnect();
      await User.findOneAndUpdate(
        { email: checkout.customerEmail.toLowerCase() },
        {
          $set: {
            "payment.polarCheckoutId": checkout.id,
            "payment.polarCustomerId": checkout.customerId,
          },
        }
      );
    }
  },
  onOrderPaid: async (payload) => {
    const order = payload.data;
    console.log("Order paid:", order.id);

    // Get customer email from the order
    const customerEmail = order.customer?.email;
    if (!customerEmail) {
      console.error("No customer email found in order");
      return;
    }

    await dbConnect();

    // Update user's payment status in database
    await User.findOneAndUpdate(
      { email: customerEmail.toLowerCase() },
      {
        $set: {
          "payment.polarCustomerId": order.customerId,
          "payment.polarOrderId": order.id,
          "payment.polarCheckoutId": order.checkoutId,
          "payment.productId": order.productId,
          "payment.amount": order.netAmount,
          "payment.currency": order.currency,
          "payment.status": "paid",
          "payment.paidAt": new Date(),
        },
      }
    );

    console.log(`Payment saved for user: ${customerEmail}`);
  },
  onOrderRefunded: async (payload) => {
    const order = payload.data;
    console.log("Order refunded:", order.id);

    const customerEmail = order.customer?.email;
    if (!customerEmail) return;

    await dbConnect();
    await User.findOneAndUpdate(
      { email: customerEmail.toLowerCase() },
      {
        $set: {
          "payment.status": "refunded",
        },
      }
    );
  },
  onSubscriptionCreated: async (payload) => {
    const subscription = payload.data;
    console.log("Subscription created:", subscription.id);
  },
  onSubscriptionActive: async (payload) => {
    const subscription = payload.data;
    console.log("Subscription active:", subscription.id);
  },
  onSubscriptionCanceled: async (payload) => {
    const subscription = payload.data;
    console.log("Subscription canceled:", subscription.id);
  },
  onSubscriptionRevoked: async (payload) => {
    const subscription = payload.data;
    console.log("Subscription revoked:", subscription.id);
  },
});
