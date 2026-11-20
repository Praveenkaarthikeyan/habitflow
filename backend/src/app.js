import "express-async-errors";
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import requestLogger from "./middleware/requestLogger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "1mb" })); // lets us read JSON request bodies
app.use(requestLogger);

app.use("/api", routes);

app.use(notFound);     // must come after all routes
app.use(errorHandler); // must be last

export default app;