import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import habitRoutes from "./habitRoutes.js";
import authRoutes from "./authRoutes.js";
import blogRoutes from "./blogRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/blogs", blogRoutes);
router.use("/habits", habitRoutes); // still public for now; gets login + ownership in Module 3
// Later: /tasks, /expenses, /learning-goals, ...

export default router;