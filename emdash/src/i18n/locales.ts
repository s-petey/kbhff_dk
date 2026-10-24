/**
 * Supported locales and the default locale. Single source of truth:
 * astro.config.mjs imports these for Astro's `i18n` config, which EmDash
 * reads too. See design-docs/10 (phase 1) for the URL structure:
 * the default locale (`da`) is unprefixed, other locales are prefixed (`/en/`).
 *
 * Keep this file free of `astro:*` imports so the config can load it.
 */
export const locales = ["da", "en"] as const;

export type Locale = (typeof locales)[number];

/**
 * Default for the public site, and therefore the unprefixed URL language.
 * Fixed on purpose: it is a structural choice (route folders, URLs), not a
 * per-environment setting. Developers who prefer English use `/en/…`.
 */
export const defaultLocale: Locale = "da";

/** Default for development and admin tooling such as /styleguide. */
export const devLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
	da: "Dansk",
	en: "English",
};

/** BCP 47 tags for Intl formatting. */
export const intlLocales: Record<Locale, string> = {
	da: "da-DK",
	en: "en-GB",
};

export function isLocale(value: unknown): value is Locale {
	return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function resolveLocale(value: unknown, fallback: Locale = defaultLocale): Locale {
	return isLocale(value) ? value : fallback;
}

/** With two languages, a language switch always points to the other one. */
export function otherLocale(locale: Locale): Locale {
	return locales.find((code) => code !== locale) ?? defaultLocale;
}
