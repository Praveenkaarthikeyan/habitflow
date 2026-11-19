import { loadPref } from "../services/preferences.js";
import { WIDGETS, clampSize } from "./widgetConfig.js";

export const BREAKPOINTS = { lg: 1000, md: 700, sm: 480, xs: 0 }; // measured on the grid's width
export const COLS = { lg: 12, md: 8, sm: 4, xs: 2 };
export const BP_KEYS = Object.keys(COLS);
export const STORAGE_KEY = "dashboardLayout";
export const LAYOUT_VERSION = 1; // bump if the saved shape ever changes

export const PRESETS = {
  minimal: {
    name: "Minimal",
    description: "Essential productivity information.",
    ids: ["dailyCompletion", "currentStreak", "productivityScore", "longestStreak", "todayHabits", "todayTasks", "quickActions"],
  },
  balanced: {
    name: "Balanced",
    description: "Habits, learning and tasks.",
    ids: ["dailyCompletion", "currentStreak", "learningProgress", "completedTasks", "todayHabits", "learningGoals", "todayTasks", "weeklyProductivity", "weeklyStudyHours"],
  },
  focus: {
    name: "Productivity Focus",
    description: "Habits, study time and analytics.",
    ids: ["productivityScore", "currentStreak", "studyTime", "learningStreak", "weeklyProductivity", "weeklyStudyHours", "habitConsistency", "monthlyOverview", "habitCalendar", "todayHabits", "learningGoals"],
  },
  student: {
    name: "Student Life",
    description: "Habits, learning, tasks and expenses.",
    ids: ["dailyCompletion", "currentStreak", "learningProgress", "remainingBudget", "todayHabits", "todayTasks", "learningGoals", "expenseBreakdown", "recentTransactions"],
  },
};
export const PRESET_ORDER = Object.keys(PRESETS);

// ---------- building layouts ----------
function flow(entries, cols) {
  let x = 0, y = 0, rowH = 0;
  const out = [];
  entries.forEach(({ id, w, h }) => {
    const wanted = cols <= 4 ? cols : Math.round((w * cols) / 12);
    const size = clampSize(id, wanted, h, cols);
    if (x + size.w > cols) { x = 0; y += rowH; rowH = 0; }
    out.push({ i: id, x, y, w: size.w, h: size.h });
    x += size.w;
    rowH = Math.max(rowH, size.h);
  });
  return out;
}

export function buildLayouts(entries) {
  const layouts = {};
  BP_KEYS.forEach((bp) => { layouts[bp] = flow(entries, COLS[bp]); });
  return layouts;
}

const entriesFromIds = (ids) => ids.map((id) => ({ id, w: WIDGETS[id].w, h: WIDGETS[id].h }));

export function buildPresetState(presetId) {
  return {
    preset: presetId,
    basePreset: presetId,
    layouts: buildLayouts(entriesFromIds(PRESETS[presetId].ids)),
    hidden: [],
  };
}

export function defaultState() {
  return { version: LAYOUT_VERSION, ...buildPresetState("balanced"), customSnapshot: null, updatedAt: 0 };
}

// Adds min/max limits from the config at render time (so they are never stored).
export function withLimits(layouts) {
  const out = {};
  BP_KEYS.forEach((bp) => {
    out[bp] = (layouts[bp] || []).map((it) => {
      const c = WIDGETS[it.i];
      return {
        ...it,
        minW: Math.min(c.minW, COLS[bp]),
        maxW: Math.min(c.maxW, COLS[bp]),
        minH: c.minH,
        maxH: c.maxH,
      };
    });
  });
  return out;
}

// ---------- editing helpers ----------
export function addToLayouts(layouts, id, w, h) {
  const out = {};
  BP_KEYS.forEach((bp) => {
    const cols = COLS[bp];
    const size = clampSize(id, cols <= 4 ? cols : Math.round((w * cols) / 12), h, cols);
    const bottom = layouts[bp].reduce((m, it) => Math.max(m, it.y + it.h), 0);
    out[bp] = [...layouts[bp], { i: id, x: 0, y: bottom, ...size }];
  });
  return out;
}

export function removeFromLayouts(layouts, id) {
  const out = {};
  BP_KEYS.forEach((bp) => { out[bp] = layouts[bp].filter((it) => it.i !== id); });
  return out;
}

// ---------- validating saved data ----------
export function sanitizeLayouts(layouts) {
  const out = {};
  BP_KEYS.forEach((bp) => {
    const seen = new Set();
    out[bp] = (layouts?.[bp] || [])
      .filter((it) => WIDGETS[it.i] && !seen.has(it.i) && seen.add(it.i))
      .map((it) => {
        const size = clampSize(it.i, Number(it.w) || 1, Number(it.h) || 1, COLS[bp]);
        return { i: it.i, x: Math.max(0, Number(it.x) || 0), y: Math.max(0, Number(it.y) || 0), ...size };
      });
  });
  return out;
}

function syncBreakpoints(layouts) {
  const ids = layouts.lg.map((it) => it.i).sort().join();
  const entries = [...layouts.lg]
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map((it) => ({ id: it.i, w: it.w, h: it.h }));
  const out = { lg: layouts.lg };
  BP_KEYS.filter((bp) => bp !== "lg").forEach((bp) => {
    const same = layouts[bp].map((it) => it.i).sort().join() === ids;
    out[bp] = same ? layouts[bp] : flow(entries, COLS[bp]);
  });
  return out;
}

export function sanitizeState(raw) {
  try {
    if (!raw || raw.version !== LAYOUT_VERSION || !raw.layouts?.lg) return defaultState();
    const layouts = syncBreakpoints(sanitizeLayouts(raw.layouts));
    const visible = new Set(layouts.lg.map((it) => it.i));
    const hidden = (raw.hidden || [])
      .filter((h) => WIDGETS[h.id] && !visible.has(h.id))
      .map((h) => ({ id: h.id, w: Number(h.w) || WIDGETS[h.id].w, h: Number(h.h) || WIDGETS[h.id].h }));
    return {
      version: LAYOUT_VERSION,
      preset: raw.preset === "custom" || PRESETS[raw.preset] ? raw.preset : "custom",
      basePreset: PRESETS[raw.basePreset] ? raw.basePreset : "balanced",
      layouts,
      hidden,
      customSnapshot: null,
      updatedAt: raw.updatedAt || 0,
    };
  } catch {
    return defaultState();
  }
}

export const loadLayoutState = () => sanitizeState(loadPref(STORAGE_KEY, null));