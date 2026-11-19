import { useEffect, useMemo, useRef, useState } from "react";
import { Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import WidgetCard from "../components/WidgetCard.jsx";
import WidgetLibrary from "../components/WidgetLibrary.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import useDashboardLayout from "../dashboard/useDashboardLayout.js";
import { WIDGETS } from "../dashboard/widgetConfig.js";
import { BREAKPOINTS, COLS, PRESETS, PRESET_ORDER, withLimits } from "../dashboard/layoutUtils.js";
import { WIDGET_COMPONENTS } from "../dashboard/widgetRegistry.jsx";
import { buildMetrics } from "../dashboard/metrics.js";
import {
  initialHabits, initialGoals, initialTasks, initialExpenses, initialFriends, initialNotifications,
  weeklyProgress, weeklyStudy, monthlyTrend, monthlyBudget, motivationalMessages,
} from "../data/mockData.js";
import { studySessions, achievements, friendActivity, recentActivity, learningStreak } from "../data/dashboardMock.js";

export default function Dashboard() {
  const { profile } = useProfile();
  const layout = useDashboardLayout();
  const { state, editing } = layout;

  const [habits, setHabits] = useState(initialHabits);
  const [tasks, setTasks] = useState(initialTasks);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [pendingPreset, setPendingPreset] = useState(null);
  const [saveError, setSaveError] = useState("");
  const currentBp = useRef("lg");

  // Measure the grid's width ourselves so the grid never renders at width 0.
  const gridRef = useRef(null);
  const [gridWidth, setGridWidth] = useState(0);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => setGridWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const day = new Date().getDate();
  const data = {
    habits, tasks, goals: initialGoals, expenses: initialExpenses, friends: initialFriends,
    notifications: initialNotifications, weeklyProgress, weeklyStudy, monthlyTrend, monthlyBudget,
    studySessions, achievements, friendActivity, recentActivity, learningStreak,
    quote: motivationalMessages[(day + 1) % motivationalMessages.length],
  };
  const m = buildMetrics(data);
  const actions = {
    toggleHabit: (id) => setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h))),
    toggleTask: (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
  };

  const gridLayouts = useMemo(() => withLimits(state.layouts), [state.layouts]);
  const bannerMessage = motivationalMessages[day % motivationalMessages.length];
  const firstName = (profile.name || "Student").split(" ")[0];

  const requestPreset = (id) => {
    if (state.preset === "custom") setPendingPreset(id);
    else layout.applyPreset(id);
  };

  const handleSave = () => {
    const ok = layout.saveChanges();
    setSaveError(ok ? "" : "Could not save your layout. Browser storage may be blocked or full.");
  };

  return (
    <>
      <div className="banner mb">
        <h1>Welcome back, {firstName} 👋</h1>
        <p style={{ marginTop: 6 }}>{bannerMessage}</p>
      </div>

      <div className="page-header">
        <div>
          <h2 style={{ margin: 0 }}>Your Dashboard</h2>
          <p className="muted">
            {editing ? "Drag headers to move, drag edges or corners to resize." : "Make this space your own."}
          </p>
        </div>
        <div className="dash-toolbar">
          {!editing ? (
            <button className="btn" onClick={layout.startEditing}>⚙ Customize Dashboard</button>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => setLibraryOpen(true)}>+ Add Widget</button>
              <button className="btn btn-ghost" onClick={layout.resetLayout}>Reset Layout</button>
              <button className="btn btn-ghost" onClick={layout.cancelEditing}>Cancel</button>
              <button className="btn" onClick={handleSave}>Save Changes</button>
            </>
          )}
        </div>
      </div>

      {saveError && <div className="card mb" style={{ borderColor: "var(--danger)" }}>{saveError}</div>}

      {editing && (
        <div className="card mb preset-bar">
          <strong>Layout preset</strong>
          <div className="tabs" style={{ margin: "10px 0 0" }}>
            {PRESET_ORDER.map((id) => (
              <button
                key={id}
                className={`chip ${state.preset === id ? "active" : ""}`}
                title={PRESETS[id].description}
                onClick={() => requestPreset(id)}
              >
                {PRESETS[id].name}
              </button>
            ))}
            <button
              className={`chip ${state.preset === "custom" ? "active" : ""}`}
              disabled={!layout.hasCustom}
              title="Your own arrangement"
              onClick={layout.restoreCustom}
            >
              Custom
            </button>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            {state.preset === "custom" ? "Your custom arrangement." : PRESETS[state.preset].description}
          </p>
        </div>
      )}

      {layout.visibleIds.length === 0 && (
        <div className="card">
          <EmptyState
            emoji="🧩"
            title="Your dashboard is empty"
            message={editing ? "Click Add Widget to get started." : "Click Customize Dashboard, then Add Widget."}
          />
        </div>
      )}

      <div ref={gridRef}>
        {gridWidth > 0 && (
          <Responsive
            width={gridWidth}
            className={`dash-grid ${editing ? "is-editing" : ""}`}
            layouts={gridLayouts}
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={56}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            compactType="vertical"
            isDraggable={editing}
            isResizable={editing}
            resizeHandles={["s", "e", "se"]}
            draggableHandle=".widget-drag-handle"
            draggableCancel=".widget-no-drag"
            onBreakpointChange={(bp) => { currentBp.current = bp; }}
            onDragStop={(current, before, after) => {
              if (!editing) return;
              layout.onLayoutChange({ ...state.layouts, [currentBp.current]: current });
              if (before.x !== after.x || before.y !== after.y) layout.markCustom();
            }}
            onResizeStop={(current, before, after) => {
              if (!editing) return;
              layout.onLayoutChange({ ...state.layouts, [currentBp.current]: current });
              if (before.w !== after.w || before.h !== after.h) layout.markCustom();
            }}
          >
            {layout.visibleIds.map((id) => {
              const Content = WIDGET_COMPONENTS[id];
              return (
                <div key={id}>
                  <WidgetCard
                    widget={WIDGETS[id]}
                    editing={editing}
                    onHide={() => layout.hideWidget(id)}
                    onRemove={() => layout.removeWidget(id)}
                    onSize={(key) => layout.setWidgetSize(id, key)}
                  >
                    <Content data={data} m={m} actions={actions} />
                  </WidgetCard>
                </div>
              );
            })}
          </Responsive>
        )}
      </div>

      {libraryOpen && (
        <WidgetLibrary
          visibleIds={layout.visibleIds}
          hiddenIds={layout.state.hidden.map((h) => h.id)}
          onAdd={layout.addWidget}
          onClose={() => setLibraryOpen(false)}
        />
      )}

      {pendingPreset && (
        <Modal title="Replace your custom layout?" onClose={() => setPendingPreset(null)}>
          <p style={{ marginBottom: 16 }}>
            Switching to <strong>{PRESETS[pendingPreset].name}</strong> replaces your current arrangement.
            You can bring it back with the Custom button until you save, or press Cancel to discard all changes.
          </p>
          <div className="row">
            <button className="btn" onClick={() => { layout.applyPreset(pendingPreset); setPendingPreset(null); }}>
              Switch layout
            </button>
            <button className="btn btn-ghost" onClick={() => setPendingPreset(null)}>Keep my layout</button>
          </div>
        </Modal>
      )}
    </>
  );
}