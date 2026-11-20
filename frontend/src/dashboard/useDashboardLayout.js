import { useCallback, useMemo, useState } from "react";
import { savePref } from "../services/preferences.js";
import { SIZE_PRESETS, WIDGETS, clampSize } from "./widgetConfig.js";
import {
  BP_KEYS, COLS, LAYOUT_VERSION, STORAGE_KEY,
  addToLayouts, buildPresetState, loadLayoutState, removeFromLayouts, sanitizeLayouts,
} from "./layoutUtils.js";

const clone = (x) => JSON.parse(JSON.stringify(x));

export default function useDashboardLayout() {
  const [saved, setSaved] = useState(() => loadLayoutState());
  const [draft, setDraft] = useState(null); // null = not editing
  const editing = draft !== null;
  const state = draft || saved;

  const visibleIds = useMemo(() => state.layouts.lg.map((it) => it.i), [state.layouts]);
  const hiddenIds = useMemo(() => state.hidden.map((h) => h.id), [state.hidden]);
  const hasCustom = state.preset === "custom" || !!state.customSnapshot;

  const update = useCallback((fn) => setDraft((d) => (d ? fn(d) : d)), []);

  // ----- edit session -----
  const startEditing = useCallback(() => setDraft(clone(saved)), [saved]);
  const cancelEditing = useCallback(() => setDraft(null), []);
  const saveChanges = useCallback(() => {
    if (!draft) return false;
    // updatedAt + version are what a future backend sync will use.
    const next = { ...draft, customSnapshot: null, version: LAYOUT_VERSION, updatedAt: Date.now() };
    const ok = savePref(STORAGE_KEY, next);
    if (ok) { setSaved(next); setDraft(null); }
    return ok;
  }, [draft]);

  // ----- called by the grid -----
  const onLayoutChange = useCallback(
    (all) => update((d) => ({ ...d, layouts: sanitizeLayouts(all) })),
    [update]
  );
  const markCustom = useCallback(
    () => update((d) => (d.preset === "custom" ? d : { ...d, preset: "custom" })),
    [update]
  );

  // ----- widget management -----
  const addWidget = useCallback((id) => update((d) => {
    if (d.layouts.lg.some((it) => it.i === id)) return d; // no duplicates
    const was = d.hidden.find((h) => h.id === id); // restoring keeps the old size
    const w = was ? was.w : WIDGETS[id].w;
    const h = was ? was.h : WIDGETS[id].h;
    return {
      ...d, preset: "custom",
      layouts: addToLayouts(d.layouts, id, w, h),
      hidden: d.hidden.filter((x) => x.id !== id),
    };
  }), [update]);

  // Remove: gone from the dashboard (data is untouched; it can be added again at default size).
  const removeWidget = useCallback((id) => update((d) => ({
    ...d, preset: "custom",
    layouts: removeFromLayouts(d.layouts, id),
    hidden: d.hidden.filter((x) => x.id !== id),
  })), [update]);

  // Hide: off the dashboard but remembers its size for Restore.
  const hideWidget = useCallback((id) => update((d) => {
    const item = d.layouts.lg.find((it) => it.i === id);
    if (!item) return d;
    return {
      ...d, preset: "custom",
      layouts: removeFromLayouts(d.layouts, id),
      hidden: [...d.hidden.filter((h) => h.id !== id), { id, w: item.w, h: item.h }],
    };
  }), [update]);

  const setWidgetSize = useCallback((id, key) => update((d) => {
    const p = SIZE_PRESETS[key];
    const layouts = {};
    BP_KEYS.forEach((bp) => {
      layouts[bp] = d.layouts[bp].map((it) => {
        if (it.i !== id) return it;
        const cols = COLS[bp];
        const w = cols <= 4 ? cols : Math.round((p.w * cols) / 12);
        return { ...it, ...clampSize(id, w, p.h, cols) };
      });
    });
    return { ...d, preset: "custom", layouts };
  }), [update]);

  // ----- presets -----
  const applyPreset = useCallback((id) => update((d) => ({
    ...d,
    ...buildPresetState(id),
    // keep the user's custom arrangement so the Custom button can bring it back
    customSnapshot: d.preset === "custom" ? { layouts: d.layouts, hidden: d.hidden } : d.customSnapshot,
  })), [update]);

  const restoreCustom = useCallback(() => update((d) => (
    d.customSnapshot
      ? { ...d, preset: "custom", layouts: d.customSnapshot.layouts, hidden: d.customSnapshot.hidden, customSnapshot: null }
      : d
  )), [update]);

  const resetLayout = useCallback(() => update((d) => ({ ...d, ...buildPresetState(d.basePreset) })), [update]);

  return {
    state, editing, visibleIds, hiddenIds, hasCustom,
    startEditing, cancelEditing, saveChanges,
    onLayoutChange, markCustom,
    addWidget, removeWidget, hideWidget, setWidgetSize,
    applyPreset, restoreCustom, resetLayout,
  };
}