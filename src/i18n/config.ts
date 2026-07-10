import { localizeHref } from "../paraglide/runtime.js";

export const LOCALES = ["he", "en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_LABELS: Record<Locale, string> = {
  he: "עברית",
  en: "English",
  fr: "Français",
};
export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && LOCALES.includes(value as Locale);
export const directionFor = (locale: Locale): "ltr" | "rtl" =>
  locale === "he" ? "rtl" : "ltr";
export const canonicalPathFrom = (pathname: string): string => {
  const parts = pathname.split("/").filter(Boolean);
  if (isLocale(parts[0])) parts.shift();
  return `/${parts.join("/")}${parts.length ? "/" : ""}`;
};
export const localePath = (path: string, locale: Locale): string =>
  localizeHref(path, { locale });
export const postSlug = (id: string): string => id.split("/").at(-1) ?? id;
