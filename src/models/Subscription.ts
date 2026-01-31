import mongoose, { Schema, Document, Model } from "mongoose"

export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly"
export type SubscriptionStatus = "active" | "cancelled" | "trial" | "paused"

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  description?: string
  amount: number
  currency: string
  billingCycle: BillingCycle
  nextBillingDate: Date
  startDate: Date
  status: SubscriptionStatus
  category?: string
  url?: string
  logo?: string
  notes?: string
  alertDays: number
  alertEnabled: boolean
  lastAlertSent?: Date
  userId: mongoose.Types.ObjectId
  folderId?: mongoose.Types.ObjectId
  tagIds: mongoose.Types.ObjectId[]
  paymentMethodId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    billingCycle: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "trial", "paused"],
      default: "active",
    },
    category: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    notes: {
      type: String,
    },
    alertDays: {
      type: Number,
      default: 3,
      min: 0,
    },
    alertEnabled: {
      type: Boolean,
      default: true,
    },
    lastAlertSent: {
      type: Date,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
    tagIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    paymentMethodId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
SubscriptionSchema.index({ userId: 1, nextBillingDate: 1 })
SubscriptionSchema.index({ userId: 1, status: 1 })

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema)

export default Subscription
