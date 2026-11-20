import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problems = [];
    if (form.name.trim().length < 2) problems.push("Name must be at least 2 characters.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) problems.push("Enter a valid email address.");
    if (form.password.length < 8) problems.push("Password must be at least 8 characters.");
    if (form.password !== form.confirm) problems.push("Passwords do not match.");
    if (problems.length) return setError({ message: "Please fix the following:", details: problems });

    try {
      setBusy(true);
      setError(null);
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/", { replace: true });
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
        <h1>Create account</h1>
        <p className="muted" style={{ marginBottom: 18 }}>Start building better habits.</p>

        {error && (
          <div className="auth-error" role="alert">
            {error.message}
            {error.details?.length > 0 && <ul>{error.details.map((d) => <li key={d}>{d}</li>)}</ul>}
          </div>
        )}

        <div className="form-group"><label htmlFor="name">Name</label>
          <input id="name" autoComplete="name" value={form.name} onChange={set("name")} /></div>
        <div className="form-group"><label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} /></div>
        <div className="form-group"><label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
          <div className="field-hint">At least 8 characters.</div></div>
        <div className="form-group"><label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} /></div>

        <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>
          {busy ? "Creating account..." : "Create account"}
        </button>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}