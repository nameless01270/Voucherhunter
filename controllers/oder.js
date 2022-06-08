import Order from "../models/Order.js";

export const createOrder = async (req, res, next) => {
    let { allVoucher, user, amount, status } = req.body;
    if (!allVoucher || !user || !amount || !status) {
        return res.json({ message: "All filled must be required" });
    } else {
        try {
            let newOrder = new Order({
                allVoucher, user, amount, status,
            });
            let result = await newOrder.save();
            if (result) {
                return res.status(200).json({ success: "Order created successfully" });
            }
        } catch (err) {
            next(err);
        }
    }
};

export const updateOrder = async (req, res, next) => {
    let { oId, status } = req.body;
    if (!oId || !status ) {
        return res.json({ message: "All filled must be required" });
    } else {
        try {
            await Order.findByIdAndUpdate(oId, {
                status: status,
                updatedAt: Date.now(),
            });
            res.status(200).json({ success: "Order updated successfully" });
        } catch (err) {
            next(err);
        }
    }
};

export const deleteOrder = async (req, res, next) => {
    let { oId } = req.body;
    if (!oId) {
        return res.json({ message: "All filled must be required" });
    } else {
        try {
            await Order.findByIdAndDelete(oId);
            res.status(200).json({ success: "Order deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
};

export const getAllOrder = async (req, res, next) => {
    try {
        let Orders = await Order
            .find({})
            .populate("allVoucher.id", "title images price")
            .populate("user", "name email")
            .sort({ _id: -1 });
        if (Orders) {
            return res.status(200).json({ Orders });
        }    
    } catch (err) {
        next(err);
    }
};

export const getOrderByUser = async (req, res, next) => {
    let { uId } = req.body;
    if (!uId) {
        return res.json({ message: "All filled must be required" });
    } else {
        try {
            let order = await Order
                .find({ user: uId })
                .populate("allVoucher.id", "title images price")
                .populate("user", "name email")
                .sort({ _id: -1 });
            if (order) {
                return res.status(200).json({ order });
            }
        } catch (err) {
            next(err);
        }
    }
};