/**
 * Theme registry.
 *
 * The colours themselves live in `app/globals.css` as CSS custom properties
 * (one block per `[data-theme="…"]`). This file is the single source of truth
 * for the *list* of themes, their labels and which `class` next-themes should
 * apply (`dark` / `light`) so that `dark:` utilities keep working for the
 * colour themes that are dark.
 */

export type ThemeScheme = "light" | "dark";

export type ThemeDefinition = {
  id: string;
  label: string;
  description: string;
  scheme: ThemeScheme;
  /** Colours used to draw the little preview swatch in the picker. */
  swatch: { background: string; card: string; primary: string; info: string };
};

export const THEMES: ThemeDefinition[] = [
  {
    id: "dark",
    label: "CRT Phosphor",
    description: "Terminal vert — thème par défaut",
    scheme: "dark",
    swatch: { background: "#101a15", card: "#1c2a22", primary: "#7ee787", info: "#7fb3e6" },
  },
  {
    id: "light",
    label: "Paper Terminal",
    description: "Clair, sobre, imprimé",
    scheme: "light",
    swatch: { background: "#f4f6f2", card: "#ffffff", primary: "#3f7d55", info: "#3f6f9c" },
  },
  {
    id: "mars-civic",
    label: "Mars Civic OS",
    description: "Console civique — orange Mars, cyan, vert",
    scheme: "dark",
    swatch: { background: "#0b0f19", card: "#111827", primary: "#f4a261", info: "#38bdf8" },
  },
  {
    id: "bio-dome",
    label: "Bio-Dôme",
    description: "Hydroponie, vert sur verre noir",
    scheme: "dark",
    swatch: { background: "#07130c", card: "#0d2018", primary: "#4ade80", info: "#2dd4bf" },
  },
  {
    id: "nebula",
    label: "Nébuleuse",
    description: "Champ profond violet et magenta",
    scheme: "dark",
    swatch: { background: "#0b0714", card: "#170f2a", primary: "#c084fc", info: "#60a5fa" },
  },
  {
    id: "solar-flare",
    label: "Éruption Solaire",
    description: "Fournaise ambrée",
    scheme: "dark",
    swatch: { background: "#140a03", card: "#241206", primary: "#fbbf24", info: "#f97316" },
  },
  {
    id: "glacier",
    label: "Glacier",
    description: "Bleu cryogénique sous pression",
    scheme: "dark",
    swatch: { background: "#050b14", card: "#0b1a2b", primary: "#7dd3fc", info: "#38bdf8" },
  },
  {
    id: "iron-oxide",
    label: "Oxyde de Fer",
    description: "Rouille, cuivre et poussière",
    scheme: "dark",
    swatch: { background: "#120a08", card: "#241411", primary: "#e07a5f", info: "#64b5f6" },
  },
  {
    id: "daylight",
    label: "Grand Jour",
    description: "Papier chaud, plein jour",
    scheme: "light",
    swatch: { background: "#fbf7ef", card: "#ffffff", primary: "#b45309", info: "#0369a1" },
  },
  {
    id: "void",
    label: "Vide Absolu",
    description: "Contraste maximal, jaune sur noir",
    scheme: "dark",
    swatch: { background: "#000000", card: "#0a0a0a", primary: "#ffd400", info: "#00e5ff" },
  },
];

export const THEME_IDS = THEMES.map((theme) => theme.id);

export const DEFAULT_THEME = "dark";

export function getTheme(id?: string | null): ThemeDefinition | undefined {
  return THEMES.find((theme) => theme.id === id);
}

export function themeScheme(id?: string | null): ThemeScheme {
  return getTheme(id)?.scheme ?? "dark";
}
