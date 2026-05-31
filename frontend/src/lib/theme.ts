/**
 * Theme tokens are the only color source (see globals.css). Obsidian-dark ships
 * now; Intercom-blue is an optional later skin. This resolver maps a requested
 * theme name to the `data-theme` attribute value, defaulting to obsidian.
 */
export const THEMES = ["obsidian", "intercom"] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "obsidian";

export function resolveTheme(requested?: string | null): Theme {
  return THEMES.includes(requested as Theme) ? (requested as Theme) : DEFAULT_THEME;
}
