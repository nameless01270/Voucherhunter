import User from "../models/User.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import { validatePassword } from "../config/functionSupport.js";
 
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
      if (validatePassword(newPassword) === true){
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
      } else if (validatePassword(newPassword) !== true) {
        var failedList = validatePassword(newPassword);
        for (let i = 0; i < failedList.length; i++){
          if (failedList[i] === 'min'){return res.json({ error: "Password must have minimum length 8" });}
          else if (failedList[i] === 'uppercase') {return res.json({ error: "Password must have a minimum of 1 upper case letter" });}
          else if (failedList[i] === 'lowercase') {return res.json({ error: "Password must have a minimum of 1 lower case letter" });}
          else if (failedList[i] === 'digits') {return res.json({ error: "Password must have at least 2 digits" });}
        }
      }
    }
  }
};

export const changeUserAvatar = async (req, res, next) => {
  let { uId, userImage } = req.body;
  let editUserImage = req.file.filename;
  const filePath = `../VOUCHER_HUNTER_BE/public/uploads/users/${editUserImage}`;
  if (!uId || !editUserImage) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
      return res.json({ uId, userImage, editUserImage});
    });
  } else {
    try {
      await User.findByIdAndUpdate(uId, { userImage: editUserImage });
      return res.status(200).json({ success: "Change User avatar successfully" });
    } catch (err) {
      next(err);
    }
  }
};