import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const resetTokenSchema = new Schema(
    {
        owner: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            expires: 3600,
            default: Date.now(),
        }
    }
);

resetTokenSchema.pre("save", async function (next) {
    if(this.isModified("token")) {
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }
    next();
});

resetTokenSchema.methods.compareToken = async function (token) {
    const result = await bcrypt.compareSync(token, this.token);
    return result;
};

export default mongoose.model("ResetToken", resetTokenSchema);
