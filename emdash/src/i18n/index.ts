import { intlLocales, type Locale } from "./locales";
import da from "./messages/da";
import en, { type Messages } from "./messages/en";

export * from "./locales";

const catalogs: Record<Locale, Messages> = { da, en };

/** Interface strings for a locale. CMS content is translated in EmDash, not here. */
export function getMessages(locale: Locale): Messages {
	return catalogs[locale];
}

/** Fill `{name}` placeholders in a message. Unknown placeholders are left as-is. */
export function format(template: string, values: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match,
	);
}

export function formatDate(locale: Locale, date: Date): string {
	return date.toLocaleDateString(intlLocales[locale], { year: "numeric", month: "long", day: "numeric" });
}
