import { Router } from "express";
import {
  getBlogs, getBlog, getCategories, getMyBlogs, getMyStats, createBlog, updateBlog, deleteBlog,
} from "../controllers/blogController.js";
import { validateBlog } from "../middleware/validateBlog.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

// Public reads
router.get("/", getBlogs);
router.get("/categories", getCategories);

// Private: the logged-in user's own blogs (declare before "/:id")
router.get("/mine", authenticate, getMyBlogs);
router.get("/mine/stats", authenticate, getMyStats);

router.get("/:id", getBlog);

// Only logged-in users can write; only the author can edit or delete
router.post("/", authenticate, validateBlog, createBlog);
router.put("/:id", authenticate, validateBlog, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

export default router;