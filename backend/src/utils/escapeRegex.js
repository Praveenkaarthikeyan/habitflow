// Stops a search like "(" from being treated as a regular expression.
export default function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}