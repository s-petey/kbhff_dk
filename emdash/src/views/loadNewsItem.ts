import type { AstroGlobal } from "astro";
import { decodeSlug, getEmDashEntry, getSeoMeta, getSiteSettings } from "emdash";
import { resolveLocale } from "../i18n";
import { newsListPath } from "../i18n/routes";
import { entryLanguageLink, newsAlternates } from "../i18n/translations";
import { resolveStarterSiteIdentity } from "../utils/site-identity";

/**
 * A news item for `/nyheder/{slug}` and `/en/news/{slug}`, or `null` when there
 * is none. Shared by both route files, which rewrite `null` to the 404 page
 * (only page files can do that).
 */
export async function loadNewsItem(astro: AstroGlobal) {
	const locale = resolveLocale(astro.currentLocale);
	const slug = decodeSlug(astro.params.slug);
	if (!slug) return null;

	const { entry: post, cacheHint } = await getEmDashEntry("posts", slug, { locale });
	if (!post) return null;
	if (astro.cache?.enabled) astro.cache.set(cacheHint);

	const settings = await getSiteSettings();
	const { siteTitle } = resolveStarterSiteIdentity(settings);
	// Same origin order as EmDashHead: the admin Site URL, then the request.
	const siteUrl = settings.url || astro.url.origin;

	return {
		post,
		locale,
		seo: getSeoMeta(post, { siteTitle, siteUrl, path: astro.url.pathname.replace(/\/$/, "") }),
		alternates: await newsAlternates(post.data.id, siteUrl),
		languageLink: await entryLanguageLink("posts", post.data.id, locale, (target) => newsListPath(target)),
	};
}
