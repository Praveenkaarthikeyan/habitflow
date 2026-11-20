import { habitStore } from "../models/habitStore.js";
import AppError from "../utils/AppError.js";

function getOrThrow(id) {
  const habit = habitStore.findById(id);
  if (!habit) throw new AppError(404, `Habit with id ${id} was not found.`);
  return habit;
}

export const habitService = {
  // Supports ?category=Health&status=active&search=read&page=1&limit=10
  list({ category, status, search, page = 1, limit = 10 }) {
    let items = habitStore.findAll();

    if (category) items = items.filter((h) => h.category === category);
    if (status) items = items.filter((h) => h.status === status);
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter((h) => h.title.toLowerCase().includes(q));
    }

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const total = items.length;
    const start = (safePage - 1) * safeLimit;

    return {
      items: items.slice(start, start + safeLimit),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      },
    };
  },

  get: (id) => getOrThrow(id),

  create: (data) => habitStore.create(data),

  update(id, data) {
    getOrThrow(id);
    return habitStore.update(id, data);
  },

  remove(id) {
    getOrThrow(id);
    habitStore.remove(id);
  },
};