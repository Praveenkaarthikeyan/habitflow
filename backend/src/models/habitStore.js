// TEMPORARY in-memory storage. Data is lost when the server restarts.
// In Module 3 this file is replaced by a Mongoose model and the rest of the code barely changes.

let habits = [];
let nextId = 1;

export const habitStore = {
  findAll: () => habits,

  findById: (id) => habits.find((h) => h.id === id) || null,

  create: (data) => {
    const now = new Date().toISOString();
    const habit = { id: nextId++, ...data, createdAt: now, updatedAt: now };
    habits.push(habit);
    return habit;
  },

  update: (id, data) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return null;
    Object.assign(habit, data, { updatedAt: new Date().toISOString() });
    return habit;
  },

  remove: (id) => {
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) return false;
    habits.splice(index, 1);
    return true;
  },
};