export function normalizeAndCompare(name, compareWith) {
  const normalized = name.replace(/\s+/g, "").toLowerCase();
  const jkl = compareWith.replace(/\s+/g, "").toLowerCase();
  return normalized === jkl;
}