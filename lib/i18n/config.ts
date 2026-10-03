export const LOCALES = ["fr", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/** Cookie that stores the visitor's locale (read on the server, written by the switcher). */
export const LOCALE_COOKIE = "nt-locale";

export const LOCALE_LABELS: Record<Locale, { label: string; short: string }> = {
  fr: { label: "Français", short: "FR" },
  en: { label: "English", short: "EN" },
  es: { label: "Español", short: "ES" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
