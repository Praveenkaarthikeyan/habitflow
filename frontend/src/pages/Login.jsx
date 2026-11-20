import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return setError({ message: "Enter your email and password." });
    try {
      setBusy(true);
      setError(null);
      await login(form);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError({ message: err.message, details: err.details });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-brand">🌀 HabitFlow</div>
        <h1>Welcome back</h1>
        <p className="muted" style={{ marginBottom: 18 }}>Log in to continue.</p>

        {error && <div className="auth-error" role="alert">{error.message}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>
          {busy ? "Logging in..." : "Log in"}
        </button>
        <p className="auth-switch">No account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}