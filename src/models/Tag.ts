import mongoose, { Schema, Document, Model } from "mongoose"

export interface ITag extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  color: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#6B7280",
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

// Compound index for unique tag names per user
TagSchema.index({ userId: 1, name: 1 }, { unique: true })

const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema)

export default Tag
