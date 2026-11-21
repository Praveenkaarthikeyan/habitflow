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

app.use(helmet()); // sets safer HTTP headers
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ success: true, message: "HabitFlow API is running. Try /api/health" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;