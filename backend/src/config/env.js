import dotenv from "dotenv";

dotenv.config();

function requireEnv(name, minLength = 1) {
  const value = process.env[name];
  if (!value || value.length < minLength) {
    console.error(`${name} is missing or too short. Set it in backend/.env`);
    process.exit(1);
  }
  return value;
}

// CLIENT_ORIGIN can hold several addresses separated by commas, without trailing slashes.
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigins,
  jwtSecret: requireEnv("JWT_SECRET", 16),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  mongoUri: requireEnv("MONGODB_URI"),
};