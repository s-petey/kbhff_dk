import type { APIRoute } from "astro";
import { GET as emdashCollectionSitemap } from "emdash/internal/routes/sitemap-_collection_.xml";
import { newsItemPath } from "../i18n/routes";

export const prerender = false;

/**
 * EmDash's own news sitemap, with English news URLs moved to `/en/news/…`.
 *
 * EmDash builds sitemap URLs from the collection's one urlPattern
 * (`/nyheder/{slug}`), so English items come out as `/en/nyheder/{slug}`
 * (which redirects). Everything else (published only, "Hide from search
 * engines", translation alternates, images, site URL) stays EmDash's.
 * This file overrides EmDash's `/sitemap-posts.xml` only; the sitemap index
 * still lists it. EmDash pages the sitemap at 2000 URLs, so `/sitemap-posts-2.xml`
 * (more than 2000 news items) would still be EmDash's unmodified one.
 */
const englishPrefix = newsItemPath("", "en"); // "/en/news/"
const emdashEnglishPrefix = "/en/nyheder/";

export const GET: APIRoute = async (context) => {
	context.params.collection = "posts";
	const response = await emdashCollectionSitemap(context);
	if (!response.ok) return response;

	const xml = (await response.text()).replaceAll(emdashEnglishPrefix, englishPrefix);
	return new Response(xml, { status: response.status, headers: response.headers });
};
