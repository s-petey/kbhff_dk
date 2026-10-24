import type { AstroGlobal } from "astro";
import { decodeSlug, getEmDashCollection, getEmDashEntry, getSeoMeta, getSiteSettings } from "emdash";
import { resolveLocale } from "../i18n";
import { newsListPath } from "../i18n/routes";
import { entryLanguageLink, newsAlternates } from "../i18n/translations";
import { resolveStarterSiteIdentity } from "../utils/site-identity";

const LATEST_COUNT = 3;

/**
 * A news item for `/nyheder/{slug}` and `/en/news/{slug}`, or `null` when there
 * is none. Shared by both route files, which rewrite `null` to the 404 page
 * (only page files can do that).
 */
export async function loadNewsItem(astro: AstroGlobal) {
	const locale = resolveLocale(astro.currentLocale);
	const slug = decodeSlug(astro.params.slug);
	if (!slug) return null;

	// The latest news (shown below the article) and the settings don't depend
	// on the entry, so all three load together.
	const [{ entry: post, cacheHint }, latestResult, settings] = await Promise.all([
		getEmDashEntry("posts", slug, { locale }),
		getEmDashCollection("posts", { locale, orderBy: { published_at: "desc" }, limit: LATEST_COUNT + 1 }),
		getSiteSettings(),
	]);
	if (!post) return null;
	if (astro.cache?.enabled) {
		astro.cache.set(cacheHint);
		astro.cache.set(latestResult.cacheHint);
	}

	const { siteTitle } = resolveStarterSiteIdentity(settings);
	// Same origin order as EmDashHead: the admin Site URL, then the request.
	const siteUrl = settings.url || astro.url.origin;
	const [alternates, languageLink] = await Promise.all([
		newsAlternates(post.data.id, siteUrl),
		entryLanguageLink("posts", post.data.id, locale, (target) => newsListPath(target)),
	]);

	return {
		post,
		latest: latestResult.entries.filter((entry) => entry.data.id !== post.data.id).slice(0, LATEST_COUNT),
		locale,
		seo: getSeoMeta(post, { siteTitle, siteUrl, path: astro.url.pathname.replace(/\/$/, "") }),
		alternates,
		languageLink,
	};
}
