import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { validateProfile, validatePasswordChange } from "../middleware/validateUser.js";
import { updateMe, changePassword } from "../controllers/userController.js";

const router = Router();

router.use(authenticate); // every route here is private

router.put("/me", validateProfile, updateMe);
router.put("/me/password", validatePasswordChange, changePassword);

export default router;