import express from "express";
import {
    getImages,
    uploadSlideImage,
    deleteSlideImage,
    getAllData,
} from "../controllers/admin-controllers.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
import multer from "multer";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/slideImage");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

//GET
router.get("/get-images", verifyAdmin, getImages);

//UPDATE
router.post("/upload-slide-image", verifyAdmin, upload.single("image"), uploadSlideImage);

//DELETE
router.post("/delete-slide-image", verifyAdmin, deleteSlideImage);

//GET ALL DATA
router.get("/dashboard-data", verifyAdmin, getAllData);

export default router;