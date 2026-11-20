import { blogStore } from "../models/blogStore.js";
import AppError from "../utils/AppError.js";

function getOrThrow(id) {
  const blog = blogStore.findById(id);
  if (!blog) throw new AppError(404, `Blog with id ${id} was not found.`);
  return blog;
}

// Only the author may change or delete a blog.
function assertOwner(blog, userId) {
  if (blog.authorId !== userId) throw new AppError(403, "You can only modify your own blogs.");
}

export const blogService = {
  list({ search, page = 1, limit = 10 }) {
    let items = [...blogStore.findAll()].reverse(); // newest first
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter((b) => b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q));
    }
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const total = items.length;
    const start = (safePage - 1) * safeLimit;
    return {
      items: items.slice(start, start + safeLimit),
      pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.max(1, Math.ceil(total / safeLimit)) },
    };
  },

  get: (id) => getOrThrow(id),

  create: (data, user) => blogStore.create({ ...data, authorId: user.id, authorName: user.name }),

  update(id, data, user) {
    assertOwner(getOrThrow(id), user.id);
    return blogStore.update(id, data);
  },

  remove(id, user) {
    assertOwner(getOrThrow(id), user.id);
    blogStore.remove(id);
  },
};