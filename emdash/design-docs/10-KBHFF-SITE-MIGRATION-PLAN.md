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

No public XML sitemap was available at the usual locations checked:
`/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml`, and `/sitemap.php`
returned 404. `robots.txt` did not provide readable sitemap details. The route
inventory below is therefore an initial inventory from public navigation,
linked pages, and repository routes; it is not yet a complete crawl.

## Initial page and route inventory

| Live page or route | Live-site evidence reviewed (2026-10-22) | Content decision | Rendering / behavior decision |
| --- | --- | --- | --- |
| `/` | The home page features selected recent news and a link to the news archive. | EmDash owns the news entries and any editor-managed home-page copy or featured links. | Astro owns the home-page layout and queries EmDash for selected published content. |
| `/nyheder`, `/nyheder/:slug` | The archive is a dated feed; articles include editorial text and sometimes English summaries. | Store articles in EmDash `posts`, with locale variants where translations are maintained. | Astro owns archive and article templates, pagination, locale-aware links, and metadata. |
| `/om`, `/english` | `/om` is organization overview, values, and history. `/english` is a substantial English overview that also includes the principles and membership/product information. | EmDash `pages`; use related translated entries for maintained locale variants. | Astro renders the page entries. A route can be nested or use an explicit path mapping; do not hard-code long-form copy in Astro. |
| `/om/10-grundprincipper` | A long-form, ten-section values statement, revised December 2024; corresponding English material exists in `/english`. | EmDash page content; translate/review as a linked locale entry. | Astro generic CMS page template. |
| `/om/organisationen` | Long-form description of governance, departments, warehouse, purchasing and IT groups; includes operational staffing details. | EmDash page content, with review because several facts can change. | Astro generic CMS page template. |
| `/om/tidslinje` | Long, year/month-based organization history that changes as milestones are added. | EmDash page content or structured timeline records if editors need to maintain individual milestones. Start with a CMS page; do not bake dates into Astro. | Astro generic page template; use structured entries only if the timeline needs filtering or reuse. |
| `/om/produkter`, `/om/om-producenterne` | Product page lists current prices, member price tiers, seasonal products, and suppliers; producer page is a list of suppliers and outbound links. | EmDash content. For products/prices that must stay synchronized with ordering, treat the ordering system as the source of truth rather than duplicate editable price data in CMS. Supplier profiles can be structured EmDash entries if reused elsewhere. | Astro renders CMS content; dynamic current prices should come from an approved read-only integration, not constants in templates. |
| `/faq`, `/faq/:slug` | The live FAQ is grouped by topics and contains frequently updated membership, ordering, and volunteer answers. Its navigation marks the FAQ as Danish-only; the English page points users to it. | EmDash FAQ collection with question, answer, and topic fields. Translate selected answers as linked entries; do not invent English copy. | Astro owns grouped FAQ and question templates, query/filter behavior, and localized route generation. |
| `/afdelinger`, `/afdelinger/:slug` | The listing contains addresses, pickup hours, and status notes. Amager and Frederiksberg detail pages have English text; Logik is a cooperative-only department and Vanløse has a closure notice, so status is meaningful data. | EmDash structured department records for editor-managed descriptions, addresses, hours, contacts, and status. Confirm each branch's current data and translation before creating records. | Astro owns directory and detail templates. Keep joining, ordering, and account actions linked to their existing workflows. |
| `/ugens-pose`, `/ugens-pose/:slug` | The archive lists weekly bags. A detail page contains bag categories, item quantities, producer, unit prices, and pre-order extras. These are time-sensitive, commerce-adjacent facts. | Keep live order/bag facts in their authoritative ordering system unless a supported export or synchronization process is approved. EmDash can own explanatory copy and curated archive entries only when editors are responsible for them. | Astro renders a read-only view from the approved source. Do not create fictional week data or place live order-derived values in hard-coded templates. |
| `/medlem/quick-start-guide` | The page contains Danish and English guidance for shifts, ordering, pickup, membership, and links into account workflows. | EmDash page content with locale variants; the current live page already has an English section, so do not create a duplicate translation. | Astro generic CMS page template. Keep account and order actions external to this content page. |
| `/kontakt` | The page is a directory of organization and department contact details. | EmDash page or structured contact records; editors need to maintain email addresses and contact routing. | Astro page template; use links such as `mailto:` without embedding the directory in code. |
| `/persondata` | The live page describes member/order data use, retention, rights, and contacts. It labels an English version, but the fetched page content contained only Danish. | EmDash page with revision history; require privacy/legal review and verified English copy before publication. | Astro renders the approved content and metadata; do not paraphrase legal commitments in code. |
| `/handelsbetingelser` | The page contains supplier and member sales/delivery terms, payment and order rules, and was dated September 2026. | EmDash page with revision history; require legal/operational review and a separately reviewed English version. | Astro renders approved content; do not expose stale or machine-translated terms as authoritative. |
| `/bliv-medlem`, `/butik`, `/medlem`, `/profil`, `/login` | These routes perform membership, shopping, ordering, account, or authentication tasks. | Not CMS pages. Keep their transactional data and workflows in the existing system initially. | Do not recreate them as static Astro or EmDash pages. Astro may link to the existing application. |

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
Astro i18n is not configured, so there is currently no `/en` prefix. The
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

The current app has no Astro i18n configuration. The English draft entries use
the database's existing English default locale and remain drafts; enabling
multi-locale routing and deciding locale URL behavior are separate steps before
public rendering.

## Recommended implementation phases

### 1. Research and decide i18n

- Read [the i18n research note](./00-RESEARCH-I18N-EMDASH-ASTRO.md) before
  designing the content import or routes.
- Decide whether English URLs should retain `/english/...` or use `/en/...`;
  keep Danish's current unprefixed URLs either way.
- Prototype EmDash admin, content routing, language switching, and sitemap
  behavior with Danish as the default locale before configuring the live model.

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
- Add structured collections for FAQs, departments, and weekly bags if those
  sections are in scope.
- Preserve legacy slugs and route patterns where practical. Record redirect
  requirements for URLs that cannot be preserved.
- Decide how Danish and English content should be represented and linked.

### 4. Prepare and review the import

- Read legacy content without changing the existing database.
- Map legacy page fields (`name`, `subheader`, `description`, `html`, media) and
  post fields (`name`, `description`, `html`, tags, media, dates) to the
  approved EmDash models.
- Convert supported HTML formatting into Portable Text and report content that
  cannot be converted cleanly for manual review.
- Preserve publication dates and slugs where the target model supports them.
- Upload and associate media; identify unsupported or missing file formats.
- Produce a reviewable import manifest with source URL, target collection,
  target slug, and conversion warnings before writing to EmDash.

### 5. Build the public site

- Replace the starter homepage and adapt the existing EmDash layout/navigation
  for KBHFF.
- Implement Astro list/detail templates for news, static pages, FAQs, and
  departments. Use an approved read-only source for current weekly-bag data.
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
