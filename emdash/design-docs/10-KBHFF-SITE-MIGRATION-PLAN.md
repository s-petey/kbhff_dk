# KBHFF website migration plan

This document plans how to reproduce the public KBHFF website in the Astro
application with EmDash as its CMS. The public site is rendered by Astro;
editorial content belongs in EmDash. No legacy content has been imported and
no existing application workflows have been replaced.

## Goal

Build the public-facing KBHFF site in Astro and EmDash, keeping this work in
the `emdash/` directory alongside the existing PHP application. Astro owns
routes, templates, and interactive presentation; EmDash owns editor-managed
content and structured records. Preserve current public URLs where practical
so links and search results continue to work.

The existing PHP/Janitor application remains responsible for member accounts,
ordering, and other operational workflows unless those are separately scoped
and implemented.

## What we found

- The EmDash project currently uses the Starter template with `posts` and
  `pages` collections and a SQLite database.
- The local EmDash database contains the starter **Welcome** post and **About**
  page, not imported KBHFF content.
- The configured Docker database is MariaDB 10.11, but it was not reachable
  from this development session during review.
- The repository contains an old SQL fixture with several Janitor-managed
  pages. It is dated and is not a reliable inventory of current production
  content.
- Janitor pages and posts store HTML. EmDash rich text uses Portable Text, so
  an import needs a content conversion step.
