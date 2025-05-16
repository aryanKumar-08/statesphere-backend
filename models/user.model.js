import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '', // optional
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SavedPost',
      },
    ],
    chatIDs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      },
    ],
  },
  { timestamps: true }
);

const User =  mongoose.model('User', UserSchema);
export default User;




// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   avatar: {
//     type: String,
//     default: null,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Create the model
// const User = mongoose.model('User', userSchema);

// export default User;
