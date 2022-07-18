import express from "express";
import { 
    createCategory, 
    deleteCategory, 
    getAllCategory, 
    updateCategory, 
} from "../controllers/category.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

//CREATE
router.post("/create-category", upload.single("image"), createCategory);

//UPDATE
router.put("/update-category", updateCategory);

//DELETE
router.delete("/delete-category", deleteCategory);

//GET ALL CATEGORY
router.get("/get-all-category", getAllCategory);

export default router;