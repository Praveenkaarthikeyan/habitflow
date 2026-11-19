import { useState } from "react";
import Modal from "./Modal.jsx";
import EmptyState from "./EmptyState.jsx";
import { CATEGORIES, WIDGET_LIST } from "../dashboard/widgetConfig.js";

export default function WidgetLibrary({ visibleIds, hiddenIds, onAdd, onClose }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = WIDGET_LIST.filter(
    (w) => !q || w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)
  );

  return (
    <Modal title="Widget Library" onClose={onClose} maxWidth={780}>
      <div className="form-group">
        <input placeholder="Search widgets..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {CATEGORIES.map((cat) => {
        const items = matches.filter((w) => w.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat} className="lib-section">
            <h3 className="lib-cat">{cat}</h3>
            <div className="lib-grid">
              {items.map((w) => {
                const added = visibleIds.includes(w.id);
                const hidden = hiddenIds.includes(w.id);
                return (
                  <div className="lib-card" key={w.id}>
                    <span className="lib-icon">{w.icon}</span>
                    <div className="lib-info">
                      <strong>{w.name}</strong>
                      <p className="muted">{w.description}</p>
                    </div>
                    <button
                      className={`btn btn-sm ${added ? "btn-ghost" : ""}`}
                      disabled={added}
                      onClick={() => onAdd(w.id)}
                    >
                      {added ? "Added" : hidden ? "Restore" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {matches.length === 0 && <EmptyState emoji="🔍" title="No widgets match your search" />}
    </Modal>
  );
}