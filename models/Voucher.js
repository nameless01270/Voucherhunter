import mongoose from "mongoose";
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const VoucherSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    images: { 
        type: Array, 
        required: true 
    },
    code: { 
        type: String, 
        required: false 
    },
    sold: {
        type: Number,
        default: 0,
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    category: {
        type: ObjectId,
        ref: "categories",
    },
    price: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['stocking', 'sold out'],
        default: 'stocking',
        required: true
    },
    },
    { timestamps: true }
)

export default mongoose.model("Voucher", VoucherSchema);