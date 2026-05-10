/**
 * Derive UserOrg.assignedCategory from Microsoft Graph jobTitle.
 * Stored as title case ("Student", "Professor") for profile display.
 */

const STUDENT_RE = /^student\b/i;

const PROFESSOR_SUBSTRINGS = [
  "professor",
  "assitant professor", // common typo
  "lecturer",
];

export function assignedCategoryFromJobTitle(jobTitle) {
  const t = typeof jobTitle === "string" ? jobTitle.trim() : "";
  if (!t) return "Professor";

  if (STUDENT_RE.test(t)) return "Student";

  const lower = t.toLowerCase();
  if (PROFESSOR_SUBSTRINGS.some((s) => lower.includes(s))) return "Professor";

  return "Professor";
}

/** Normalize assignedCategory string to ride audience bucket (lowercase). */
export function normalizeCategoryToAudience(assignedCategory) {
  if (assignedCategory == null || String(assignedCategory).trim() === "")
    return null;
  const s = String(assignedCategory).trim().toLowerCase();
  if (s === "student") return "student";
  if (s === "professor") return "professor";
  return null;
}
