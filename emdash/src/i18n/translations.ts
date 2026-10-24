import { getHreflangAlternates, getTranslations } from "emdash";
import { isLocale, otherLocale, type Locale } from "./locales";
import { newsItemPath, pagePath, type LanguageLinkTarget } from "./routes";

/**
 * Language links and hreflang alternates for CMS entries, built from EmDash's
 * translation groups.
 */

const entryPath = { pages: pagePath, posts: newsItemPath } as const;

/**
 * The same entry in the other language if a published translation exists,
 * otherwise `fallback` in the other language (for example its home page).
 */
export async function entryLanguageLink(
	collection: keyof typeof entryPath,
	entryId: string,
	locale: Locale,
	fallback: (target: Locale) => string,
): Promise<LanguageLinkTarget> {
	const target = otherLocale(locale);
	const { translations } = await getTranslations(collection, entryId);
	const translation = translations.find((item) => item.locale === target && item.status === "published");
	const href = translation?.slug ? entryPath[collection](translation.slug, target) : fallback(target);
	return { locale: target, href };
}

export interface Alternate {
	hreflang: string;
	href: string;
}

/**
 * hreflang alternates for a news item. EmDash decides which translations
 * qualify (published, not hidden from search engines) but builds the URLs from
 * the collection's one urlPattern (`/en/nyheder/…`), so each URL is rebuilt
 * with the translated news path (`/en/news/…`).
 */
export async function newsAlternates(postId: string, siteUrl: string): Promise<Alternate[]> {
	const alternates = await getHreflangAlternates("posts", postId, { siteUrl });
	const rebuilt = new Map<string, string>();
	for (const { hreflang, href } of alternates) {
		if (!isLocale(hreflang)) continue;
		const slug = decodeURIComponent(new URL(href).pathname.replace(/\/$/, "").split("/").pop() ?? "");
		rebuilt.set(href, `${new URL(href).origin}${newsItemPath(slug, hreflang)}`);
	}
	// x-default repeats one of the locale URLs, so it maps to the same rebuilt URL.
	return alternates.flatMap(({ hreflang, href }) => {
		const url = rebuilt.get(href);
		return url ? [{ hreflang, href: url }] : [];
	});
}
