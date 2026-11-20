let users = [];
let nextId = 1;

export const userStore = {
  findByEmail: (email) => users.find((u) => u.email === email) || null,
  findById: (id) => users.find((u) => u.id === id) || null,
  create: (data) => {
    const user = { id: nextId++, ...data, createdAt: new Date().toISOString() };
    users.push(user);
    return user;
  },
};