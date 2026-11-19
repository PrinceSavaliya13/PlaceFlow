import { Router } from "express";
import { body } from "express-validator";
import * as c from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
const r = Router();
r.post(
  "/register",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["student", "company"]),
  ],
  validate,
  c.register,
);
r.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  c.login,
);
r.post("/logout", c.logout);
r.get("/me", protect, c.me);
export default r;
