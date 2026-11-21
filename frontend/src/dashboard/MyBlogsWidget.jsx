import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi } from "../services/api.js";
import EmptyState from "../components/EmptyState.jsx";

export default function MyBlogsWidget() {
  const [state, setState] = useState({ loading: true, items: [], total: 0, error: null });

  useEffect(() => {
    let cancelled = false;
    blogApi.mine({ limit: 5 })
      .then((res) => { if (!cancelled) setState({ loading: false, items: res.data, total: res.pagination.total, error: null }); })
      .catch((err) => { if (!cancelled) setState({ loading: false, items: [], total: 0, error: err.message }); });
    return () => { cancelled = true; };
  }, []);

  if (state.loading) return <p className="muted">Loading...</p>;
  if (state.error) return <p className="muted">{state.error}</p>;
  if (state.items.length === 0) {
    return (
      <>
        <EmptyState emoji="✍️" title="No blogs yet" />
        <Link to="/blogs" className="btn btn-sm" style={{ alignSelf: "center" }}>Write one</Link>
      </>
    );
  }

  return (
    <div>
      {state.items.map((b) => (
        <div className="list-item" key={b.id}>
          <div>
            <Link to={`/blogs/${b.id}`} className="blog-title-link">{b.title}</Link>
            <div className="muted">{b.category} · {new Date(b.createdAt).toLocaleDateString("en-IN")}</div>
          </div>
        </div>
      ))}
      <p style={{ marginTop: 10 }}>
        <Link to="/my-blogs" className="back-link">View all {state.total} →</Link>
      </p>
    </div>
  );
}