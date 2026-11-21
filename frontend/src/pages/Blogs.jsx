import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import EmptyState from "../components/EmptyState.jsx";
import BlogForm from "../components/BlogForm.jsx";

const emptyForm = { title: "", content: "", category: "General" };
const excerpt = (text, max = 160) => (text.length > max ? `${text.slice(0, max).trimEnd()}...` : text);

export default function Blogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [formKey, setFormKey] = useState(0); // changing it resets the create form
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [listError, setListError] = useState(null);

  useEffect(() => {
    blogApi.categories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 5 };
      if (query) params.search = query;
      if (category) params.category = category;
      const res = await blogApi.list(params);
      setBlogs(res.data);
      setPagination(res.pagination);
      setListError(null);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, query, category]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    try {
      setSaving(true);
      setFormError(null);
      await blogApi.create(form);
      setFormKey((k) => k + 1);
      if (page === 1) await load();
      else setPage(1);
    } catch (err) {
      setFormError({ message: err.message, details: err.details });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await blogApi.remove(id);
      if (blogs.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      setListError(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const pickCategory = (c) => {
    setCategory(c);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setQuery("");
    setCategory("");
    setPage(1);
  };

  const filtering = Boolean(query || category);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Blogs</h1>
          <p className="muted">Share what you are learning.</p>
        </div>
      </div>

      <BlogForm
        key={formKey}
        heading="Create blog"
        initial={emptyForm}
        categories={categories}
        submitLabel="Publish"
        busy={saving}
        error={formError}
        onSubmit={handleCreate}
      />

      <form className="row mb" onSubmit={handleSearch}>
        <input placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-ghost" type="submit" style={{ flexShrink: 0 }}>Search</button>
        {filtering && (
          <button className="btn btn-ghost" type="button" style={{ flexShrink: 0 }} onClick={clearFilters}>Clear</button>
        )}
      </form>

      <div className="tabs">
        <button className={`chip ${category === "" ? "active" : ""}`} onClick={() => pickCategory("")}>All</button>
        {categories.map((c) => (
          <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => pickCategory(c)}>{c}</button>
        ))}
      </div>

      {listError && <div className="auth-error" role="alert">{listError}</div>}

      {loading ? (
        <div className="card"><p className="muted">Loading blogs...</p></div>
      ) : blogs.length === 0 ? (
        <div className="card">
          <EmptyState
            emoji="✍️"
            title={filtering ? "No blogs match your filters" : "No blogs yet"}
            message={filtering ? "Try a different word or category." : "Publish the first one above."}
          />
        </div>
      ) : (
        <div className="grid">
          {blogs.map((b) => (
            <article className="card blog-card" key={b.id}>
              <h3><Link to={`/blogs/${b.id}`} className="blog-title-link">{b.title}</Link></h3>
              <div className="row" style={{ flexWrap: "wrap", margin: "4px 0" }}>
                <span className="badge">{b.category}</span>
                <span className="muted">By {b.authorName} · {new Date(b.createdAt).toLocaleString("en-IN")}</span>
              </div>
              <p className="blog-content">{excerpt(b.content)}</p>
              <div className="row">
                <Link to={`/blogs/${b.id}`} className="btn btn-sm">Read more</Link>
                {b.authorId === user.id && (
                  <>
                    <Link to={`/blogs/${b.id}/edit`} className="btn btn-sm btn-ghost">Edit</Link>
                    <button className="btn btn-sm btn-ghost" onClick={() => handleDelete(b.id)}>Delete</button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="row" style={{ marginTop: 18, justifyContent: "center" }}>
          <button className="btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="muted">Page {pagination.page} of {pagination.totalPages}</span>
          <button className="btn btn-sm btn-ghost" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}