import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import AppError from "../utils/AppError.js";

const ID_PATTERN = /^[a-f\d]{24}$/i;

// Never send the password hash to the client.
const toPublic = (u) => ({ id: u.id, name: u.name, email: u.email, college: u.college || "", createdAt: u.createdAt });

const signToken = (user) => jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const authService = {
  async register({ name, email, password }) {
    if (await User.exists({ email })) throw new AppError(409, "An account with this email already exists.");

    const passwordHash = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await User.create({ name, email, passwordHash });
    } catch (err) {
      if (err.code === 11000) throw new AppError(409, "An account with this email already exists.");
      throw err;
    }
    return { user: toPublic(user), token: signToken(user) };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+passwordHash");
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) throw new AppError(401, "Invalid email or password.");
    return { user: toPublic(user), token: signToken(user) };
  },

  // tokenIssuedAt is the JWT "iat" claim, in seconds.
  async getUser(id, tokenIssuedAt) {
    const user = ID_PATTERN.test(String(id)) ? await User.findById(id) : null;
    if (!user) throw new AppError(401, "Account no longer exists. Please log in again.");
    if (
      tokenIssuedAt &&
      user.passwordChangedAt &&
      Math.floor(user.passwordChangedAt.getTime() / 1000) > tokenIssuedAt
    ) {
      throw new AppError(401, "Your password was changed. Please log in again.");
    }
    return toPublic(user);
  },

  async updateProfile(userId, { name, college }) {
    const user = await User.findByIdAndUpdate(userId, { name, college }, { new: true, runValidators: true });
    if (!user) throw new AppError(401, "Account no longer exists. Please log in again.");
    return toPublic(user);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select("+passwordHash");
    if (!user) throw new AppError(401, "Account no longer exists. Please log in again.");

    // 400, not 401: the frontend treats any 401 as "session expired" and would log the user out.
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new AppError(400, "Current password is incorrect.");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    await user.save();
    // A fresh token keeps the current device logged in; every older token is now rejected.
    return { user: toPublic(user), token: signToken(user) };
  },
};