import express from "express";
import { generateToken, paymentProcess } from "../controllers/braintree-controller.js";

const router = express.Router();

router.post("/get-token", generateToken);
router.post("/payment", paymentProcess);

export default router;