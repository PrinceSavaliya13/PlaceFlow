import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "./middleware/error.js";
import auth from "./routes/authRoutes.js";
import students from "./routes/studentRoutes.js";
import companies from "./routes/companyRoutes.js";
import jobs from "./routes/jobRoutes.js";
import applications from "./routes/applicationRoutes.js";
import admin from "./routes/adminRoutes.js";
import notifications from "./routes/notificationRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";
const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());
app.use(
  cors({
    origin(origin, callback) {
      const isLocalDev =
        !origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalDev || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin is not allowed"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Placement API healthy" }),
);
app.use("/api/auth", auth);
app.use("/api/students", students);
app.use("/api/companies", companies);
app.use("/api/jobs", jobs);
app.use("/api/applications", applications);
app.use("/api/admin", admin);
app.use("/api/notifications", notifications);
app.use(notFound);
app.use(errorHandler);
export default app;
