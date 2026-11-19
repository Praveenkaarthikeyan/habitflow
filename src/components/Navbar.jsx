import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="navbar">
      <div className="row">
        <button className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Open menu">☰</button>
        <span className="muted">{today}</span>
      </div>
      <div className="navbar-right">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <Link to="/notifications" className="icon-btn" aria-label="Notifications">🔔</Link>
        <Link to="/profile" aria-label="Profile"><Avatar size={38} /></Link>
      </div>
    </header>
  );
}