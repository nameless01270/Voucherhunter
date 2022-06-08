import express from "express";
import { createOrder, deleteOrder, getAllOrder, getOrderByUser, updateOrder } from "../controllers/oder.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/create-order", createOrder);

// UPDATE
router.put("/update-order", updateOrder);

// DELETE
router.delete("/delete-order", deleteOrder);

// GET ALL
router.get("/get-all-order", getAllOrder);

// GET ORDER BY USER
router.get("/get-order", getOrderByUser);

export default router;