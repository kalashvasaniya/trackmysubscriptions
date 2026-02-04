import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  name?: string
  password?: string
  image?: string
  currency: string
  defaultAlertDays?: number
  emailAlerts: boolean
  weeklyDigest: boolean
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
    },
    currency: {
      type: String,
      default: "USD",
    },
    defaultAlertDays: {
      type: Number,
      default: 3,
    },
    emailAlerts: {
      type: Boolean,
      default: true,
    },
    weeklyDigest: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
