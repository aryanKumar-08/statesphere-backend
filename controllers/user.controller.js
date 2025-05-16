// import SavedPost from "../models/savedPost.model.js";
import Post from "../models/post.model.js";
import SavedPost from "../models/savedPost.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
// import SavedPost from "../models/SavedPost.js";
// import Post from "../models/Post.js";
// import Chat from "../models/Chat.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // Assuming middleware sets this correctly
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    const updateData = {
      ...inputs,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};


export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await SavedPost.findOne({
      userId: tokenUserId,
      postId,
    });

    if (savedPost) {
      await SavedPost.deleteOne({ _id: savedPost._id });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await SavedPost.create({
        userId: tokenUserId,
        postId,
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save/remove post!" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await Post.find({ userId: tokenUserId });

    const saved = await SavedPost.find({ userId: tokenUserId }).populate("postId");

    const savedPosts = saved.map((item) => item.postId);

    res.status(200).json({ userPosts, savedPosts });

    // console.log("error in controller of profile post");
  } catch (err) {
    console.log("Error in profilePosts:", err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};



export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await Chat.countDocuments({
      userIDs: { $in: [tokenUserId] },
      seenBy: { $nin: [tokenUserId] },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get notification count!" });
  }
};
