import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false } // optional, we only keep createdAt
);

// Compound unique index (userId + postId)
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

const SavedPost = mongoose.model("SavedPost", savedPostSchema);
export default SavedPost;
