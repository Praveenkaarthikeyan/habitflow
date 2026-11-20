import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { userStore } from "../models/userStore.js";
import AppError from "../utils/AppError.js";

// Never send the password hash to the client.
const toPublic = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt });

const signToken = (user) =>
  jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const authService = {
  async register({ name, email, password }) {
    if (userStore.findByEmail(email)) throw new AppError(409, "An account with this email already exists.");
    const passwordHash = await bcrypt.hash(password, 10);
    const user = userStore.create({ name, email, passwordHash });
    return { user: toPublic(user), token: signToken(user) };
  },

  async login({ email, password }) {
    const user = userStore.findByEmail(email);
    // Same message for "no such email" and "wrong password", so attackers can't discover which emails exist.
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) throw new AppError(401, "Invalid email or password.");
    return { user: toPublic(user), token: signToken(user) };
  },

  getUser(id) {
    const user = userStore.findById(id);
    if (!user) throw new AppError(401, "Account no longer exists. Please log in again.");
    return toPublic(user);
  },
};