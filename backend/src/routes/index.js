import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import habitRoutes from "./habitRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import blogRoutes from "./blogRoutes.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/blogs", blogRoutes);
router.use("/habits", authenticate, habitRoutes); // now private (still in memory; MongoDB and ownership come later)

export default router;