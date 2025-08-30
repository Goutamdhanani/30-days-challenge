// Utility helpers (shared)
export function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
export const cn = cls;