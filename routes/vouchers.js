import express from "express";
import {
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucher,
} from "../controllers/voucher.js";
import Voucher from "../models/Voucher.js";

const router = express.Router();

//CREATE
router.post("/", createVoucher);

//UPDATE
router.put("/:id", updateVoucher);

//DELETE
router.delete("/:id", deleteVoucher);

//GET
router.get("/:id", getVoucher);


export default router;