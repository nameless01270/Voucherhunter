import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    userImage: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum:["male", "female", "LGBT"],
    },
    dateOfBirth: {
      day: {
        type: Number,
      },
      month: {
        type: Number,
      },
      year: {
        type: Number,
      }
    },
    country: {
      type: String,
    },
    history: {
      type: Array,
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);