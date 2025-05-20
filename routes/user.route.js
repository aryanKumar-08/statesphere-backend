// import express from "express";
// // import {
// // //   deleteUser,
// // //   getUser,
// // //   getUsers,
// // //   updateUser,
// // //   savePost,
// // //   profilePosts,
// // //   getNotificationNumber
// // } from "../controllers/user.controller.js";
// import {verifyToken} from "../middleware/verifyToken.js";
// import { deleteUser, getNotificationNumber, getUsers, profilePosts, savePost  } from "../controllers/user.controller.js";
// import { getUser } from "../controllers/user.controller.js";
// import { updateUser } from "../controllers/user.controller.js";


// const router = express.Router();

// router.get("/", getUsers);
// // router.get("/search/:id", verifyToken, getUser);
// router.put("/:id", verifyToken, updateUser);
// router.delete("/:id", verifyToken, deleteUser);
// router.post("/save", verifyToken, savePost);
// router.get("/profilePosts", verifyToken, profilePosts);
// router.get("/notification", verifyToken, getNotificationNumber);

// export default router;


import express from "express";
import {
  deleteUser,
  getNotificationNumber,
  getUsers,
  profilePosts,
  savePost,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);

export default router;
