import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import requestLogger from "./middleware/requestLogger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

// Render sits behind one proxy. Without this, the rate limiter sees everyone as one IP.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // No origin = Postman or server-to-server; otherwise it must be on the allow list.
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ success: true, message: "HabitFlow API is running. Try /api/health" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;