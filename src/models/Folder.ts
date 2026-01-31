import mongoose, { Schema, Document, Model } from "mongoose"

export interface IFolder extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  color: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const FolderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#3B82F6",
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

// Compound index for unique folder names per user
FolderSchema.index({ userId: 1, name: 1 }, { unique: true })

const Folder: Model<IFolder> =
  mongoose.models.Folder || mongoose.model<IFolder>("Folder", FolderSchema)

export default Folder
