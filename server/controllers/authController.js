import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import { signToken } from "../utils/token.js";
const send = (res, user, status = 200) => {
  const token = signToken(user._id, user.role);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 604800000,
  });
  res
    .status(status)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};
export const register = async (req, res) => {
  const { name, email, password, role, companyName, ...details } = req.body;
  if (!["student", "company"].includes(role))
    return res
      .status(400)
      .json({ success: false, message: "Choose student or company" });
  if (await User.findOne({ email }))
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });
  const user = await User.create({ name, email, password, role });
  if (role === "student") await Student.create({ user: user._id, ...details });
  else
    await Company.create({
      user: user._id,
      companyName: companyName || name,
      ...details,
    });
  send(res, user, 201);
};
export const login = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email?.toLowerCase(),
  }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  send(res, user);
};
export const me = async (req, res) =>
  res.json({ success: true, user: req.user });
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};
