/**
 * Supported interface locales. Astro i18n routing is not configured yet (see
 * design-docs/00-RESEARCH-I18N-EMDASH-ASTRO.md); until it is, pages pass a
 * locale to components explicitly.
 */
export const locales = ["da", "en"] as const;

export type Locale = (typeof locales)[number];

/** Default for the public site; KBHFF's existing URLs are Danish. */
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
