# KBHFF website migration plan

This document plans how to reproduce the public KBHFF website in the EmDash
application in this directory. It is a planning document only; no legacy
content has been imported and no existing application workflows have been
replaced.

## Goal

Build the public-facing KBHFF pages in EmDash, keeping this work in the
`emdash/` directory alongside the existing PHP application. Preserve current
public URLs where practical so links and search results continue to work.

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

| Existing KBHFF route or section | EmDash approach |
| --- | --- |
| `/` | Replace the starter recent-posts landing page with a KBHFF home page: introduction, calls to action, department links, and selected recent news. |
| `/nyheder`, `/nyheder/:slug` | Use the EmDash `posts` collection. Add routes under `/nyheder` and preserve article slugs, publication dates, excerpts, images, and taxonomy when available. |
| `/om`, `/om/:slug`, `/english` | Use EmDash pages for the organization overview, principles, history, and English content. Add nested routes for `/om/...`; the current generic page route only handles one slug segment. |
| `/faq`, `/faq/:slug` | Add an FAQ collection with question, answer, and topic/category fields; implement grouped listings and individual question routes. |
| `/afdelinger`, `/afdelinger/:slug` | Add a departments collection for addresses, opening hours, contact details, and current status; render list and detail pages from that data. |
| `/ugens-pose` | Model weekly bags as structured, time-sensitive content, including any agreed archive/history requirements. |
| `/kontakt`, `/persondata`, `/handelsbetingelser` | Migrate as regular EmDash pages. Have KBHFF review privacy and legal copy before publishing. |
| `/bliv-medlem`, `/butik`, `/medlem`, `/profil`, `/login` | Keep these application workflows in the existing system initially and link to them from EmDash. Rebuilding them is a separate project. |

The public site also links to routes such as `/medlem/quick-start-guide`,
`/om/produkter`, `/om/10-grundprincipper`, `/om/organisationen`, and
`/om/tidslinje`. Confirm these and discover remaining routes during the full
inventory phase.

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
- Implement the agreed list and detail routes for news, static pages, FAQs,
  departments, and weekly bags.
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
