import Category from "../models/Category.js";
import fs from "fs";
import { toTitleCase } from "../config/functionSupport.js";

export const getAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ _id: -1 });
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
};

export const createCategory = async (req, res, next) => {
    let { title, description, status } = req.body;
    let image = req.file.filename;
    const filePath = `../VOUCHER_HUNTER_BE/public/uploads/categories/${image}`;
    if (!title || !description || !status || !image) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
            }
            return res.json({ error: "All filled must be required"});
        });
    } else {
        title = toTitleCase(title);
        try {
            let checkCategoryExists = await Category.findOne({ title: title});
            if (checkCategoryExists) {
                fs.unlink(filePath, (err) => {
                    if (err) console.log(err);
                    return res.json({ error: "Category already exists"});
                });
            } else {
                let newCategory = new Category({ title, description, status, image});
                await newCategory.save((err) => {
                    if(!err) {
                        return res.status(200).json({ success: "Category created successfully"});
                    }
                });
            }
        } catch (err) {
            next(err)
        }
    }
};

export const updateCategory = async (req, res, next) => {
    let { cId , description, status } = req.body;
    if (!cId || !description || !status) {
        return res.json({ error: "All filled must be required"});
    }
    try {
        let updatedCategory = await Category.findByIdAndUpdate(cId, {description, status, updatedAt: Date.now()});
        res.status(200).json(updatedCategory);
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (req, res, next) => {
    let { cId } = req.body;
    if(!cId) {
        return res.json({ error: "All filled must be required"});
    } else {
        try{
            let deletedCategoryFile = await Category.findById(cId);
            const filePath = `../VOUCHER_HUNTER_BE/public/uploads/categories/${deletedCategoryFile.image}`;

            let deletedCategory = await Category.findByIdAndDelete(cId);
            if (deletedCategory) {
                fs.unlink(filePath, (err) => {
                    if (err) console.log(err);
                    return res.status(200).json({ success: "Category deleted successfully"});
                });
            }
        } catch (err) {
            next(err);
        }
    }
}