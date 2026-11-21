import { authService } from "../services/authService.js";

export const updateMe = async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, data: { user } });
};

export const changePassword = async (req, res) => {
  const result = await authService.changePassword(req.user.id, req.body);
  res.status(200).json({ success: true, data: result });
};