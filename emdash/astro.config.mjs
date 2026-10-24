import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { defaultLocale, locales } from "./src/i18n/locales.ts";

export default defineConfig({
	// Optional build-time public origin for Astro (`Astro.site`). Canonical,
	// hreflang and sitemap URLs come from the admin Site URL, then the
	// `SITE_URL` env var at runtime (sitemaps), then the request (see README).
	site: process.env.SITE_URL,
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	// EmDash reads this block. The default locale must stay unprefixed
	// (no `prefixDefaultLocale`): prefixing it breaks /_emdash/admin.
	i18n: {
		defaultLocale,
		locales: [...locales],
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	devToolbar: { enabled: false },
});
