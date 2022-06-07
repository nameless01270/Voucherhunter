import express from "express";
import {
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucher,
    getVouchers,
    getVoucherByPrice,
} from "../controllers/voucher.js";
import multer from "multer";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/vouchers");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

//CREATE
router.post("/create-voucher", upload.any(), createVoucher);

//UPDATE
router.put("/update-voucher", upload.any(), updateVoucher);

//DELETE
router.delete("/delete-voucher", deleteVoucher);

//GET VOUCHER
router.get("/get-voucher", getVoucher);

//GET VOUCHERS
router.get("/get-all-voucher", getVouchers);

router.post("/get-voucher-by-price", getVoucherByPrice);

export default router;