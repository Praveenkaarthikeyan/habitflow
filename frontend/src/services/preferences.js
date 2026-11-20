// The ONLY place that touches browser storage.
// Later: replace these bodies with API calls (GET/PUT /api/preferences).
const PREFIX = "habitflow.";

export function loadPref(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Returns true on success, false if storage is full/blocked.
export function savePref(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removePref(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}