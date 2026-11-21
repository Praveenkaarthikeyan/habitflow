import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatisticsCard from "../components/StatisticsCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import EmptyState from "../components/EmptyState.jsx";

const excerpt = (text, max = 140) => (text.length > max ? `${text.slice(0, max).trimEnd()}...` : text);

export default function MyBlogs() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(
    () => blogApi.myStats().then((res) => setStats(res.data)).catch(() => {}),
    []
  );

  useEffect(() => {
    loadStats();
    blogApi.categories().then((res) => setCategories(res.data)).catch(() => {});
  }, [loadStats]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 5 };
      if (query) params.search = query;
      if (category) params.category = category;
      const res = await blogApi.mine(params);
      setBlogs(res.data);
      setPagination(res.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, query, category]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await blogApi.remove(id);
      if (blogs.length === 1 && page > 1) setPage(page - 1);
      else await load();
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const pickCategory = (c) => { setCategory(c); setPage(1); };
  const clearFilters = () => { setSearch(""); setQuery(""); setCategory(""); setPage(1); };
  const filtering = Boolean(query || category);
  const firstName = (user.name || "").split(" ")[0];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>My Blogs</h1>
          <p className="muted">Hi {firstName}, these are the posts you have written.</p>
        </div>
        <Link to="/blogs" className="btn">+ Write a blog</Link>
      </div>

      <div className="grid grid-4 mb">
        <StatisticsCard icon="📝" label="Total posts" value={stats ? stats.total : "-"} />
        <StatisticsCard icon="🗂️" label="Categories used" value={stats ? stats.byCategory.length : "-"} />
        <StatisticsCard
          icon="🕘"
          label="Latest post"
          value={stats?.latest ? new Date(stats.latest.createdAt).toLocaleDateString("en-IN") : "None yet"}
          hint={stats?.latest?.title}
        />
      </div>

      {stats && stats.total > 0 && (
        <div className="card mb">
          <h2>Posts by category</h2>
          {stats.byCategory.map((row) => (
            <div key={row.category} style={{ marginBottom: 12 }}>
              <div className="list-item" style={{ border: "none", padding: "0 0 5px" }}>
                <span>{row.category}</span>
                <span className="muted">{row.count}</span>
              </div>
              <ProgressBar value={(row.count / stats.total) * 100} />
            </div>
          ))}
        </div>
      )}

      <form className="row mb" onSubmit={handleSearch}>
        <input placeholder="Search my blogs..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

      {error && <div className="auth-error" role="alert">{error}</div>}

      {loading ? (
        <div className="card"><p className="muted">Loading your blogs...</p></div>
      ) : blogs.length === 0 ? (
        <div className="card">
          <EmptyState
            emoji="✍️"
            title={filtering ? "No blogs match your filters" : "You haven't written anything yet"}
            message={filtering ? "Try a different word or category." : "Your posts will appear here."}
          />
          {!filtering && <p style={{ textAlign: "center" }}><Link to="/blogs" className="btn btn-sm">Write your first blog</Link></p>}
        </div>
      ) : (
        <div className="grid">
          {blogs.map((b) => (
            <article className="card blog-card" key={b.id}>
              <h3><Link to={`/blogs/${b.id}`} className="blog-title-link">{b.title}</Link></h3>
              <div className="row" style={{ flexWrap: "wrap", margin: "4px 0" }}>
                <span className="badge">{b.category}</span>
                <span className="muted">{new Date(b.createdAt).toLocaleString("en-IN")}</span>
              </div>
              <p className="blog-content">{excerpt(b.content)}</p>
              <div className="row">
                <Link to={`/blogs/${b.id}`} className="btn btn-sm">Read</Link>
                <Link to={`/blogs/${b.id}/edit`} className="btn btn-sm btn-ghost">Edit</Link>
                <button className="btn btn-sm btn-ghost" onClick={() => handleDelete(b.id)}>Delete</button>
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