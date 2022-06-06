import express from "express";
import {
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucher,
    getVouchers,
    getVoucherByPrice,
} from "../controllers/voucher.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

//CREATE
router.post("/create-voucher", createVoucher);

//UPDATE
router.put("/update-voucher", updateVoucher);

//DELETE
router.delete("/delete-voucher", deleteVoucher);

//GET VOUCHER
router.get("/get-voucher", getVoucher);

//GET VOUCHERS
router.get("/get-all-voucher", getVouchers);

router.post("/get-voucher-by-price", getVoucherByPrice);

export default router;