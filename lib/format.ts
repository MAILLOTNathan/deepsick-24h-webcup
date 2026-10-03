import type { Locale } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";

const INTL_LOCALES: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
};

/** Intl locale tag for the active locale (server components only). */
function intlLocale(locale?: Locale): string {
  return INTL_LOCALES[locale ?? getLocale()] ?? "fr-FR";
}

export function formatDate(date: Date | string | null | undefined, locale?: Locale): string {
  if (!date) return "—";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "long" }).format(value);
}

export function formatDateTime(date: Date | string | null | undefined, locale?: Locale): string {
  if (!date) return "—";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function initials(name?: string | null, fallback = "?"): string {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || fallback;
}
