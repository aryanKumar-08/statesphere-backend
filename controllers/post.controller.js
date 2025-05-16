import Post from "../models/post.model.js";
// import PostDetail from "../models/postDetail.model.js";
import SavedPost from "../models/savedPost.model.js";
import jwt from "jsonwebtoken";
import postDetailModel from "../models/postDetail.model.js";
import PostDetail from "../models/postDetail.model.js";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const filters = {
      ...(query.city && { city: query.city }),
      ...(query.type && { type: query.type }),
      ...(query.property && { property: query.property }),
      ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
      price: {
        ...(query.minPrice && { $gte: parseInt(query.minPrice) }),
        ...(query.maxPrice && { $lte: parseInt(query.maxPrice) }),
      },
    };

    // Remove empty price filter
    if (!filters.price.$gte && !filters.price.$lte) delete filters.price;

    const posts = await Post.find(filters);
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};



export const getPost = async (req, res) => { 
  const id = req.params.id;

  try {                                     
    const post = await Post.findById(id)
      .populate("postDetail")
      .populate("userId", "username avatar");

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (!err) {
          const saved = await SavedPost.findOne({
            postId: id,
            userId: payload.id,
          });
          return res.status(200).json({ ...post._doc, isSaved: !!saved });
        }
      });

    } 
    else{

    
    
    
      res.status(200).json({ ...post._doc, isSaved: false });
    
    }
    
  }   
   catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
}; 


export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // Step 1: Create the Post first (without postDetail)
    const newPost = await Post.create({
      ...body.postData,
      userId: tokenUserId,
      postDetail: null,
    });

    // Step 2: Create PostDetail (if any) and link it to the Post
    let createdPostDetail = null;
    if (body.postDetail) {
      createdPostDetail = await PostDetail.create({
        ...body.postDetail,
        postId: newPost._id,
      });

      // Step 3: Update the Post with the PostDetail ID
      newPost.postDetail = createdPostDetail._id;
      await newPost.save();
    }

    res.status(200).json(newPost);
  } catch (err) {
    console.log("error in the add post");
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};



export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const updateData = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};