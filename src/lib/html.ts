/** Mesmo escape usado pelo textLoader original. */
export function escapeHtml(text: unknown = ""): string {
  return String(text).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c as "&" | "<" | ">" | '"']!
  );
}

/** Para campos que o original inseria com innerHTML. */
export const html = (value: string) => ({ __html: value });
