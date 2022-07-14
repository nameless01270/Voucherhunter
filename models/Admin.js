import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
    {
        slideImage: {
            type: String,
        },
        firstShow: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
