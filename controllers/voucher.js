import Voucher from "../models/Voucher.js";

export const createVoucher = async (req, res, next) => {
  const newVoucher = new Voucher(req.body);
  try {
    const savedVoucher = await newVoucher.save();
    res.status(200).json(savedVoucher);
  } catch (err) {
    next(err);
  }
};

export const updateVoucher = async (req, res, next) => {
  try {
    let { uId } = req.body;
    if(!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        uId,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVoucher);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVoucher = async (req, res, next) => {
  try {
    let { uId } = req.body;
    if(!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      await Voucher.findByIdAndDelete(uId);
      res.status(200).json("Voucher has been deleted.");
    }
  } catch (err) {
    next(err);
  }
};

export const getVoucher = async (req, res, next) => {
  try {
    let { uId } = req.body;
    if(!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      const voucher = await Voucher.findById(uId);
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
          .populate("title")
          .sort({ price: -1 });
        if (vouchers) {
          return res.json({ Vouchers: vouchers });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }
