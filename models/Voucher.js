import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
    image: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: false 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    created: {
        type: Number,
        default: Date.now(),
        required: true
    },
    updated: {
        type: Number,
        default: null
    },
    status: { 
        type: String, 
        enum: ['stocking', 'sold out'],
        default: 'stocking',
        required: true
    }
})

export default mongoose.model("Voucher", VoucherSchema);