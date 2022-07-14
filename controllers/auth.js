import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { toTitleCase, validateEmail, validatePassword } from "../config/functionSupport.js";
import { mailTransport, generateOTP, generateEmailTemplate, plainEmailTemplate } from "../utils/sendEmail.js";
import VerificationToken from "../models/verificationToken.js";

export const register = async (req, res, next) => {
  let { username, email, name, password, aPassword } = req.body;
  if( !username || !email || !name || !password || !aPassword) {
    return res.json({ message: "All filled must be required" });  
  }
  if (username.length < 6 || username.length > 253) {
    return res.json({ error: "Username must be 6-253 character"});
  } else {
    if (validateEmail(email) && validatePassword(password) === true) {
      username = toTitleCase(username);
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

            const OTP = generateOTP();
            const verificationToken = new VerificationToken({
              owner: newUser._id,
              token: OTP
            })
          

            await verificationToken.save();
            await newUser.save();

            mailTransport().sendMail({
              from: 'emailverification@email.com',
              to: newUser.email,
              subject: "Verify your email account",
              html: generateEmailTemplate(OTP),
            })

            res.status(200).send("User has been created.");
          }
        }
      } catch (err) {
        next(err);
      }
  } else if(!validateEmail(email)) {
    return res.json({ error: "Invalid Email"});
  } else if(validatePassword(password) !== true) {
    var failedList = validatePassword(password);
    for (let i = 0; i < failedList.length; i++){
      if (failedList[i] === 'min'){return res.json({ error: "Password must have minimum length 8" });}
      else if (failedList[i] === 'uppercase') {return res.json({ error: "Password must have a minimum of 1 upper case letter" });}
      else if (failedList[i] === 'lowercase') {return res.json({ error: "Password must have a minimum of 1 lower case letter" });}
      else if (failedList[i] === 'digits') {return res.json({ error: "Password must have at least 2 digits" });}
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

export const verifyEmail = async (req, res, next) => {
  let { uId, otp } = req.body;
  if (!uId || !otp.trim()) return res.json({ error: "All field must be required" });

  const user = await User.findById(uId);
  if(!user) return res.json({ error: "User not found" });
  
  if (user.verified) return res.json({ error: "This account is already verified!"});

  const token = await VerificationToken.findOne({owner: user._id});
  if(!token) return res.json({ error: "User not found" });

  const isMatched = await token.compareToken(otp);
  if(!isMatched) return res.json({ error: "Please provide a valid token" });

  user.verified = true;

  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: 'emailverification@email.com',
    to: user.email,
    subject: "Verify your email account",
    html: plainEmailTemplate(
      "Email Verified Successfully",
      "Thanks for connecting with us"
    ),
  });

  return res.status(200).json({ success: "Verified Successfully" });

};