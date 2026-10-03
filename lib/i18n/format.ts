/**
 * Interpolates `{name}` placeholders in a dictionary string.
 * Shared by server and client components (no server-only imports here).
 */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    values[key] === undefined ? `{${key}}` : String(values[key]),
  );
}
