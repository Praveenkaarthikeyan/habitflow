import { Router } from "express";
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";
import { validateBlog } from "../middleware/validateBlog.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

// Anyone can read
router.get("/", getBlogs);
router.get("/:id", getBlog);

// Only logged-in users can write; only the author can edit or delete
router.post("/", authenticate, validateBlog, createBlog);
router.put("/:id", authenticate, validateBlog, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

export default router;