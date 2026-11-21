import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { blogApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    blogApi.get(id)
      .then((res) => { if (!cancelled) setBlog(res.data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      setDeleting(true);
      await blogApi.remove(id);
      navigate("/blogs", { replace: true });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <>
      <p style={{ marginBottom: 14 }}><Link to="/blogs" className="back-link">← Back to all blogs</Link></p>

      {loading && <div className="card"><p className="muted">Loading blog...</p></div>}

      {!loading && error && (
        <div className="card">
          <div className="auth-error" role="alert">{error}</div>
          <Link to="/blogs" className="btn btn-sm">Go to blogs</Link>
        </div>
      )}

      {!loading && blog && (
        <article className="card blog-detail">
          <span className="badge">{blog.category}</span>
          <h1 style={{ marginTop: 8 }}>{blog.title}</h1>
          <div className="muted" style={{ margin: "6px 0 16px" }}>
            By {blog.authorName} · {new Date(blog.createdAt).toLocaleString("en-IN")}
            {blog.updatedAt !== blog.createdAt && " · edited"}
          </div>
          <p className="blog-content">{blog.content}</p>
          {blog.authorId === user.id && (
            <div className="row">
              <Link to={`/blogs/${blog.id}/edit`} className="btn btn-sm">Edit</Link>
              <button className="btn btn-sm btn-ghost" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </article>
      )}
    </>
  );
}