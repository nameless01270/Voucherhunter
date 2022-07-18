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
router.get("/get-images", verifyToken, verifyAdmin, getImages);

//UPDATE
router.post("/upload-slide-image", verifyToken, verifyAdmin, upload.single("image"), uploadSlideImage);

//DELETE
router.post("/delete-slide-image", verifyToken, verifyAdmin, deleteSlideImage);

//GET ALL DATA
router.get("/dashboard-data",verifyToken, verifyAdmin, getAllData);

export default router;