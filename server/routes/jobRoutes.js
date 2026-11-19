import { Router } from "express";
import * as c from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/auth.js";
const r = Router();
r.get("/", c.list);
r.get("/:id", c.get);
r.post("/", protect, authorize("company"), c.create);
r.route("/:id")
  .put(protect, authorize("company"), c.update)
  .delete(protect, authorize("company"), c.remove);
export default r;
