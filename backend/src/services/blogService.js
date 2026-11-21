import mongoose from "mongoose";
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

  // baseFilter lets callers restrict the list, e.g. { author: userId } for "my blogs".
  async list({ search, category, page = 1, limit = 10 }, baseFilter = {}) {
    const filter = { ...baseFilter };

    if (category) {
      if (!BLOG_CATEGORIES.includes(category)) throw new AppError(400, "Unknown category.");
      filter.category = category === "General" ? { $in: ["General", null] } : category;
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

  // Numbers for the user's dashboard. Aggregation doesn't auto-cast ids, so convert explicitly.
  async myStats(user) {
    const authorId = new mongoose.Types.ObjectId(user.id);

    const rows = await Blog.aggregate([
      { $match: { author: authorId } },
      { $group: { _id: { $ifNull: ["$category", "General"] }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);
    const byCategory = rows.map((r) => ({ category: r._id, count: r.count }));
    const total = byCategory.reduce((sum, r) => sum + r.count, 0);

    const latest = await Blog.findOne({ author: authorId }).sort({ createdAt: -1 }).select("title createdAt");
    return {
      total,
      byCategory,
      latest: latest ? { id: latest.id, title: latest.title, createdAt: latest.createdAt } : null,
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