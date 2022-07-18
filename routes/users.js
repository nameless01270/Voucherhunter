import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  changePassword,
  changeUserAvatar,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

import multer from "multer";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });


const router = express.Router();

//UPDATE
router.put("/edit-user", verifyToken, verifyUser, updateUser);

//DELETE
router.delete("/delete-user", verifyToken, verifyUser, deleteUser);

//GET
router.get("/get-user", verifyToken, verifyUser, getUser);

//GET ALL
router.get("/get-all-user", verifyToken, verifyAdmin, getUsers);

//POST
router.post("/change-password", verifyToken, verifyUser, changePassword);

//POST
router.post("/change-user-avatar", verifyToken, verifyUser, upload.single("editUserImage"), changeUserAvatar);

export default router;