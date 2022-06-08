import User from "../models/User.js";
import bcrypt from "bcryptjs"; 

export const updateUser = async (req,res,next) => {
  let { uId, name, phoneNumber } = req.body;
  if (!uId || !name || !phoneNumber) {
    return res.json({ message: "All filled must be required" });
  } else {
    await User.findByIdAndUpdate(uId, {
      name: name,
      phoneNumber: phoneNumber,
      updatedAt: Date.now(),
    });
    res.status(200).json({ success: "User updated successfully" });
  }
};
export const deleteUser = async (req,res,next) => {
  let { uId } = req.body;
  if (!uId) {
    return res.json({ message: "All filled must be required" });
  } else {
    await User.findByIdAndDelete(uId);
    res.status(200).json({ success: "User deleted successfully" });
  }
};
export const getUser = async (req,res,next) => {
  let { uId } = req.body;
  if (!uId) {
    return res.json({ error: "All filled must be required" });
  } else {
    try {
      let user = await User.findById(uId);
      if (user) {
        return res.status(200).json({ user });
      }
    } catch (err) {
      next(err);
    }
  }
};
export const getUsers = async (req,res,next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
export const changePassword = async (req, res, next)=>{
  let { uId, oldPassword, newPassword } = req.body;
  if (!uId || !oldPassword || !newPassword) {
    return res.json({ message: "All filled must be required" });
  } else {
    const data = await User.findOne({ _id: uId });
    if (!data) {
      return res.json({
        error: "Invalid user",
      });
    } else {
      const oldPassCheck = await bcrypt.compare(oldPassword, data.password);
      if (oldPassCheck) {
        newPassword = bcrypt.hashSync(newPassword, 10);
        let passChange = User.findByIdAndUpdate(uId, {
          password: newPassword,
        });
        passChange.exec((err, result) => {
          if (err) console.log(err);
          return res.status(200).json({ success: "Password updated successfully" });
        });
      } else {
        return res.json({
          error: "Your old password is wrong!!",
        });
      }
    }
  }
};