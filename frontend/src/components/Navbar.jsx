import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="row">
        <button className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Open menu">☰</button>
        <span className="muted">{today}</span>
      </div>
      <div className="navbar-right">
        {user && <span className="muted">{user.name}</span>}
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <Link to="/profile" aria-label="Profile"><Avatar size={38} /></Link>
        <button className="btn btn-sm btn-ghost" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}