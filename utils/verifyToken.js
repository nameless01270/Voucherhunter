import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
    let { loggedInUserId } = req.body;
    if (req.user.id === loggedInUserId) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    let reqUser = await User.findById(req.body.loggedInUserId);
    if (reqUser.isAdmin === false) {
      res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch {
    res.status(404);
  }
};