import { blogService } from "../services/blogService.js";
import AppError from "../utils/AppError.js";

// MongoDB ids are 24 hex characters.
function parseId(req) {
  const id = req.params.id;
  if (!/^[a-f\d]{24}$/i.test(id)) throw new AppError(400, "Invalid blog id.");
  return id;
}

export const getBlogs = async (req, res) => {
  const { items, pagination } = await blogService.list(req.query);
  res.status(200).json({ success: true, data: items, pagination });
};

export const getBlog = async (req, res) => {
  res.status(200).json({ success: true, data: await blogService.get(parseId(req)) });
};

export const createBlog = async (req, res) => {
  res.status(201).json({ success: true, data: await blogService.create(req.body, req.user) });
};

export const updateBlog = async (req, res) => {
  res.status(200).json({ success: true, data: await blogService.update(parseId(req), req.body, req.user) });
};

export const deleteBlog = async (req, res) => {
  await blogService.remove(parseId(req), req.user);
  res.status(200).json({ success: true, message: "Blog deleted." });
};