import { blogService } from "../services/blogService.js";
import AppError from "../utils/AppError.js";

function parseId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, "Invalid blog id.");
  return id;
}

export const getBlogs = (req, res) => {
  const { items, pagination } = blogService.list(req.query);
  res.status(200).json({ success: true, data: items, pagination });
};

export const getBlog = (req, res) => {
  res.status(200).json({ success: true, data: blogService.get(parseId(req)) });
};

export const createBlog = (req, res) => {
  res.status(201).json({ success: true, data: blogService.create(req.body, req.user) });
};

export const updateBlog = (req, res) => {
  res.status(200).json({ success: true, data: blogService.update(parseId(req), req.body, req.user) });
};

export const deleteBlog = (req, res) => {
  blogService.remove(parseId(req), req.user);
  res.status(200).json({ success: true, message: "Blog deleted." });
};