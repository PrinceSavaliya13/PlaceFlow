import { Router } from "express";
import * as c from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
const r = Router();
r.use(protect, authorize("student"));
r.get("/", c.mine);
r.post("/:jobId", c.apply);
r.patch("/:id/withdraw", c.withdraw);
export default r;
