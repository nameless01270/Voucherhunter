import Voucher from "../models/Voucher.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

var deleteImages = (images, mode) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  var basePath = path.resolve(__dirname + "../../") + "/public/uploads/vouchers/";
  console.log(basePath);
  for (var i = 0; i < images.length; i++) {
    let filePath = "";
    if (mode == "file") {
      filePath = basePath + `${images[i].filename}`;
    } else {
      filePath = basePath + `${images[i]}`;
    }
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      console.log("Exists image");
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        return err;
      }
    });
  }
} 

export const createVoucher = async (req, res, next) => {
  let { title, brand, description, code, quantity, category, price, status } = req.body;
  let images = req.files;
  if (!title || !brand || !description || !code || !quantity || !category || !price || !status) {
    deleteImages(images, "file");
    return res.json({ error: "All filled must be required" });
  } else if (title.length > 255 || description.length > 3000) {
    deleteImages(images, "file");
    return res.json({ error: "Name 255 & Description must not be 3000 character long" });      
  } else if (images.length !== 2) {
    deleteImages(images, "file");
    return res.json({ error: "Must need to provide 2 images" });
  } else {
    try {
      let allImages = [];
      for (const img of images) {
        allImages.push(img.filename);
      }
      let newVoucher = new Voucher({
        images: allImages,
        title,
        brand,
        description,
        code,
        quantity,
        category,
        price,
        status,
      });
      let result = await newVoucher.save();
      if (result) {
        return res.status(200).json({ success: "Voucher created successfully" });
      }
    } catch (err) {
      next(err);
    }
  }
};

export const updateVoucher = async (req, res, next) => {
  let { 
    vId, 
    title, 
    brand, 
    description, 
    code, 
    quantity, 
    category, 
    price, 
    status,
    images } = req.body;
  let editImages = req.files;
  if (
    !vId |
    !title |
    !brand |
    !description |
    !code |
    !quantity |
    !category |
    !price |
    !status
  ) {
    deleteImages(editImages, "file");
    return res.json({ title, images, vId, title, brand, description, code, quantity, category, price, status });
  
  } else if (title.length > 255 || description.length > 3000) {
    return res.json({ error: "Name 255 & Description must not be 3000 character long" });      
  } else if (editImages && editImages.length == 1) {
    deleteImages(editImages, "file");
    return res.json({ error: "Must need to provide 2 images" });
  } else {
    let editData = {
      title,
      brand,
      description,
      code,
      quantity,
      category,
      price,
      status,      
    };
    if (editImages.length == 2) {
      let allEditImages = [];
      for (const img of editImages) {
        allEditImages.push(img.filename);
      }
      editData = { ...editData, images: allEditImages };
      deleteImages(images.split(","), "string");
    }
    try {
      await Voucher.findByIdAndUpdate(vId, editData);
      return res.status(200).json({ success: "Voucher updated successfully"})

    } catch (err) {
      next(err);
    }
  }
};

export const deleteVoucher = async (req, res, next) => {
  let { vId } = req.body;
  if(!vId) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let deleteVoucherObj = await Voucher.findById(vId);
      let deletedVoucher = await Voucher.findByIdAndDelete(vId);
      if (deletedVoucher) {
        deleteImages(deleteVoucherObj.images, "string");
        return res.status(200).json({ success: "Voucher deleted successfully" });
      }
    } catch (err) {
      next(err);
    }
  }
};

export const getVoucher = async (req, res, next) => {
  try {
    let { vId } = req.body;
    if(!vId) {
      return res.json({ message: "All filled must be required" });
    } else {
      const voucher = await Voucher.findById(vId);
      res.status(200).json(voucher);
    }
  } catch (err) {
    next(err);
  }
};

export const getVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.find();    
    res.status(200).json(vouchers);
  } catch (err) {
    next(err);
  }
};

export const getVoucherByPrice = async (req, res, next) => {
  let { price } = req.body;
  if (!price) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let vouchers = await Voucher
        .find({ price: { $lt: price } })
        .populate("category", "title")
        .sort({ price: -1 });
      if (vouchers) {
        return res.status(200).json({ Vouchers: vouchers });
      }
    } catch (err) {
      next(err);
    }
  }
};

export const getVoucherByCategory = async (req, res, next) => {
  let { cId } = req.body;
  if (!cId) {
    return res.json({ error: "All filled must be required" });  
  } else {
    try {
      let vouchers = await Voucher
        .find({category: cId})
        .populate("category", "title");
      if (vouchers) {
        return res.status(200).json({ Vouchers: vouchers});
      }
    } catch (err) {
      next(err);
    }
  }
};

export const getCartVoucher = async (req, res, next) => {
    let { voucherArray } = req.body;
    if (!voucherArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let cartVouchers = await Voucher.find({
          _id: { $in: voucherArray },
        });
        if (cartVouchers) {
          return res.json({ Vouchers: cartVouchers });
        }
      } catch (err) {
        next(err);
      }
    }
}
