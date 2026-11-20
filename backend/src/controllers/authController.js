import { authService } from "../services/authService.js";

export const register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json({ success: true, data: result });
};

export const me = (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};