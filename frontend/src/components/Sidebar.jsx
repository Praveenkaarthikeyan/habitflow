import { NavLink } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { useProfile } from "../context/ProfileContext.jsx";

// ready: false hides a page that doesn't have a real backend yet. Flip to true when it does.
const links = [
  { to: "/", label: "Dashboard", icon: "🏠", ready: true },
  { to: "/blogs", label: "Blogs", icon: "✍️", ready: true },
  { to: "/my-blogs", label: "My Blogs", icon: "📝", ready: true },
  { to: "/habits", label: "Habits", icon: "✅", ready: true },
  { to: "/learning", label: "Learning Tracker", icon: "📚", ready: true },
  { to: "/time", label: "Time Management", icon: "⏱️", ready: true },
  { to: "/expenses", label: "Expense Tracker", icon: "💰", ready: true },
  { to: "/statistics", label: "Statistics", icon: "📊", ready: true },
  { to: "/friends", label: "Friends", icon: "👥", ready: true },
  { to: "/notifications", label: "Notifications", icon: "🔔", ready: true },
  { to: "/profile", label: "Profile & Settings", icon: "⚙️", ready: true },
].filter((l) => l.ready);

export default function Sidebar({ expanded, mobileOpen, onToggle, onNavigate }) {
  const { profile } = useProfile();

  return (
    <aside
      className={`sidebar ${expanded ? "expanded" : ""} ${mobileOpen ? "open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="sidebar-head">
        <span className="logo-icon">🌀</span>
        <span className="logo-text nav-label">HabitFlow</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            onClick={onNavigate}
            data-tooltip={l.label}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{l.icon}</span>
            <span className="nav-label">{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          data-tooltip={profile.name}
          className={({ isActive }) => `user-chip ${isActive ? "active" : ""}`}
        >
          <Avatar size={36} />
          <span className="nav-label user-name">{profile.name}</span>
        </NavLink>

        <button
          className="sidebar-toggle"
          onClick={onToggle}
          data-tooltip={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={expanded}
        >
          <span className="nav-icon">{expanded ? "«" : "»"}</span>
          <span className="nav-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}