- Many PHP routes are dynamic application features, not content pages.
- Each public URL is a controller in `theme/www/<name>.php` that selects a
  template in `theme/templates/`. A template either loads a Janitor record
  (CMS-made) or contains its content directly (hand-made). See
  [Code-verified route inventory](#code-verified-route-inventory).
- Site menus are Janitor navigation records in the database, not template
  code, and should become EmDash menus.

No public XML sitemap was available at the usual locations checked:
`/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml`, and `/sitemap.php`
returned 404. `robots.txt` did not provide readable sitemap details. The route
inventory below combines public navigation, linked pages, and a review of the
PHP controllers and templates; it is not yet a complete crawl, and which
slug-based pages exist can only be confirmed from the database.

## Code-verified route inventory

Reviewed 2026-10-24 against the PHP theme in this repository (`theme/www/` and
`theme/templates/`). Routes and templates have not changed since commit
`c1d3dcec`.

**Built how** uses these values:

- **CMS**: content comes from records editors manage in Janitor admin.
- **Hand-made**: content is written in the PHP template.
- **Mixed**: hand-made template with some CMS-managed parts.
- **Workflow**: application feature, not a content page.

| Route | Controller → template | Content source in code | Built how | Notes |
| --- | --- | --- | --- | --- |
| `/` | `index.php` → `pages/front.php` | Posts tagged `on:frontpage` (max 6); this week's `weeklybag` record for the step-4 link. A `page:front` record is loaded only for share metadata. | **Mixed, mostly hand-made** | Heading "Velkommen til KBHFF", the four "Nemt at komme i gang" steps (inline SVG icons), the interview video (`/assets/videos/interview.mp4`) and calls to action are hard-coded. |
| `/forside` | `forside.php` | None | Redirect | Redirects to `/`. |
| `/om` | `om.php` → `pages/about.php` | Page tagged `page:about`; menu `sub-about` | CMS | — |
| `/om/:slug` | `om.php` → `pages/view.php` | Any published `page` record whose slug (`sindex`) matches | CMS | Generic slug route. `10-grundprincipper`, `organisationen`, `tidslinje`, `produkter` and `om-producenterne` appear nowhere in code; they exist only as database records. |
| `/english` | `english.php` → `pages/english.php` | Page tagged `page:english`; menu `sub-english` | CMS | The `/english/:slug` route is commented out, so English sub-pages cannot be reached today. |
| `/nyheder` | `nyheder.php` → `posts/posts.php` | `post` records, 20 per page; category list from post tags | CMS | Pagination at `/nyheder/page/:n`. |
| `/nyheder/:slug` | `nyheder.php` → `posts/post.php` | `post` record | CMS | — |
| `/nyheder/tag/:tag`, `/nyheder/tag/:tag/page/:n` | `nyheder.php` → `posts/posts_tag.php` | Posts filtered by tag | CMS | Tag archive. |
| `/nyheder/tag/:tag/:slug` | `nyheder.php` → `posts/post_tag.php` | `post` record within a tag context | CMS | Duplicate article URL under a tag. |
| `/faq` | `faq.php` → `faq/list.php` | `qna` records grouped by tags from the `faq` tag list, ordered by position | CMS | Fields: `question`, `answer`. `qna` is a Janitor core item type; it is not defined in the theme. |
| `/faq/:slug` | `faq.php` → `faq/view.php` | `qna` record | CMS | Does not filter by published status. |
| `/afdelinger` | `afdelinger.php` → `departments/departments.php` | Intro: page tagged `page:departments`. List: `project_departments` table. | CMS intro + admin data | Departments are edited at `/janitor/department`. They are not Janitor items. |
| `/afdelinger/:name` | `afdelinger.php` → `departments/departments-view.php` | `project_departments` row matched by **name** | Admin data | Fields: address, geolocation, email, opening hours, MobilePay ID, description, HTML. |
| `/ugens-pose` | `ugens-pose.php` → `weeklybag/list.php` | Intro: page tagged `page:weekly-bag`. List: `weeklybag` records, newest first, 52 per page. | CMS | Pagination at `/ugens-pose/liste/:slug`. |
| `/ugens-pose/:slug` | `ugens-pose.php` → `weeklybag/view.php` | `weeklybag` record (slug `pose-YYYY-uge-WW`) | CMS | Editor-typed HTML; see [Data sources](#data-sources-behind-the-public-pages). Does not filter by published status. |
| `/medlem` | `medlem.php` → `pages/member.php` | Page tagged `page:member`; menu `sub-member` | CMS | — |
| `/medlem/:slug` | `medlem.php` → `pages/view.php` | Any published `page` record whose slug matches | CMS | Includes `quick-start-guide`. `/medlem/tag-en-vagt` uses the same route but requires login. |
| `/kontakt` | `kontakt.php` → `pages/contact.php` | Page tagged `page:contact` | CMS | — |
| `/persondata` | `persondata.php` → `pages/person_data.php` | Page tagged `page:persondata` | CMS | — |
| `/handelsbetingelser` | `handelsbetingelser.php` → `pages/business_terms.php` | Page tagged `page:businessterms` | CMS | — |
| `/bliv-medlem` (+ steps) | `bliv-medlem.php` → `signup/*.php` | Intro text from pages tagged `page:signup`, `page:signupfees`, `page:already-member`, `page:bliv-medlem-verificer`, `page:signup-confirmed` and `page:signup-confirm-failed` | Workflow + CMS text | Forms and logic are hand-made. |
| `/login` (+ password reset) | `login.php` → `pages/kbhff-login.php`, `pages/forgot_password*.php`, `profile/*.php` | Intro text from page tagged `page:login` | Workflow + CMS text | — |
| `/butik`, `/bestil`, `/profil`, `/butiksvagt`, `/medlemshjaelp`, `/indkoeb`, `/bogholder`, `/massemail`, `/lokaladmin` | One controller each | Application data | Workflow | Shop, profile, shop-shift, volunteer, purchasing, accounting, mass-mail and local-admin tools. |

These template parts are hand-made on every page that has them:

- the "Genveje" / "Shortcuts" box (shift, order, login and signup links)
- the Mailchimp newsletter signup form

### Data sources behind the public pages

| Data | Storage | Edited at | Fields | Tied to ordering? | Migration note |
| --- | --- | --- | --- | --- | --- |
| Pages | Janitor `page` items (`item_page`); model defined in the theme (`theme/classes/items/type.page.class.php`) | `/janitor/admin/page` | `published_at`, `name` (title), `subheader`, `description` (SEO, max 155 chars), `html` (allowed: `p`, `h2`–`h4`, `ul`, `ol`, downloads, images, Vimeo, YouTube), `single_media` (one 960×540 PNG/JPG), `mediae` (up to 20 PNG/JPG), tags | No | Fixed pages are found by tag (`page:about`, `page:contact`, …). Generic pages are found by slug under `/om/` and `/medlem/`. Media is served from `/images/<item_id>/<variant>/…` (`theme/library/public`). |
| News | Janitor `post` items (`item_post`); model defined in the theme (`type.post.class.php`) | `/janitor/post` | `published_at`, `name`, `classname` (CSS class), `description` (SEO, max 155 chars), `html` (same allowed tags as pages), `mediae` (up to 20 PNG/JPG/MP4), tags | No | The `on:frontpage` tag selects home-page features. Posts can include MP4 video. |
| FAQ | Janitor core `qna` items (`item_qna`; `submodules/janitor/src/classes/items/type.qna.class.php`) | `/janitor/admin/qna` | `question`, `answer` (allowed: `p`, `h3`, `h4`, `ul`, `ol`, images, downloads), `position`, `faq:<category>` tag. `name` is generated from the first 45 characters of the question. `about_item_id` is an optional link to another item. | No | Category names come from the `faq` tag list. |
| All item types | Shared `items` table (Janitor core) | — | `sindex` (URL slug), `status` (1 = published), `itemtype`, `user_id`, `created_at`, `modified_at`, `published_at` | — | Preserve `sindex` as the EmDash slug and `published_at` as the publication date. |
| Weekly bags | Janitor `weeklybag` items (`item_weeklybag`) | `/janitor/weeklybag` | `name`, `week`, `year`, `html` (short contents), `full_description` | **No**: editor-typed HTML, not derived from orders | Can become an EmDash collection. The orderable product is a separate `productweeklybag` item. |
| Departments | `project_departments` table (not an item type) | `/janitor/department` | name, abbreviation, address, postal code, city, geolocation, lat/long, email, opening hours, MobilePay ID, accepts signup, description, `html` | **Yes**: linked to pickup dates, products and members (`project_department_pickupdates`, `project_department_products`, `user_department`) | Decide on a single source of truth before copying these into EmDash. |
| Menus | Janitor `navigation` + `navigation_nodes` | `/janitor/admin/navigation` | `node_name`, `node_link`, `node_item_id` (link to an item), `node_target`, `node_fallback` (alternative link, for example `/login`), `relation` (parent node, for nesting), `position` | No | Handles in use: `main-public`, `footer`, `sub-about`, `sub-english`, `sub-member`, `sub-butiksvagt`. Map them to EmDash menus. |
| Product prices on `/om/produkter` | Typed into the page's HTML | `/janitor/admin/page` | — | Not synchronized today | Any link to ordering-system prices would be new functionality. |

### What the code cannot confirm

- **Which slug pages exist.** Pages under `/om/` and `/medlem/` exist only in
  the database. The repository fixture
  (`theme/config/db/default_data/items.sql`, dated 2018–2020) contains only
  these pages: `persondata`, `allerede-medlem`, `tilmelding`,
  `vaelg-medlemskab`, `afdelinger-i-kbhff`, `for-leverandoerer` and
  `handelsbetingelser`. `for-leverandoerer` is not in the inventory below; its
  live status and URL are unknown.
- **The exact Janitor version.** The parent repository pins
  `submodules/janitor` to commit `30d9c481`, a local port-fix commit (see
  `README.md`) that was never pushed to `parentnode/janitor` and cannot be
  fetched. The Janitor models above were reviewed at the previous upstream pin,
  `c5cf864c` (2025-09-03), which differs only by that fix. The theme's `page`
  and `post` models take precedence over Janitor's, because Janitor puts the
  theme path first on the PHP include path (`src/config/init.php`).
- **Content visibility.** `/faq/:slug` and `/ugens-pose/:slug` do not check
  published status, so unpublished records may be reachable by URL. Use the
  database `status` field, not URL reachability, to decide what is live.

## Page and route inventory and decisions

| Live page or route | Live-site evidence reviewed (2026-10-22) | Content decision | Rendering / behavior decision |
| --- | --- | --- | --- |
| `/` (and `/forside`, which redirects to `/`) | The home page features selected recent news and a link to the news archive. | EmDash owns the news entries; featured posts are selected today by the `on:frontpage` tag. The home-page copy (welcome heading, four steps, video, calls to action) is hard-coded in `pages/front.php`, with no editor-managed copy. Decide whether to move this copy into EmDash (for example a `home` page entry or widget area) or keep it in the Astro template. | Astro owns the home-page layout and queries EmDash for featured posts and the current weekly bag. Redirect `/forside` to `/`. |
| `/nyheder`, `/nyheder/:slug`, `/nyheder/page/:n`, `/nyheder/tag/:tag`, `/nyheder/tag/:tag/page/:n`, `/nyheder/tag/:tag/:slug` | The archive is a dated feed; articles include editorial text and sometimes English summaries. | Store articles in EmDash `posts` with a taxonomy for the legacy post tags, with locale variants where translations are maintained. | Astro owns the news list (with category/tag filter parameters), article template, pagination, locale-aware links, and metadata. `/nyheder/:slug` is the article URL (`/en/news/:slug` in English). Decided (2026-10-24): the legacy tag and page URLs are not mapped or redirected. |
| `/om`, `/english` | `/om` is organization overview, values, and history. `/english` is a substantial English overview that also includes the principles and membership/product information. | EmDash `pages`; use related translated entries for maintained locale variants. Each is a single Janitor page (`page:about`, `page:english`) with its own sub-menu (`sub-about`, `sub-english`). `/english/:slug` sub-routes are disabled in the current code. | Astro renders the page entries. A route can be nested or use an explicit path mapping; do not hard-code long-form copy in Astro. |
| `/om/10-grundprincipper` | A long-form, ten-section values statement, revised December 2024; corresponding English material exists in `/english`. | EmDash page content; translate/review as a linked locale entry. | Astro generic CMS page template. |
| `/om/organisationen` | Long-form description of governance, departments, warehouse, purchasing and IT groups; includes operational staffing details. | EmDash page content, with review because several facts can change. | Astro generic CMS page template. |
| `/om/tidslinje` | Long, year/month-based organization history that changes as milestones are added. | EmDash page content or structured timeline records if editors need to maintain individual milestones. Start with a CMS page; do not bake dates into Astro. | Astro generic page template; use structured entries only if the timeline needs filtering or reuse. |
| `/om/produkter`, `/om/om-producenterne` | Product page lists current prices, member price tiers, seasonal products, and suppliers; producer page is a list of suppliers and outbound links. | EmDash content. Today the prices are typed by hand into the page's HTML and are not synchronized with ordering. Migrating them as page content keeps current behavior; linking them to ordering-system prices would be new functionality. Supplier profiles can be structured EmDash entries if reused elsewhere. | Astro renders CMS content. If a price integration is approved, current prices should come from a read-only source, not constants in templates. |
| `/faq`, `/faq/:slug` | The live FAQ is grouped by topics and contains frequently updated membership, ordering, and volunteer answers. Its navigation marks the FAQ as Danish-only; the English page points users to it. | EmDash FAQ collection with question, answer, and topic fields. Translate selected answers as linked entries; do not invent English copy. | Astro owns grouped FAQ and question templates, query/filter behavior, and localized route generation. |
| `/afdelinger`, `/afdelinger/:slug` | The listing contains addresses, pickup hours, and status notes. Amager and Frederiksberg detail pages have English text; Logik is a cooperative-only department and Vanløse has a closure notice, so status is meaningful data. | The intro text is a Janitor page (`page:departments`). Departments are rows in `project_departments`, edited at `/janitor/department`. They are not CMS items: the same rows link to pickup dates, products and member department assignments used by ordering. Choose one source of truth before copying them into EmDash. Options: keep the PHP system authoritative and read it, sync one way into EmDash, or move descriptive fields only (description, `html`, opening hours) into EmDash. Confirm each branch's current data and translation before creating records. | Astro owns directory and detail templates. Legacy detail URLs use the department **name** (`/afdelinger/Amager`), not a slug, so map or redirect them. Keep joining, ordering, and account actions linked to their existing workflows. |
| `/ugens-pose`, `/ugens-pose/:slug`, `/ugens-pose/liste/:slug` | The archive lists weekly bags. A detail page contains bag categories, item quantities, producer, unit prices, and pre-order extras. | Weekly bags are editor-typed Janitor items (`weeklybag`: name, week, year, short `html` contents, `full_description`). They are not derived from orders. The orderable product is a separate `productweeklybag` item. Model them as an EmDash `weekly_bags` collection with the same fields and migrate the history. The intro text is a Janitor page (`page:weekly-bag`). Do not create fictional week data. | Astro owns archive (paginated, newest first) and detail templates, plus a "this week's bag" component for the home page and sidebar. Preserve the `pose-YYYY-uge-WW` slugs. |
| `/medlem`, `/medlem/:slug` (including `/medlem/quick-start-guide` and `/medlem/tag-en-vagt`) | The quick-start page contains Danish and English guidance for shifts, ordering, pickup, membership, and links into account workflows. | EmDash page content with locale variants. `/medlem` is a Janitor page (`page:member`) with the `sub-member` menu; sub-pages are found by slug. The current live quick-start page already has an English section, so do not create a duplicate translation. | Astro generic CMS page template. `/medlem/tag-en-vagt` requires login today; decide whether it stays in the PHP application. Keep account and order actions external to these content pages. |
| `/kontakt` | The page is a directory of organization and department contact details. | EmDash page or structured contact records; editors need to maintain email addresses and contact routing. | Astro page template; use links such as `mailto:` without embedding the directory in code. |
| `/persondata` | The live page describes member/order data use, retention, rights, and contacts. It labels an English version, but the fetched page content contained only Danish. | EmDash page with revision history; require privacy/legal review and verified English copy before publication. | Astro renders the approved content and metadata; do not paraphrase legal commitments in code. |
| `/handelsbetingelser` | The page contains supplier and member sales/delivery terms, payment and order rules, and was dated September 2026. | EmDash page with revision history; require legal/operational review and a separately reviewed English version. | Astro renders approved content; do not expose stale or machine-translated terms as authoritative. |
| `/bliv-medlem`, `/login` | These routes perform membership signup and authentication. | Not CMS pages, but their intro text comes from Janitor pages (`page:signup`, `page:signupfees`, `page:already-member`, `page:bliv-medlem-verificer`, `page:signup-confirmed`, `page:signup-confirm-failed`, `page:login`). That text stays in Janitor while the workflows stay in PHP. | Do not recreate them as static Astro or EmDash pages. Astro may link to the existing application. |
| `/butik`, `/bestil`, `/profil`, `/butiksvagt`, `/medlemshjaelp`, `/indkoeb`, `/bogholder`, `/massemail`, `/lokaladmin` | These routes perform shopping, ordering, account, shop-shift, volunteer, purchasing, accounting, mass-mail and local-admin tasks. | Not CMS pages. Keep their transactional data and workflows in the existing system. | Do not recreate them as static Astro or EmDash pages. Astro may link to the existing application. |

This is an evidence-based first-pass classification, not a complete crawl.
The live English coverage is uneven: `/english` includes the organization and
principles, the quick-start guide is bilingual, and at least Amager and
Frederiksberg department pages include English. The FAQ navigation explicitly
labels it Danish-only. Other pages must be checked individually before
creating an English variant; preserve the current live pages as the content
source and treat translation placeholders as drafts.

### English draft pages staged

Based on the live-page review, the seed addendum
[`../seed/english-page-drafts.json`](../seed/english-page-drafts.json)
adds draft EmDash page entries with concise English summaries based on live
pages reviewed on 2026-10-22. They cover the overview, core principles,
organization, timeline, products, producers, FAQ landing page,
department directory, weekly-bag archive, contact, privacy policy, terms, and
quick-start guide. The existing Starter About entry is replaced with an
unpublished KBHFF draft. These are source-based working summaries, not
complete translations or approved publishable copy. Each entry includes its
source URL and appropriate review caveats.

Apply or reapply this draft set locally with
`pnpm --dir emdash exec emdash seed seed/english-page-drafts.json --on-conflict=update`.
The update replaces the existing Starter About content with its draft
summary; the other entries are created as drafts.

#### Live-page to browser URL path and EmDash entry crosswalk

This is the direct comparison between pages reviewed on the live site and
draft entries added to the local EmDash database. “Browser URL path” is
the pathname after the domain (for example, `https://example.org/about` has
the path `/about`); it is not the full URL or a `#fragment`. EmDash entry IDs
are database identifiers, not browser URLs. Entries are unpublished English
summaries or editorial notes, not complete translations of the source pages.

| Live page reviewed | Target browser URL path | Local EmDash entry | Status / comparison note |
| --- | --- | --- | --- |
| [`/om`](https://kbhff.dk/om/) and [`/english`](https://kbhff.dk/english) | `/about` | `pages` entry, slug `about` — “About KBHFF” | Draft summary of the co-op, member ownership, produce, and collection model; live `/english` already has related English content to review. |
| [`/om/10-grundprincipper`](https://kbhff.dk/om/10-grundprincipper/) | `/core-principles` | `pages` entry, slug `core-principles` — “Our Core Principles” | Draft summary of all ten themes; compare with the existing English principles on `/english` and verify the full statement. |
| [`/om/organisationen`](https://kbhff.dk/om/organisationen/) | `/organization` | `pages` entry, slug `organization` — “How KBHFF Is Organized” | Draft summary of the three organizational levels and shared work; verify changeable operational details. |
| [`/om/tidslinje`](https://kbhff.dk/om/tidslinje/) | `/timeline` | `pages` entry, slug `timeline` — “KBHFF Timeline” | Short draft overview only; verify dates and events against the changing source timeline. |
| [`/om/produkter`](https://kbhff.dk/om/produkter/) | `/products` | `pages` entry, slug `products` — “Products and Prices” | Draft overview of product types; prices intentionally omitted and must be checked against current ordering information. |
| [`/om/om-producenterne`](https://kbhff.dk/om/om-producenterne/) | `/producers` | `pages` entry, slug `producers` — “Our Producers” | Draft with selected supplier examples, not a complete or guaranteed-current list; verify names and participation. |
| [`/faq`](https://kbhff.dk/faq/) | `/faq` | `pages` entry, slug `faq` — “Frequently Asked Questions” | Draft topic overview only; no individual answers translated. Live FAQ is marked Danish-only. |
| [`/afdelinger`](https://kbhff.dk/afdelinger/) | `/departments` | `pages` entry, slug `departments` — “Our Departments” | Draft directory overview; branch records, hours, and contact details still need individual verification. |
| [`/ugens-pose`](https://kbhff.dk/ugens-pose/) | `/weekly-bag` | `pages` entry, slug `weekly-bag` — “Weekly Bag Archive” | Draft archive summary only; no week-specific contents, quantities, or prices copied. |
| [`/kontakt`](https://kbhff.dk/kontakt/) | `/contact` | `pages` entry, slug `contact` — “Contact KBHFF” | Draft contact routing and main address; verify all details before publishing. |
| [`/persondata`](https://kbhff.dk/persondata/) | `/privacy` | `pages` entry, slug `privacy` — “Privacy Policy” | Internal editorial note summarizing topics and source-stated retention periods; not approved privacy copy or a legal translation. |
| [`/handelsbetingelser`](https://kbhff.dk/handelsbetingelser/) | `/terms-and-conditions` | `pages` entry, slug `terms-and-conditions` — “Terms of Sale and Delivery” | Internal editorial note describing source sections; not a translation or contractual terms. |
| [`/medlem/quick-start-guide`](https://kbhff.dk/medlem/quick-start-guide/) | `/quick-start-guide` | `pages` entry, slug `quick-start-guide` — “Quick Start Guide” | Draft summary based on the page's existing English section; verify current deadlines and procedures. |

No English draft entries were created for the home page (`/`) or news archive and
articles (`/nyheder/...`); the home/news content uses the EmDash `posts` model
and Astro routes are still to be implemented. Individual department and FAQ
detail pages also have no entries in this draft set. No operational
routes were copied into CMS content.

The paths in the table are the paths implied by each entry's current slug and
the generic Astro page route; they do not yet preserve the legacy URL paths.
Astro i18n is not configured yet, so there is currently no `/en` prefix (it
appears automatically for English once `i18n` is configured; see
[phase 1](#1-research-and-decide-i18n)). The
entries are drafts and are not public pages. Before publishing, implement the
routes and decide whether to preserve the source paths or add explicit
redirects. The local EmDash database did not contain Danish source content, so
the staged English entries are not yet linked to source entries through a
translation group. Once source content is imported or created, review these
English drafts and create linked translations from their corresponding source
entries. The FAQ and
department entries are landing-page copy only, not question or branch records;
the weekly-bag entry contains no fabricated week data. No news stories or
transactional workflows were duplicated.

**Update (2026-10-24):** Astro i18n is now configured with Danish as the
default (see [phase 1](#1-research-and-decide-i18n)), and the local database
was found empty of content, so these drafts are no longer present. Do **not**
re-apply `seed/english-page-drafts.json` as it is: its entries have no
`locale`, so they would now be created as Danish entries. Before reusing it,
add `"locale": "en"` to each entry and link each one to its Danish source with
`translationOf` once that source exists.

## Recommended implementation phases

### 1. Research and decide i18n

- Read [the i18n research note](./00-RESEARCH-I18N-EMDASH-ASTRO.md) before
  designing the content import or routes.
- **Decided (2026-10-24): Danish is the default locale and stays unprefixed;
  English is prefixed with `/en/`.** Locale codes are `da` and `en` (language
  codes; not `dk`). Configuration:

  ```js
  // astro.config.mjs
  i18n: {
  	defaultLocale: "da",
  	locales: ["da", "en"],
  },
  ```

  | Language | Code | Default? | URL | Legacy URL |
  | --- | --- | --- | --- | --- |
  | Danish | `da` | Yes | `/om`, `/nyheder/...` (no prefix) | Mostly unchanged; see below |
  | English | `en` | No | `/en/about`, `/en/...` (prefix added by Astro) | `/english` → redirect to `/en` |

  EmDash's "do not prefix the default locale" rule is about Danish only:
  `/da/...` would make `/_emdash/admin` return 404. Prefixing English is
  Astro's default behaviour and is required. See
  [the i18n research note](./00-RESEARCH-I18N-EMDASH-ASTRO.md#configure-locale-routing-safely).

  The default locale is **fixed** in `src/i18n/locales.ts` (imported by
  `astro.config.mjs`), not an environment setting: it decides which route
  folder serves which language. Developers who prefer English use `/en/…`;
  the language banner suggests it to browsers that prefer another language.
  The only environment variable is `SITE_URL`, required in production and
  unset in development (see the EmDash app's README, "Deployment").
- **Decided (2026-10-24): English URLs use English words, with the least
  custom code.** EmDash builds sitemap, hreflang and preview URLs from one
  `urlPattern` per collection plus the locale prefix, so:

  | Kind | Danish | English | Rule |
  | --- | --- | --- | --- |
  | Home | `/` | `/en` | Route files |
  | News list (code route, intro from CMS pages `nyheder` / `news`) | `/nyheder` | `/en/news` | Translated segment, route files |
  | News list filtered by category and/or tag | `/nyheder?kategori=…&tag=…` | `/en/news?category=…&tag=…` | Translated parameter names; values are the term slugs per language |
  | Page (CMS, `urlPattern` `/{slug}`) | `/om` | `/en/about` | Catch-all route; the slug is translated per entry |
  | News item (CMS content, our route; `urlPattern` `/nyheder/{slug}`) | `/nyheder/velkommen` | `/en/news/welcome` | Translated segment, route files; the slug is translated per entry |

- **Decided (2026-10-24): news URLs are ours; everything else is EmDash's.**
  Only the URL shape is custom; content and slugs stay in the CMS.
  - One pure table, `src/i18n/routes.ts`: path `nyheder` ↔ `news`, parameters
    `kategori` ↔ `category`, `tag` ↔ `tag`, and the news URL functions used by
    the routes, hreflang and the sitemap.
  - EmDash builds `/en/nyheder/…` from the single posts `urlPattern` (admin
    preview, "View"); `src/pages/en/nyheder/[slug].astro` redirects those to
    `/en/news/…`, keeping the query (`?_preview`).
  - News items do not pass `content` to EmDash's head, so EmDash emits no
    hreflang for them; we emit alternates from `getHreflangAlternates()` with
    the URLs rebuilt (it still decides published / hidden from search engines).
    Robots comes from `getSeoMeta()`. A native EmDash plugin was considered and
    rejected: it must be a separate npm package.
  - `src/pages/sitemap-posts.xml.ts` wraps EmDash's posts sitemap and corrects
    the English URLs; it uses EmDash's internal route export
    (`emdash/internal/routes/…`), so check it on EmDash upgrades.
  - Category and tag archive pages were dropped in favour of the news list
    filter. The legacy URL mapping (`/nyheder/tag/…`, `/nyheder/page/:n`) is
    not carried over and has no redirects. The `core:categories` sidebar widget
    was removed from the seed because it links to `/category/{slug}`.
- Still open: whether English falls back to Danish content when a page has no
  translation (`fallback: { en: "da" }`). Start without a fallback.
- **Open problem (2026-10-24): EmDash's built-in widgets are not
  language-aware.** The news article page renders the CMS widget area
  `sidebar` (`<WidgetArea name="sidebar" />` in `src/views/NewsArticleView.astro`;
  contents managed in the admin under Widgets, seeded from `seed/seed.json`).
  Its `core:recent-posts` widget (EmDash 1.3.1,
  `emdash/src/components/widgets/RecentPosts.astro`):
  - queries posts without `locale`, so English pages list Danish news;
  - links to `/posts/{id}` unless a `urlTemplate` prop is set; that route does
    not exist here (`urlTemplate: "/nyheder/:slug"` would fix Danish links
    only; English would go through the `/en/nyheder` redirect);
  - has one title for all languages, since widget areas are not per language.
  The widget's props (count, thumbnails, date, `urlTemplate`) cannot fix the
  language filter. Options: (A) remove the widget area and seed widgets until
  the article sidebar is designed (legacy: shortcuts, newsletter, weekly bag),
  then build it from our translated components; (B) our own "latest news"
  list in `NewsArticleView`; (C) keep the CMS sidebar but allow only widgets
  that work in both languages (Portable Text content; menu widgets need
  checking, since `WidgetRenderer` calls `getMenu()` without a locale).
  Recommended: A. Not yet decided.
- **Implemented (2026-10-24)** in the EmDash app: Astro `i18n` config,
  a catch-all route for CMS pages, Danish and English news routes (thin
  wrappers around shared views in `src/views/`), locale-aware queries, menus
  and search, `src/i18n/routes.ts` for news URLs and filters, and
  `src/i18n/translations.ts` for language links and news hreflang. `seed/seed.json` holds
  linked Danish and English starter content, categories, tags and a menu per
  language.

### 2. Complete and classify the inventory

- Obtain a current, read-only export of the legacy database, or perform an
  approved crawl of public pages.
- Inventory routes, page titles, language, publication state, dates, media,
  taxonomy, and internal links.
- Classify each route as CMS content, a static informational page, or an
  application workflow.
- Confirm which sections and historical content are in scope.

### 3. Agree on content models and URL behavior

- Keep EmDash `posts` for news articles.
- Keep `pages` for ordinary static pages.
- Add structured collections for FAQs and weekly bags if those sections are
  in scope.
- Decide the source of truth for departments before modeling them; they are
  shared with ordering (see [Data sources](#data-sources-behind-the-public-pages)).
- Map the Janitor menus (`main-public`, `footer`, `sub-about`, `sub-english`,
  `sub-member`) to EmDash menus.
- Preserve legacy slugs and route patterns where practical. Record redirect
  requirements for URLs that cannot be preserved.
- Decide how Danish and English content should be represented and linked.

### 4. Prepare and review the import

- Read legacy content without changing the existing database.
- Map legacy page fields (`name`, `subheader`, `description`, `html`, media),
  post fields (`name`, `description`, `html`, tags, media, dates), FAQ fields
  (`question`, `answer`, category tag, position) and weekly-bag fields
  (`name`, `week`, `year`, `html`, `full_description`) to the approved EmDash
  models.
- Import only records with published status; some legacy detail routes show
  unpublished records.
- Convert supported HTML formatting into Portable Text and report content that
  cannot be converted cleanly for manual review.
- Preserve publication dates and slugs where the target model supports them.
- Upload and associate media; identify unsupported or missing file formats.
- Produce a reviewable import manifest with source URL, target collection,
  target slug, and conversion warnings before writing to EmDash.

### 5. Build the public site

- Replace the starter homepage and adapt the existing EmDash layout/navigation
  for KBHFF.
- Implement Astro list/detail templates for news (including tag archives),
  static pages, FAQs, departments, and weekly bags.
- Keep EmDash admin content management available to editors.
- Link operational actions to the existing member system until replacements
  have been explicitly designed and built.

### 6. Validate and prepare launch

- Compare imported item counts and slugs against the reviewed source inventory.
- Review converted rich text, links, images, dates, language, and navigation.
- Check mobile layout, accessibility, page metadata, and application links.
- Generate an EmDash sitemap and compare its URLs with the intended public
  route inventory.
- Test old-to-new redirects and key user journeys before switching traffic.

## Import tooling

EmDash's `site import` command imports a package exported from another EmDash
site; it is not a direct importer for Janitor or MariaDB. For this migration,
use a purpose-built read-only extractor and transformation step, then create
content through the EmDash CLI/API or apply a reviewed seed to an empty target.
The local EmDash database has already been initialized, so changing the seed
alone will not replace or update its existing content.

The EmDash documentation MCP server provides EmDash documentation tools; it
does not connect to the KBHFF database or import legacy content.

## Decisions and safeguards

- Do not migrate member records, credentials, payment data, or other personal
  data as part of a public-content migration.
- Do not write to the legacy database.
- Do not replace operational workflows with static pages.
- Do not publish imported content until the source mapping and content review
  are complete.
- Keep a source-to-target mapping and import report so the migration can be
  audited and safely retried.

## References

- [KBHFF website](https://kbhff.dk/)
- [KBHFF news](https://kbhff.dk/nyheder)
- [KBHFF about](https://kbhff.dk/om)
- [KBHFF English page](https://kbhff.dk/english)
- [KBHFF departments](https://kbhff.dk/afdelinger)
- [KBHFF FAQ](https://kbhff.dk/faq)
- [KBHFF weekly bag](https://kbhff.dk/ugens-pose)
- [EmDash CLI](https://docs.emdashcms.com/reference/cli/)
- [EmDash schema evolution](https://docs.emdashcms.com/deployment/schema-evolution/)
- [EmDash and Astro internationalization](./00-RESEARCH-I18N-EMDASH-ASTRO.md)
