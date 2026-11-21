import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function start() {
  await connectDB(); // don't accept requests until the database is ready

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
}

start().catch((err) => {
  console.error("Could not start the server:", err.message);
  process.exit(1);
});