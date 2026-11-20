let blogs = [];
let nextId = 1;

export const blogStore = {
  findAll: () => blogs,
  findById: (id) => blogs.find((b) => b.id === id) || null,
  create: (data) => {
    const now = new Date().toISOString();
    const blog = { id: nextId++, ...data, createdAt: now, updatedAt: now };
    blogs.push(blog);
    return blog;
  },
  update: (id, data) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return null;
    Object.assign(blog, data, { updatedAt: new Date().toISOString() });
    return blog;
  },
  remove: (id) => {
    const i = blogs.findIndex((b) => b.id === id);
    if (i === -1) return false;
    blogs.splice(i, 1);
    return true;
  },
};