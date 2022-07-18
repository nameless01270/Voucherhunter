import mongoose from "mongoose";
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const OrderSchema = new Schema(
    {
        allVoucher: [
            {
                id: { type: ObjectId, ref: "Voucher"},
                quantity: Number,
            },
        ],
        user: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "unpaid",
            enum: [
                "unpaid",
                "paid",
            ],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);