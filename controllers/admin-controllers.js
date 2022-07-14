import fs from "fs";
import Category from "../models/Category.js";
import Voucher from "../models/Voucher.js";
import Order from "../models/Order.js";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

export const getImages = async (req, res, next) => {
    try {
        let Images = await Admin.find({});
        if (Images) {
            return res.json({ Images });
        }
    } catch (err) {
        next(err);
    }
};

export const uploadSlideImage = async (req, res, next) => {
    let image = req.file.name;
    const filePath = `../VOUCHER_HUNTER_BE/public/uploads/slideImage/${image}`;

    if (!image) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
            }
            return res.json({ error: "All filled must be required"});
        });
    }
    try {
        let newImage = new Admin({
            slideImage: image,
        });
        await newImage.save((err) => {
            if(!err){
                return res.status(200).json({ success: "Successfully"});
            }
        });
    } catch (err) {
        next(err);
    }
};

export const deleteSlideImage = async (req, res, next) => {
    let { id } = req.body;
    if (!id) {
        return res.json({ error: "All field must be required" });
    } else {
        try {
            let deleteSlideImage = await Admin.findById(id);
            const filePath = `../VOUCHER_HUNTER_BE/public/uploads/slideImage/${deleteSlideImage.slideImage}`;
            let deleteImage = await Admin.findByIdAndDelete(id);

            if (deleteImage) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.status(200).json({ success: "Image deleted successfully" });
                });
            }
        } catch (err) {
            next(err);
        }
    }
};

export const getAllData = async (req, res, next) => {
    try {
        let Vouchers = await Voucher.find({}).count();
        let Categories = await Category.find({}).count();
        let Orders = await Order.find({}).count();
        let Users = await User.find({}).count();

        if (Categories &&  Vouchers && Orders) {
            return res.status(200).json({ Vouchers, Categories, Orders, Users });
        }
    } catch (err) {
        next(err);
    }
};
