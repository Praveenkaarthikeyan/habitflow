import { Router } from "express";
import { getHabits, getHabit, createHabit, updateHabit, deleteHabit } from "../controllers/habitController.js";
import { validateHabit } from "../middleware/validateHabit.js";

const router = Router();

router.get("/", getHabits);
router.post("/", validateHabit, createHabit);
router.get("/:id", getHabit);
router.put("/:id", validateHabit, updateHabit);
router.delete("/:id", deleteHabit);

export default router;