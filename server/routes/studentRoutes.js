import { Router } from "express";
import * as c from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
const r = Router();
r.use(protect, authorize("student"));
r.get("/dashboard", c.dashboard);
r.route("/profile").get(c.profile).put(c.updateProfile);
r.post("/resume", upload.single("resume"), c.uploadResume);
export default r;

