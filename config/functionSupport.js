import passwordValidator from "password-validator";
import User from "../models/User.js";
import ResetToken from "../models/resetToken.js";
import mongoose from 'mongoose';


export const validatePassword = (password) => {
  var schema = new passwordValidator();

  schema
  .is().min(8)                                    
  .is().max(100)                                 
  .has().uppercase()                            
  .has().lowercase()                           
  .has().digits(2)                            
  .has().not().spaces()                          
  .is().not().oneOf(['Passw0rd', 'Password123']);
  if (schema.validate(password)) {
    return true;
  } else {
    var failedList = schema.validate('password', { list: true });
    return failedList;
  }
};

export const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const validateEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  } else {
    return false;
  }
};

export const isResetTokenValid = async (req, res, next) => {
  let { token, id } = req.query;
  if(!token || !id) return res.json({ error: "Invalid Request"});
  
  if(!mongoose.isValidObjectId(id)) return res.json({error: "Invalid user"});

  const user = await User.findById(id);
  if(!user) return res.json({ error: "User not found" });

  const resetToken = await ResetToken.findOne({ owner: user._id });
  if(!resetToken) return res.json({ error: "Reset token not found" });

  const isValid = await resetToken.compareToken(token);
  if(!isValid) return res.json({ error: "Reset token is not invalid"});

  req.user = user;
  next();
}