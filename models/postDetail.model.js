import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostDetailSchema = new Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    utilities: {
      type: String,
      default: '',
    },
    pet: {
      type: String,
      default: '',
    },
    income: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: null,
    },
    school: {
      type: Number,
      default: null,
    },
    bus: {
      type: Number,
      default: null,
    },
    restaurant: {
      type: Number,
      default: null,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      unique: true, // enforce one-to-one relation
    },
  },
  { timestamps: true }
);

const PostDetail=  mongoose.model('PostDetail', PostDetailSchema);
export default PostDetail;
