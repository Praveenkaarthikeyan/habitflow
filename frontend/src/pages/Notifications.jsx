import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import { initialNotifications } from "../data/mockData.js";

const icons = { Habit: "✅", Task: "📝", Budget: "💰", Friend: "👥", Achievement: "🏅" };

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((n) => !n.read).length;

  const markRead = (id) => setItems((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAll = () => setItems((ns) => ns.map((n) => ({ ...n, read: true })));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="muted">{unread} unread</p>
        </div>
        <button className="btn btn-ghost" onClick={markAll}>Mark all as read</button>
      </div>

      {items.length === 0 ? (
        <div className="card"><EmptyState emoji="🔕" title="No notifications" /></div>
      ) : (
        <div className="grid">
          {items.map((n) => (
            <div key={n.id} className={`card ${n.read ? "" : "unread"}`}>
              <div className="list-item" style={{ border: "none", padding: 0 }}>
                <div className="row">
                  <span style={{ fontSize: "1.4rem" }}>{icons[n.type]}</span>
                  <div>
                    <div>{n.text}</div>
                    <div className="muted">{n.type} · {n.time}</div>
                  </div>
                </div>
                {!n.read && <button className="btn btn-sm btn-ghost" onClick={() => markRead(n.id)}>Mark read</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}