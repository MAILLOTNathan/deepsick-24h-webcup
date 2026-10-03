import "server-only";

import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE, resolveLocale, type Locale } from "./config";
import en from "./dictionaries/en";
import es from "./dictionaries/es";
import fr from "./dictionaries/fr";
import type { Dictionary } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, es };

/** Locale from the `nt-locale` cookie (falls back to French). */
export function getLocale(): Locale {
  return resolveLocale(cookies().get(LOCALE_COOKIE)?.value);
}

export function getDictionary(locale: Locale = getLocale()): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/** Interpolates `{name}` placeholders in a dictionary string. */
export { format } from "./format";
