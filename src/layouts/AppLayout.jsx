import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <div className="main">
        <Navbar onMenuClick={() => setOpen(true)} />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}