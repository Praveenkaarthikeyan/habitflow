import { useCallback, useEffect, useState } from "react";
import { blogApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import EmptyState from "../components/EmptyState.jsx";

const emptyForm = { title: "", content: "" };

export default function Blogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await blogApi.list({ page, limit: 5 });
      setBlogs(res.data);
      setPagination(res.pagination);
      setError(null);
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (editingId) await blogApi.update(editingId, form);
      else await blogApi.create(form);
      setForm(emptyForm);
      setEditingId(null);
      setPage(1);
      await load();
    } catch (err) {
      setError({ message: err.message, details: err.details });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (b) => {
    setEditingId(b.id);
    setForm({ title: b.title, content: b.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditingId(null); setForm(emptyForm); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await blogApi.remove(id);
      await load();
    } catch (err) {
      setError({ message: err.message });
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Blogs</h1>
          <p className="muted">Share what you are learning.</p>
        </div>
      </div>

      <form className="card mb" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit blog" : "Create blog"}</h2>
        {error && (
          <div className="auth-error" role="alert">
            {error.message}
            {error.details?.length > 0 && <ul>{error.details.map((d) => <li key={d}>{d}</li>)}</ul>}
          </div>
        )}
        <div className="form-group"><label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="form-group"><label>Content</label>
          <textarea rows="4" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
        <div className="row">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Publish"}
          </button>
          {editingId && <button className="btn btn-ghost" type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      {loading ? (
        <div className="card"><p className="muted">Loading blogs...</p></div>
      ) : blogs.length === 0 ? (
        <div className="card"><EmptyState emoji="✍️" title="No blogs yet" message="Publish the first one above." /></div>
      ) : (
        <div className="grid">
          {blogs.map((b) => (
            <article className="card blog-card" key={b.id}>
              <h3>{b.title}</h3>
              <div className="muted">By {b.authorName} · {new Date(b.createdAt).toLocaleString("en-IN")}</div>
              <p className="blog-content">{b.content}</p>
              {b.authorId === user.id && (
                <div className="row">
                  <button className="btn btn-sm btn-ghost" onClick={() => startEdit(b)}>Edit</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => handleDelete(b.id)}>Delete</button>
                </div>
              )}
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