import { Blog } from "../models/Blog.js";
import AppError from "../utils/AppError.js";
import escapeRegex from "../utils/escapeRegex.js";
import { BLOG_CATEGORIES } from "../utils/blogCategories.js";

const toBlog = (b) => ({
  id: b.id,
  title: b.title,
  content: b.content,
  category: b.category || "General",
  authorId: String(b.author?._id ?? b.author ?? ""),
  authorName: b.author?.name ?? "Unknown author",
  createdAt: b.createdAt,
  updatedAt: b.updatedAt,
});

async function getOrThrow(id) {
  const blog = await Blog.findById(id).populate("author", "name");
  if (!blog) throw new AppError(404, "Blog not found.");
  return blog;
}

function assertOwner(blog, user) {
  if (String(blog.author?._id) !== user.id) throw new AppError(403, "You can only modify your own blogs.");
}

export const blogService = {
  categories: () => BLOG_CATEGORIES,

  async list({ search, category, page = 1, limit = 10 }) {
    const filter = {};

    if (category) {
      if (!BLOG_CATEGORIES.includes(category)) throw new AppError(400, "Unknown category.");
      // Blogs made before categories existed have no field, so treat them as "General".
      filter.category = category === "General"
        ? { $in: ["General", null] }
        : category;
    }

    if (search) {
      const rx = new RegExp(escapeRegex(String(search).slice(0, 100)), "i");
      filter.$or = [{ title: rx }, { content: rx }];
    }

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .populate("author", "name"),
      Blog.countDocuments(filter),
    ]);

    return {
      items: items.map(toBlog),
      pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.max(1, Math.ceil(total / safeLimit)) },
    };
  },

  async get(id) {
    return toBlog(await getOrThrow(id));
  },

  async create(data, user) {
    const blog = await Blog.create({ ...data, author: user.id });
    await blog.populate("author", "name");
    return toBlog(blog);
  },

  async update(id, data, user) {
    const blog = await getOrThrow(id);
    assertOwner(blog, user);
    blog.title = data.title;
    blog.content = data.content;
    blog.category = data.category;
    await blog.save();
    return toBlog(blog);
  },

  async remove(id, user) {
    const blog = await getOrThrow(id);
    assertOwner(blog, user);
    await blog.deleteOne();
  },
};