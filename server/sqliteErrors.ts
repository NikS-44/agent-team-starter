/** True when better-sqlite3 threw a UNIQUE constraint error (email collision, etc.). */
export function isSqliteUniqueViolation(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("UNIQUE constraint") || msg.includes("unique");
}
