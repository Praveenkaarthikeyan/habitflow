import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { blogApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import BlogForm from "../components/BlogForm.jsx";

export default function BlogEdit() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([blogApi.get(id), blogApi.categories()])
      .then(([b, c]) => {
        if (cancelled) return;
        setBlog(b.data);
        setCategories(c.data);
      })
      .catch((err) => { if (!cancelled) setLoadError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (form) => {
    try {
      setSaving(true);
      setFormError(null);
      await blogApi.update(id, form);
      navigate(`/blogs/${id}`, { replace: true });
    } catch (err) {
      setFormError({ message: err.message, details: err.details });
      setSaving(false);
    }
  };

  const notOwner = blog && blog.authorId !== user.id;

  return (
    <>
      <p style={{ marginBottom: 14 }}><Link to="/blogs" className="back-link">← Back to all blogs</Link></p>

      {loading && <div className="card"><p className="muted">Loading blog...</p></div>}

      {!loading && loadError && <div className="card"><div className="auth-error" role="alert">{loadError}</div></div>}

      {!loading && notOwner && (
        <div className="card"><div className="auth-error" role="alert">You can only edit your own blogs.</div></div>
      )}

      {!loading && blog && !notOwner && (
        <BlogForm
          heading="Edit blog"
          initial={{ title: blog.title, content: blog.content, category: blog.category }}
          categories={categories}
          submitLabel="Save changes"
          busy={saving}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/blogs/${id}`)}
        />
      )}
    </>
  );
}