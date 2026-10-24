import { defaultLocale, type Locale } from "./locales";

/**
 * URLs we own. Everything else comes from EmDash. See "URL structure" in
 * design-docs/10 (phase 1).
 *
 * - CMS pages: EmDash. Link with `/${entry.id}` (EmDash includes the locale
 *   prefix); served by src/pages/[...slug].astro.
 * - News: ours, with a translated path and translated filter parameters:
 *     /nyheder, /nyheder/{slug}, /nyheder?q=…&kategori=…&tag=…
 *     /en/news, /en/news/{slug}, /en/news?search=…&category=…&tag=…
 *
 * Plain functions with no Astro imports, so routes, views and the news sitemap
 * share them. The default locale has no prefix; other locales get `/{locale}`.
 */
/**
 * The news path segment per language. Also the slug of the CMS page that holds
 * the news list's title and intro, so `/${entry.id}` of that page is the list.
 */
export const newsSegment: Record<Locale, string> = { da: "nyheder", en: "news" };

/** Query parameter names for the news search and filters, per language. */
export const newsFilterParams = {
	search: { da: "q", en: "search" },
	category: { da: "kategori", en: "category" },
	tag: { da: "tag", en: "tag" },
} as const satisfies Record<string, Record<Locale, string>>;

export type NewsFilter = keyof typeof newsFilterParams;
export type NewsFilters = Partial<Record<NewsFilter, string>>;

/** The filters that are taxonomies (EmDash taxonomy names); `search` is free text. */
export const newsTaxonomies = ["category", "tag"] as const satisfies NewsFilter[];
export type NewsTaxonomy = (typeof newsTaxonomies)[number];

export interface LanguageLinkTarget {
	locale: Locale;
	href: string;
}

function localePrefix(locale: Locale): string {
	return locale === defaultLocale ? "" : `/${locale}`;
}

export function homePath(locale: Locale): string {
	return localePrefix(locale) || "/";
}

/** A CMS page, as the pages urlPattern `/{slug}` resolves it. Prefer `/${entry.id}` when you have the entry. */
export function pagePath(slug: string, locale: Locale): string {
	return `${localePrefix(locale)}/${encodeURIComponent(slug)}`;
}

/** The news list, with optional filters and a pagination cursor. */
export function newsListPath(locale: Locale, filters: NewsFilters = {}, cursor?: string): string {
	const params = new URLSearchParams();
	for (const filter of Object.keys(newsFilterParams) as NewsFilter[]) {
		const value = filters[filter];
		if (value) params.set(newsFilterParams[filter][locale], value);
	}
	if (cursor) params.set("cursor", cursor);
	const query = params.toString();
	return `${localePrefix(locale)}/${newsSegment[locale]}${query ? `?${query}` : ""}`;
}

export function newsItemPath(slug: string, locale: Locale): string {
	return `${localePrefix(locale)}/${newsSegment[locale]}/${encodeURIComponent(slug)}`;
}

/** Read the news filters from a URL's query string, using that language's parameter names. */
export function readNewsFilters(searchParams: URLSearchParams, locale: Locale): NewsFilters {
	const filters: NewsFilters = {};
	for (const filter of Object.keys(newsFilterParams) as NewsFilter[]) {
		const value = searchParams.get(newsFilterParams[filter][locale])?.trim();
		if (value) filters[filter] = value;
	}
	return filters;
}
