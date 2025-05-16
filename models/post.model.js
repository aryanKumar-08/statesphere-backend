import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['buy', 'rent'],
      required: true,
    },
    property: {
      type: String,
      enum: ['apartment', 'house', 'condo', 'land'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostDetail',
      default: null,
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SavedPost',
      },
    ],
  },
  { timestamps: true }
);

const Post =  mongoose.model('Post', PostSchema);
export default Post;
