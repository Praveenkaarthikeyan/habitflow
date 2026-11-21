import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validateAuth.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiters.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/register", registerLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
router.get("/me", authenticate, me);

export default router;