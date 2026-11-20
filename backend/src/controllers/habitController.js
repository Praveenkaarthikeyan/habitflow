import { habitService } from "../services/habitService.js";
import AppError from "../utils/AppError.js";

// Turns the :id in the URL into a number, or rejects it.
function parseId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, "Invalid habit id.");
  return id;
}

export const getHabits = (req, res) => {
  const { items, pagination } = habitService.list(req.query);
  res.status(200).json({ success: true, data: items, pagination });
};

export const getHabit = (req, res) => {
  const habit = habitService.get(parseId(req));
  res.status(200).json({ success: true, data: habit });
};

export const createHabit = (req, res) => {
  const habit = habitService.create(req.body);
  res.status(201).json({ success: true, data: habit });
};

export const updateHabit = (req, res) => {
  const habit = habitService.update(parseId(req), req.body);
  res.status(200).json({ success: true, data: habit });
};

export const deleteHabit = (req, res) => {
  habitService.remove(parseId(req));
  res.status(200).json({ success: true, message: "Habit deleted." });
};