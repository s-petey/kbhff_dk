# KBHFF on EmDash

The KBHFF public site built with [EmDash](https://github.com/emdash-cms/emdash) on Astro, started from the EmDash starter template. Runs on any Node.js server with SQLite and local file storage. Plans and decisions live in [`design-docs/`](./design-docs/).

## What's Included

- Danish (default) and English, with linked translations managed in EmDash
- News with category and tag archives, and CMS pages
- KBHFF components and an admin-only styleguide at `/styleguide`
- Seed data with Danish starter content and English translations

## Pages

Danish URLs have no prefix; English URLs are prefixed with `/en`.

| Page | Danish | English |
|---|---|---|
| Home | `/` | `/en` |
| News list | `/nyheder` | `/en/news` |
| News list, filtered | `/nyheder?kategori=:slug&tag=:slug` | `/en/news?category=:slug&tag=:slug` |
| News item | `/nyheder/:slug` | `/en/news/:slug` |
| CMS page | `/:slug` | `/en/:slug` |
| 404 | fallback (language from the URL) | |

- **CMS pages** are served by `src/pages/[...slug].astro` (EmDash's i18n pattern). The news list's title and intro are the CMS pages with slug `nyheder` (Danish) and `news` (English).
- **News** routes, filter parameter names and URLs are ours, in one table: `src/i18n/routes.ts`. The posts `urlPattern` is `/nyheder/{slug}`, so EmDash's own English news links (admin preview, "View") go to `/en/nyheder/:slug`, which redirects to `/en/news/:slug`.
- **hreflang and sitemap for news:** news pages emit their own alternate links (`src/i18n/translations.ts`), and `src/pages/sitemap-posts.xml.ts` wraps EmDash's posts sitemap with the English URLs corrected. EmDash still decides what is published and what is hidden from search engines.

## Infrastructure

- **Runtime:** Node.js
- **Database:** SQLite (local file)
- **Storage:** Local filesystem
- **Framework:** Astro with `@astrojs/node`

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321/_emdash/admin and complete the setup wizard. EmDash runs database migrations and applies the starter seed during setup. The site is available at http://localhost:4321. No environment variables are needed for local development.

## Deployment

| Environment variable | Required | Purpose |
|---|---|---|
| `SITE_URL` (or `EMDASH_SITE_URL`) | Recommended in production | Public origin without a trailing slash, e.g. `https://kbhff.dk`. Read **at runtime** by EmDash for sitemap URLs when the admin **Site URL** setting is empty. Canonical and hreflang URLs in page heads use the admin Site URL, then the request's own origin. Also passed to Astro's `site` at build time if set. |

Set it in the server's environment (hosting platform or Docker), for both the build and the running server. No `.env` file is needed: Astro does not load `.env` into its config, and local development needs no variables.

## See Also

- [EmDash documentation](https://docs.emdashcms.com/)
