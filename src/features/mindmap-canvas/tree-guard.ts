/**
 * Tree integrity for manual reconnect (SPEC §4): prevent creating a cycle when
 * a node's parent is changed. A node cannot become a descendant of itself.
 */
export function wouldCreateCycle(
  parentOf: Map<string, string | null>,
  childId: string,
  newParentId: string | null,
): boolean {
  if (newParentId === null) return false;
  if (newParentId === childId) return true;
  let cur: string | null | undefined = newParentId;
  const seen = new Set<string>();
  while (cur != null) {
    if (cur === childId) return true;
    if (seen.has(cur)) break; // pre-existing cycle guard
    seen.add(cur);
    cur = parentOf.get(cur) ?? null;
  }
  return false;
}
