import { defineMiddleware } from "astro:middleware";
import { whatsappHref } from "./consts";
import { m } from "./paraglide/messages.js";
import { setLocale } from "./paraglide/runtime.js";
import { isLocale, type Locale } from "./i18n/config";

const LEGACY_PATH = /^\/(?:about|services|blog)(?:\/.*)?\/?$/;

const whatsappUrl = (locale: Locale): string =>
  whatsappHref(m.whatsapp_message({}, { locale }));

function preferredLocale(request: Request): Locale {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith("PARAGLIDE_LOCALE="))
    ?.split("=")[1];
  if (isLocale(cookie)) return cookie;
  const languages = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const entry of languages.split(",")) {
    const code = entry.trim().split(";")[0]?.split("-")[0];
    if (isLocale(code)) return code;
  }
  return "he";
}

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (isLocale(firstSegment)) {
    setLocale(firstSegment, { reload: false });
    if (
      pathname === `/${firstSegment}/contact` ||
      pathname === `/${firstSegment}/contact/`
    ) {
      return context.redirect(whatsappUrl(firstSegment), 302);
    }
    return next();
  }
  if (pathname === "/contact" || pathname === "/contact/") {
    return context.redirect(whatsappUrl(preferredLocale(context.request)), 302);
  }
  if (pathname === "/rss.xml") return context.redirect("/he/rss.xml", 302);
  if (pathname === "/" || LEGACY_PATH.test(pathname)) {
    return context.redirect(
      `/${preferredLocale(context.request)}${pathname}`,
      302,
    );
  }
  return next();
});
