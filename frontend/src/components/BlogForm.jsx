import { useState } from "react";

// Used for both creating and editing a blog.
export default function BlogForm({ heading, initial, categories, submitLabel, busy, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card mb" onSubmit={handleSubmit}>
      <h2>{heading}</h2>

      {error && (
        <div className="auth-error" role="alert">
          {error.message}
          {error.details?.length > 0 && <ul>{error.details.map((d) => <li key={d}>{d}</li>)}</ul>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="blog-title">Title</label>
        <input id="blog-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="form-group">
        <label htmlFor="blog-category">Category</label>
        <select id="blog-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {(categories.length ? categories : ["General"]).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="blog-content">Content</label>
        <textarea id="blog-content" rows="5" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>

      <div className="row">
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving..." : submitLabel}</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}