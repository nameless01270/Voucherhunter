import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  changePassword,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/edit-user", verifyUser, updateUser);

//DELETE
router.delete("/delete-user", verifyUser, deleteUser);

//GET
router.get("/get-user", verifyUser, getUser);

//GET ALL
router.get("/get-all-user", verifyAdmin, getUsers);

//POST
router.post("/change-password", verifyUser, changePassword);

export default router;