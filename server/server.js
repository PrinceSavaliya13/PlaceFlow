import "dotenv/config";
import "express-async-errors";
import { connectDB } from "./config/db.js";
import app from "./app.js";
connectDB()
  .then(() =>
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server on ${process.env.PORT || 5000}`),
    ),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
