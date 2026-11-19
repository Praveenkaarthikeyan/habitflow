import { SIZE_PRESETS } from "../dashboard/widgetConfig.js";

export default function WidgetCard({ widget, editing, onHide, onRemove, onSize, children }) {
  return (
    <section className={`widget ${editing ? "widget-editing" : ""}`} aria-label={widget.name}>
      <header className={`widget-head ${editing ? "widget-drag-handle" : ""}`}>
        {editing && <span className="widget-grip" aria-hidden="true">⠿</span>}
        <span className="widget-icon" aria-hidden="true">{widget.icon}</span>
        <h3 className="widget-title">{widget.name}</h3>
        {editing && (
          <div className="widget-tools widget-no-drag">
            <select
              aria-label={`Size of ${widget.name}`}
              value=""
              onChange={(e) => e.target.value && onSize(e.target.value)}
            >
              <option value="">Size</option>
              {Object.entries(SIZE_PRESETS).map(([k, p]) => (
                <option key={k} value={k}>{p.label}</option>
              ))}
            </select>
            <button className="widget-tool-btn" onClick={onHide} title="Hide (keeps size)" aria-label={`Hide ${widget.name}`}>🙈</button>
            <button className="widget-tool-btn" onClick={onRemove} title="Remove" aria-label={`Remove ${widget.name}`}>✕</button>
          </div>
        )}
      </header>
      <div className="widget-body">{children}</div>
    </section>
  );
}