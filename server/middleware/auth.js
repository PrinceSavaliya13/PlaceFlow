import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const protect = async (req, res, next) => {
  let token =
    req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  try {
    const d = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(d.id);
    if (!req.user || !req.user.isActive) throw Error();
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
export const authorize =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : res.status(403).json({ success: false, message: "Permission denied" });
