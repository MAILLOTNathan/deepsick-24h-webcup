"use client";

import { createContext, useContext, type ReactNode } from "react";

import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./config";
import fr from "./dictionaries/fr";
import type { Dictionary } from "./types";

type LocaleContextValue = { locale: Locale; t: Dictionary };

const LocaleContext = createContext<LocaleContextValue>({ locale: DEFAULT_LOCALE, t: fr });

/** Provides the active locale + dictionary to client components. */
export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, t: dictionary }}>{children}</LocaleContext.Provider>
  );
}

/** Active locale. */
export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

/** Dictionary for the active locale (`t.nav.home`, …). */
export function useT(): Dictionary {
  return useContext(LocaleContext).t;
}

/** Persist the choice; the caller refreshes so server components re-render. */
export function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
