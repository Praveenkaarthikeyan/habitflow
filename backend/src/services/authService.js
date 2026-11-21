import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import AppError from "../utils/AppError.js";

const ID_PATTERN = /^[a-f\d]{24}$/i;

// Never send the password hash to the client.
const toPublic = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

const signToken = (user) => jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const authService = {
  async register({ name, email, password }) {
    if (await User.exists({ email })) throw new AppError(409, "An account with this email already exists.");

    const passwordHash = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await User.create({ name, email, passwordHash });
    } catch (err) {
      // Two sign-ups at the same instant: the unique index catches the loser.
      if (err.code === 11000) throw new AppError(409, "An account with this email already exists.");
      throw err;
    }
    return { user: toPublic(user), token: signToken(user) };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+passwordHash");
    // Same message for "no such email" and "wrong password".
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) throw new AppError(401, "Invalid email or password.");
    return { user: toPublic(user), token: signToken(user) };
  },

  async getUser(id) {
    const user = ID_PATTERN.test(String(id)) ? await User.findById(id) : null;
    if (!user) throw new AppError(401, "Account no longer exists. Please log in again.");
    return toPublic(user);
  },
};