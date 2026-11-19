import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { loadPref, savePref } from "../services/preferences.js";

export default function AppLayout() {
  const [expanded, setExpanded] = useState(() => loadPref("sidebarExpanded", false));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    savePref("sidebarExpanded", expanded);
  }, [expanded]);

  const handleNavigate = () => {
    setMobileOpen(false);
    // On tablet the expanded sidebar overlays content, so close it after navigating.
    if (window.matchMedia("(min-width: 861px) and (max-width: 1024px)").matches) {
      setExpanded(false);
    }
  };

  return (
    <div className={`app ${expanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <Sidebar
        expanded={expanded}
        mobileOpen={mobileOpen}
        onToggle={() => setExpanded((e) => !e)}
        onNavigate={handleNavigate}
      />
      <div className={`overlay ${mobileOpen ? "show" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className="scrim" onClick={() => setExpanded(false)} />
      <div className="main">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}