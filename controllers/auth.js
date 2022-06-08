import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { toTitleCase, validateEmail } from "../config/functionSupport.js";

export const register = async (req, res, next) => {
  let { username, email, name, password, aPassword } = req.body;
  if( !username || !email || !name || !password || !aPassword) {
    return res.json({ message: "All filled must be required" });  
  }
  if (username.length < 6 || username.length > 253) {
    return res.json({ error: "Username must be 6-253 character"});
  } else {
    if (validateEmail(email)) {
      username = toTitleCase(username);
      if (password.length < 6 || password.length > 255) {
        return res.json({ error: "Password must be 6 character" });
      } else {
      try {
        if (password !== aPassword) {
          return res.json({ error: "aPassword isn't correct" });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.password, salt);
          const data = await User.findOne({ email: email });
          if (data) {
            return res.json({ error: "Email already exists "});
          } else {
            const newUser = new User({
              ...req.body,
              password: hash,
            });

            await newUser.save();
            res.status(200).send("User has been created.");
          }
        }
      } catch (err) {
        next(err);
      }
    }
  }
}
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};