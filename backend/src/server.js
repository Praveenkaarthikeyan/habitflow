import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`HabitFlow API running on http://localhost:${env.port} (${env.nodeEnv})`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use. Stop the other server or change PORT in .env.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});