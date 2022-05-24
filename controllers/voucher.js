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
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedVoucher);
  } catch (err) {
    next(err);
  }
};

export const deleteVoucher = async (req, res, next) => {
  try {
    await Voucher.findByIdAndDelete(req.params.id);
    res.status(200).json("Voucher has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    res.status(200).json(voucher);
  } catch (err) {
    next(err);
  }
};
