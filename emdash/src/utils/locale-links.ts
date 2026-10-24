import { defaultLocale, locales, type Locale } from "../i18n";

/**
 * URL helpers for the language link. They follow the decided URL structure
 * (design-docs/10, phase 1): the default locale (`da`) is unprefixed, other
 * locales are prefixed (`/en/`).
 *
 * Temporary: Astro i18n routing is not configured yet, so the link goes to
 * the other language's home page and `/en/` does not exist yet. Once routing
 * is configured, link to the translated page via EmDash `getTranslations()`
 * and build URLs with `getRelativeLocaleUrl()` from `astro:i18n`.
 */

/** With two languages, the language link always points to the other one. */
export function otherLocale(locale: Locale): Locale {
	return locales.find((code) => code !== locale) ?? defaultLocale;
}

export function localeHomeHref(locale: Locale): string {
	return locale === defaultLocale ? "/" : `/${locale}/`;
}
