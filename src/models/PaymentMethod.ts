import mongoose, { Schema, Document, Model } from "mongoose"

export type PaymentMethodType =
  | "credit_card"
  | "debit_card"
  | "paypal"
  | "bank_account"
  | "other"

export interface IPaymentMethod extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  type: PaymentMethodType
  lastFour?: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "bank_account", "other"],
      required: true,
    },
    lastFour: {
      type: String,
      maxlength: 4,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

const PaymentMethod: Model<IPaymentMethod> =
  mongoose.models.PaymentMethod ||
  mongoose.model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema)

export default PaymentMethod
