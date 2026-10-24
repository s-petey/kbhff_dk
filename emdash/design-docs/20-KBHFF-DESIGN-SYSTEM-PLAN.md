# KBHFF design system plan

This document plans the visual layer of the Astro/EmDash site: colour
tokens, components, interface translations, and how components are
previewed. It complements the content and route plan in
[10-KBHFF-SITE-MIGRATION-PLAN.md](./10-KBHFF-SITE-MIGRATION-PLAN.md) and the
i18n research in
[00-RESEARCH-I18N-EMDASH-ASTRO.md](./00-RESEARCH-I18N-EMDASH-ASTRO.md).

## Goal

Give the EmDash site a recognizably KBHFF look with a modern design. This is
**not** a 1:1 copy of the legacy PHP theme: keep the brand green and the
recurring building blocks (banner, sidebar boxes, news cards, getting-started
steps, department listings, FAQ), and restyle them with current layout,
spacing, light/dark themes and accessibility practice.

## Legacy reference

Taken from `theme/www/css/lib/desktop/` and `theme/templates/` in the legacy
theme.

| Aspect | Legacy | Decision for EmDash |
| --- | --- | --- |
| Primary colour | `#3e8e17` (hover `#357914`) | Core of a new green scale; see [Colour palette](#colour-palette). |
| Other colours | Black text, greys `#666`/`#999`/`#dedede`, footer `#484848`, error red `#C22414` | Softer neutrals; keep the red for warnings. |
| Dark mode | None | Light and dark themes from the same green scale. |
| Headings | `voresfont` (Alte DIN 1451 Mittelschrift), uppercase | Paused. System font stack for now; see [Backlog](#backlog). |
| Body text | Arial | System font stack. |
| Layout | Fixed 960 px, two-thirds content + one-third sidebar | Fluid, max `72rem`; sidebar pattern kept, stacked on small screens. |
| Banner | Random 1000×215 photo strip on every page | `Banner` component: random photo by default, optional heading overlay. |
| Buttons | Square grey/green/red blocks, uppercase | Rounded `Button` with primary, secondary and warning variants. |
| Logo | Black stamp PNG (`logo-stempel_sort_*.png`) | Copied to `public/brand/logos/`, not used yet; web-friendly and dark-mode versions are a backlog item. |
| Interface language | Danish, with a few hard-coded English templates | Every UI string in a message catalogue (Danish and English). |

## Colour palette

Defined in `src/styles/theme.css`.

### Green scale

Hue held at the legacy green (HSL ≈ 101°); steps 600 and 700 are pinned to
the exact legacy values.

| Step | Hex | Contrast vs white | Contrast vs dark canvas `#141613` |
| --- | --- | --- | --- |
| 50 | `#f3faef` | 1.06 | 17.10 |
| 100 | `#e4f4dc` | 1.15 | 15.84 |
| 200 | `#c9e8ba` | 1.33 | 13.64 |
| 300 | `#9ed685` | 1.69 | 10.76 |
| 400 | `#73c74d` | 2.10 | 8.67 |
| 500 | `#51a928` | 2.98 | 6.11 |
| **600 (legacy core)** | **`#3e8e17`** | 4.12 | 4.29 |
| 700 (legacy hover) | `#357914` | 5.39 | 3.46 |
| 800 | `#2a5f10` | 7.65 | 2.38 |
| 900 | `#1e3e0f` | 11.99 | 1.52 |
| 950 | `#12240a` | 16.37 | 1.11 |

### Semantic tokens

Components use only these tokens, never primitives or raw colours (except
white text over the banner photo overlay).

**Naming.** Tokens are named by role, not by colour:

| Part | Examples | Meaning |
| --- | --- | --- |
| Role | `text`, `canvas`, `surface`, `border`, `brand`, `focus`, `warning`, `danger` | What the colour is for. |
| Modifier | `-muted`, `-inverse`, `-hover`, `-soft` | A variant of the role: quieter text, the dark band, hover state, pale tinted background. |
| `on-*` | `--color-on-brand`, `--color-on-warning`, `--color-on-danger` | Text or icons placed **on** a fill of that role (Material Design convention); always passes contrast against it. |

Status roles follow the common convention: `warning` is caution (amber),
`danger` is errors, destructive actions and closures (red).

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-text` | `#1d1f1c` | `#e7eae4` | Body text |
| `--color-text-muted` | `#5c625a` | `#a3aa9f` | Secondary text |
| `--color-canvas` | `#f7f8f5` | `#141613` | Page background |
| `--color-surface` | `#ffffff` | `#1c1f1b` | Cards on the canvas |
| `--color-border` | `#d5dbd1` | `#343a31` | Borders (decorative) |
| `--color-surface-inverse` | `#262925` | `#0d0f0c` | Dark band in both themes (e.g. footer) |
| `--color-text-inverse` | `#e9ece6` | `#e7eae4` | Text on the inverse surface |
| `--color-brand` | green-700 `#357914` | green-300 `#9ed685` | Links, buttons |
| `--color-brand-hover` | green-800 `#2a5f10` | green-200 `#c9e8ba` | Brand hover |
| `--color-brand-soft` | green-100 `#e4f4dc` | green-900 `#1e3e0f` | Tinted surfaces, badges |
| `--color-on-brand` | `#ffffff` | green-950 `#12240a` | Text on brand fills |
| `--color-focus` | green-600 `#3e8e17` | green-400 `#73c74d` | Focus ring |
| `--color-warning` | `#8a5300` | `#f0b94a` | Caution (amber) |
| `--color-warning-hover` | `#6b4000` | `#f5cf7e` | Warning hover |
| `--color-warning-soft` | `#fdf2d8` | `#3a2a08` | Caution surfaces |
| `--color-on-warning` | `#ffffff` | `#231600` | Text on warning fills |
| `--color-danger` | `#c22414` | `#f2897d` | Errors, closures (red) |
| `--color-danger-hover` | `#9a1d10` | `#f6aaa1` | Danger hover |
| `--color-danger-soft` | `#fbeceb` | `#3a1b17` | Error surfaces |
| `--color-on-danger` | `#ffffff` | `#1a0805` | Text on danger fills |

Renamed from the first version: `ink` → `text`, `muted` → `text-muted`,
`brand-accent` → `focus`, the red `warning` → `danger`, `footer` →
`surface-inverse`. `warning` is now a new amber role.

### Contrast checks (WCAG 2.x)

Text pairs need 4.5:1 (AA); focus rings and other UI need 3:1. All pairs pass.

| Pair | Light | Dark |
| --- | --- | --- |
| Text on canvas | 15.57 | 14.98 |
| Text-muted on canvas | 5.88 | 7.63 |
| Text-muted on brand-soft | 5.45 | 5.03 |
| Brand (link) on surface | 5.39 | 9.84 |
| Brand (link) on canvas | 5.06 | 10.76 |
| Brand on brand-soft (badges) | 4.69 | 7.09 |
| On-brand on brand (button) | 5.39 | 9.68 |
| On-brand on brand-hover | 7.66 | 12.27 |
| Focus ring on canvas | 3.87 | 8.67 |
| Warning on surface | 6.33 | 9.31 |
| Warning on warning-soft | 5.69 | 7.75 |
| On-warning on warning (button) | 6.33 | 9.90 |
| Text on warning-soft | 14.92 | 11.41 |
| Danger on surface | 5.90 | 6.86 |
| Danger on danger-soft | 5.15 | 6.41 |
| On-danger on danger (button) | 5.90 | 8.00 |
| Text-inverse on surface-inverse | 12.34 | 15.85 |

Ratios were computed with the WCAG relative-luminance formula, and spot-checked
with the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/):
`#357914` on white = 5.38 (AA pass), `#9ed685` on `#141613` = 10.7 (AAA pass),
`#8a5300` on white = 6.32 (AA pass), `#f0b94a` on `#141613` = 10.1 (AAA pass),
and legacy `#3e8e17` on white = 4.12 (AA fail for normal text). That last
result is why links and buttons use 700, not the legacy core green.

### Theme selection: `light-dark()`

Each semantic token is defined once, e.g.
`--color-text: light-dark(#1d1f1c, #e7eae4)`. `:root` sets
`color-scheme: light dark`, so the browser picks the value from the OS
setting; `data-theme="light"` or `data-theme="dark"` on `<html>` forces a
theme by setting `color-scheme` only. Following the OS needs no JavaScript.

`ThemeSelect` (`src/components/kbhff/ThemeSelect.astro`) lets visitors
choose System (default), Light or Dark with a labelled native `<select>`. It
sits in the site header's menu (see [Site header](#site-header)), so every page
that uses `Base.astro` has it, including the styleguide. A select was chosen
over three buttons: it is compact, needs no popover, and is natively
accessible on desktop and mobile; `color-scheme` makes the browser draw its
dropdown in the active theme. The theme changes on `change`, which is not a
change of context (WCAG 3.2.2). Labels come from the `theme` i18n namespace.
Behaviour:

- **Storage:** `localStorage` key `kbhff-theme`, value `light` or `dark`. The
  key is removed for System, so "System" means no stored value and no
  `data-theme` attribute. Every storage access is wrapped in try/catch.
- **Why not a cookie:** pages are server-rendered and may be route-cached, so
  the HTML must be identical for every visitor. A cookie would have to be read
  on the server to render the right theme, which makes responses vary per
  visitor and defeats caching.
- **No flash of the wrong theme:** `ThemeScript.astro` is a tiny blocking
  `<script is:inline>` in `<head>` (in `Base.astro`, before stylesheets and
  `EmDashHead`). It reads the key and sets `data-theme` before first paint.
- **`<meta name="color-scheme" content="light dark">`** in `Base.astro` lets the
  browser colour its own UI (scrollbars, form controls, canvas before CSS
  loads) to match. The inline script and the select set its content to
  `light` or `dark` when a theme is forced, and back to `light dark` for System.
- The server renders "System" as selected; the select's script sets the stored
  value on load. Several selects on one page stay in sync.

## Site header

`SiteHeader` (`src/components/kbhff/SiteHeader.astro`, used by `Base.astro`):

```
Wide (≥ 64rem):  [Brand]  nav links …        [Søg…]  Tema [System ▾]   🌐 English
Narrow:          [Brand]                                  🌐 English  [☰ Menu]
                 └ menu panel: nav links · search · Tema [System ▾]
```

| Part | Decision | Why |
| --- | --- | --- |
| Language link | Always visible in the header bar, on every screen size; never inside the menu. One link to the other language, named in that language ("English" / "Dansk"), with `lang` and `hreflang`; no flags. | People who cannot read the current language must be able to find it (USWDS two-language pattern). Flags stand for countries, not languages. |
| Theme | Native `<select>` inside the menu. | Low-priority preference; compact; accessible. |
| Menu button | Disclosure: `<button aria-expanded aria-controls>` labelled "Menu"; the panel opens below the bar. Escape closes it and returns focus to the button. No focus trap. | A menu is not a dialog, so the one-dialog rule never applies. |
| One markup | Navigation, search and theme render once: inline on wide screens, in the panel on narrow screens (CSS grid areas). | No duplicated links or controls. |
| Focus order | DOM: brand → menu button → menu → language link, so focus goes from the button straight into the opened menu. On wide screens the visual order matches the DOM. | Meaningful focus order (WCAG 2.4.3). |
| No JavaScript | The menu stays open and the button is hidden. | Navigation never becomes unreachable. |
| Current page | Navigation links set `aria-current="page"`. | Screen readers announce the current page. |

**Language link target: set by the page.** There is one language control on
every page (the header's `LanguageLink`); each page decides where it points
through `Base`'s `languageLink` prop (`{ locale, href }`):

| Page | `languageLink` |
| --- | --- |
| Content pages (after i18n routing) | The same entry in the other language via EmDash `getTranslations()` (published only); the other language's home page when there is no translation |
| Code-built routes (after i18n routing) | `getRelativeLocaleUrl()` for the same route |
| Styleguide | Its own `?lang=` variant (chrome stays English; components and samples switch) |
| Not set | The other language's home page (`/` or `/en/`, from `src/utils/locale-links.ts`) |

**Temporary:** Astro i18n routing is not configured yet, so pages do not set
`languageLink` and `/en/` does not exist yet. Once routing is configured,
content pages set it as above and the locale is passed to `getMenu()`.

`light-dark()` is Baseline 2024 (Chrome 123, Firefox 120, Safari 17.5). Older
browsers ignore the tokens and fall back to browser default colours: readable
black-on-white text, but without brand colours (buttons lose their fill). No
fallback is shipped yet; if analytics show meaningful traffic from older
Safari, add a light-only fallback inside
`@supports not (color: light-dark(black, white))`.

## Layout conventions

| Use | Layout | Examples |
| --- | --- | --- |
| Two-dimensional layouts: card grids, content + sidebar | **Grid** | `.auto-grid`, `.with-sidebar`, step cards, department list |
| Vertical stacks with even spacing | **Grid** (`display: grid; gap`) | `.stack`, `Card`, article card body, department card, FAQ group |
| One-dimensional, content-sized rows that may wrap | **Flex** | `.cluster`, button contents, icon + label, tag and pill lists, title + status badge, input + submit button |

Rules:

- Space siblings with `gap`, not margins. Margins are only for prose (CMS
  rich text such as the weekly-bag contents).
- Use logical properties (`margin-inline`, `padding-block`, `inset`,
  `text-align: start`).
- Components own their internal layout in scoped styles and follow the table
  above. Pages compose components with the primitives in
  `src/styles/layout.css`: `.stack`, `.cluster`, `.auto-grid` and
  `.with-sidebar`. These are wrapped in `:where()` (zero specificity), reset
  their children's block margins, and are configured with custom properties
  on the same element (`--stack-gap`, `--cluster-gap`, `--auto-grid-min`,
  `--sidebar-width`, …). The properties are registered with `@property` and
  `inherits: false`, so tuning an outer stack never changes a nested one.
- Page and component CSS should be limited to what is specific to them. Shared
  text styles live in `theme.css`: heading defaults (`h1`–`h4`), `.lead`,
  `.eyebrow`, `.text-muted`, `.text-small`. Buttons, pill links and toggle
  buttons use `Button` (it renders `<button>` without `href` and shows a
  selected state for `aria-pressed="true"` / `aria-current`).

**Cascade layers: not adopted.** With zero-specificity primitives and scoped
component styles there is no specificity conflict to manage. The remaining
risk is the starter's structural selectors in `theme.css` (`main > ul`,
`main > article`, …), which will be removed as the real page templates are
built; revisit layers if global styles grow.

## Dialogs

**Principle: one dialog at a time. Dialogs are never stacked.**

- Opening a dialog while another is open closes the open one first. A dialog
  may lead to another (e.g. "Continue to confirmation"), but it *replaces*
  the current one; it never opens on top of it.
- Never place a `Dialog` inside another `Dialog` in markup. In development the
  component logs an error if it finds a nested `<dialog>`.
- If a flow needs more than one step, change the content of the one dialog or
  move the flow to its own page. Don't chain dialogs as a wizard.
- Use a dialog only for short, focused tasks that must be finished or
  dismissed before continuing: a confirmation, a short notice. Content
  people need to read, compare or link to belongs on a page.

Why: stacked modals break focus management (where does focus return?),
confuse screen-reader users about which context they are in, and on small
screens leave no visible way back. The native `<dialog>` element allows
stacking in the top layer, so the rule is enforced by the component, not by
the browser.

`Dialog` (`src/components/kbhff/Dialog.astro`) implements this:

| Behaviour | How | Support / fallback |
| --- | --- | --- |
| Modal, focus trapped, page inert | Native `<dialog>` + `showModal()` | All browsers |
| Open / close | Invoker Commands: `<Button commandfor="id" command="show-modal">` and `command="close"`; no caller JavaScript | Baseline Dec 2025; the component includes a click fallback for older browsers |
| Light dismiss | `closedby="any"`: Escape or a click outside closes | Chrome 134, Firefox 141; the component falls back to its own backdrop-click handling in Safari, counting only presses that start on the backdrop |
| Results | Buttons in the `actions` slot use `type="submit" value="…"` inside `<form method="dialog">`; read `dialog.returnValue` on `close` | All browsers |
| One at a time | The `command` event (or the fallback) closes any open dialog before the next opens | — |
| Focus | Initial focus: `autofocus` on Cancel for confirmations (least destructive), otherwise the first focusable element. On close, focus returns to the element that opened the *first* dialog, even after a replacement | — |
| Accessible name | `title` → `aria-labelledby`; optional `description` → `aria-describedby`; translated close label | — |
| Layout | Grid rows `auto minmax(0, 1fr) auto`: header and actions stay in view, only the body scrolls (scroll shadows show more content). Height capped with `dvh` for mobile browser bars | — |
| Page scroll | Locked while a modal is open (`html:has(dialog:modal)`); `scrollbar-gutter: stable` prevents a layout shift | — |
| Motion | Fade/scale on open **and** close via `@starting-style` and `transition-behavior: allow-discrete`, only with `prefers-reduced-motion: no-preference` | Close animation needs `overlay` support (Chromium); elsewhere the dialog closes without fading |

## Interface translations (i18n)

The site must be translatable. Following the research note, **EmDash owns
editorial translations** (pages, posts, FAQ entries as linked locale
variants) and **the site owns interface strings**.

| Piece | File | Notes |
| --- | --- | --- |
| Locales | `src/i18n/locales.ts` | `da` and `en`. `defaultLocale = "da"` for the public site; `devLocale = "en"` for admin/dev tooling. |
| Messages | `src/i18n/messages/en.ts`, `da.ts` | English defines the shape (`Messages` type); every locale must provide the same keys or the type check fails. Each Danish string is marked `legacy: <template>` (wording from the PHP theme) or `REVIEW` (new translation; needs a Danish speaker's approval before launch). |
| Helpers | `src/i18n/index.ts` | `getMessages(locale)`, `format(template, values)` for `{name}` placeholders, `formatDate(locale, date)` via `Intl`. |
| Components | `src/components/kbhff/*` | Take `locale?: Locale`, defaulting to `Astro.currentLocale` and then the site default. No hard-coded copy. |
| Layout | `src/layouts/Base.astro` | Sets `<html lang>` and translates the search placeholder. |

Astro i18n routing is **not configured yet**, so `Astro.currentLocale` is
undefined and components fall back to Danish unless a page passes `locale`.
The URL structure is decided (see phase 1 of the migration plan): Danish
(`da`, default) is unprefixed at `/om`; English (`en`) is prefixed at
`/en/about`. EmDash's "do not prefix the default locale" applies to Danish
only. The fallback policy is still open. Locale codes are language codes
(`da`, not `dk`). To add a language: add its code to
`locales`, add `messages/<code>.ts` typed as `Messages`, and register it in
`src/i18n/index.ts`.

Dev and admin pages default to English. The styleguide chrome is English;
the site header's language link switches it between `?lang=en` and
`?lang=da`, which changes only the components' interface language and sample
data.

## Components

All components live in `src/components/kbhff/`. They take plain props (not
EmDash entries) so they can be rendered with sample data; pages map EmDash
entries to props. Links to membership, ordering and account workflows go
through `src/utils/legacy-app.ts` (`PUBLIC_LEGACY_APP_URL`, default
`https://kbhff.dk`), because those workflows stay in the PHP application.

| Component | Legacy source | Props / slots | Future data source | Status |
| --- | --- | --- | --- | --- |
| `Button` | `ul.actions a.button` | `href`, `variant`, `size`, `external` | — | In styleguide |
| `Banner` | `.banner variant:random` | `photo`, `heading`, `subheading`, default slot for actions | Static assets | In styleguide |
| `Card` | `.c-box` | `as`, `tone` | — | In styleguide (used by boxes) |
| `Icon` | Inline SVGs in `front.php` | `name`, `size`, `label` | — | In styleguide (new, simpler icons) |
| `ShortcutsBox` | "Genveje" sidebar box | `audience` (`guest`/`member`), `locale` | Optional `sidebar` widget area | In styleguide |
| `NewsletterBox` | Mailchimp sidebar form | `locale` | Optional section or widget | In styleguide |
| `WeeklyBagBox` | Weekly-bag sidebar box | `week`, `year`, `pickupDate`, `href`, `locale`, default slot for contents | `weekly_bags` collection | In styleguide |
| `ArticleCard` | News list and home "Udvalgte nyheder" | `href`, `title`, `excerpt`, `date`, `tags`, `imageSrc`/`imageAlt` or `media` slot, `locale` | `posts` | In styleguide |
| `Steps` | Home "Nemt at komme i gang" | `heading`, `steps[]` (`title`, `description`, `href`, `icon`) | `steps` block type on pages | In styleguide |
| `DepartmentCard` | `/afdelinger` list | `name`, `href`, address fields, `email`, `openingHours`, `status`, `statusNote`, `locale` | Departments (source of truth undecided) | In styleguide |
| `FaqGroup` | `/faq` grouped list | `title`, `questions[]` (`question`, `href`, `answer`), `locale` | `faq` collection | In styleguide |
| `Dialog` | Legacy JS overlays (e.g. profile "Luk" button) | `id`, `title`, `description`, `size`, `cancel`, `locale`, default and `actions` slots | — | In styleguide; see [Dialogs](#dialogs) |
| `SiteHeader` | `www.header.php` navigation | `siteTitle`, `siteLogo`, `links`, `locale` | Site settings, `primary` menu | In `Base.astro`; see [Site header](#site-header) |
| `ThemeSelect` | — (new) | `locale` | localStorage | In the site header |
| `LanguageLink` | — (legacy had a separate `/english` page) | `locale` (target), `href` | `getTranslations()` once i18n routing is configured | In the site header; links to the other language's home page for now |

The Astro site cannot read the PHP session, so `ShortcutsBox` does not detect
whether a visitor is logged in; the caller chooses `audience`.

## Previewing components: `/styleguide`

**Decision: an admin-only `/styleguide` page instead of Storybook.**

- Storybook has no official Astro support. The community
  `@storybook-astro/renderer` exists, but projects using it stub `astro:assets`
  and Astro virtual modules; EmDash's UI components depend on the running app,
  so the setup cost is high for this project.
- EmDash's docs describe "View on site" (signed draft preview), a
  visual-editing toolbar, and a development placeholder for unmapped block
  types, but no in-admin component gallery.

### Access

| Environment | Who can open `/styleguide` |
| --- | --- |
| `astro dev` | Anyone with access to the dev server. |
| Production build | Only a logged-in, enabled EmDash user with the **Admin** role. Everyone else gets the normal 404 page, so the URL does not reveal that the page exists. |

This works because EmDash's auth middleware sets `Astro.locals.user` on
public routes when an admin session cookie is present (it never blocks
public requests). The check is `src/utils/admin-access.ts`
(`canViewAdminTools`); EmDash role levels are SUBSCRIBER 10, CONTRIBUTOR 20,
AUTHOR 30, EDITOR 40, ADMIN 50. To share with editors too, lower the threshold
to 40. The response sets `Cache-Control: private, no-store` and
`X-Robots-Tag: noindex, nofollow`.

Verified: anonymous requests to `/styleguide` return 404 from a production
build. Not yet verified: access with a real admin session.

### Contents

- Page chrome in English. The site header's language link (the same control
  as on every page) switches component language and sample content via
  `?lang=da|en`; the intro shows the current language. All sample content is
  invented.
- Light/dark preview through the site header's `ThemeSelect` (System /
  Light / Dark), remembered per browser.
- Sections: colours (scale and semantic tokens), layout primitives,
  typography, icons, buttons (variants, link vs button, selected states),
  card tones, dialogs (including a demo of the one-at-a-time rule), site
  header (`LanguageLink`, `ThemeSelect`; `SiteHeader` itself is the page's
  own header), and every other component with its main variants and empty
  states.
- **Rule: every component in `src/components/kbhff/` is represented**, with
  each variant and state it supports. Add or update the styleguide section in
  the same change as the component.
- **Samples never leave the page.** Every sample link points at its own
  section's anchor. Components that build real URLs take an override for
  this: `ShortcutsBox` has a `hrefs` prop (defaults point into the member
  system). Forms are the exception: `NewsletterBox` posts to the live
  Mailchimp list, so a small script in `index.astro` stops sample forms from
  submitting; dialog forms (`method="dialog"`) still work.

### Structure

```
src/pages/styleguide/
├── index.astro              access check, intro, section list
├── _components/Section.astro    section wrapper: anchor, heading, spacing
└── _sections/*.astro        one file per section: markup + its sample content
```

Folders starting with `_` are not routes. To add a section, create a file in
`_sections/` and add one entry (`id`, `title`, component, `localized`) to the
`sections` list in `index.astro`; that list drives both the navigation and the
page. Sections with sample text keep a small `en`/`da` object at the top of
the file; everything else is plain markup.

Later, for editors: a seeded draft page using every block type, viewed
through EmDash's "View on site".

## Backlog

- [ ] **Image optimization.** Serve the logos and banner photos in
      web-friendly formats (WebP/AVIF, responsive sizes), for example via
      `astro:assets` from `src/assets/`, and get an SVG version of the stamp
      logo. The files in `public/brand/` are unoptimized copies of the legacy
      files (originals stay in `theme/www/img/`, which the PHP site still uses):

      | File in `public/brand/` | Legacy source | Size |
      | --- | --- | --- |
      | `logos/kbhff-stamp.png` | `logos/logo-stempel_sort_stor.png` | 440×440, 32 KB |
      | `logos/kbhff-stamp-small.png` | `logos/logo-stempel_sort_lille.png` | 48×48, 3 KB |
      | `logos/kbhff-stamp-small-carrot.png` | `logos/logo-stempel_sort_lille_gulerod.png` | 48×48, 5 KB |
      | `logos/kbhff-stamp-small-radish.png` | `logos/logo-stempel_sort_lille_radisse.png` | 48×48, 6 KB |
      | `banners/banner-1.jpg` … `banner-4.jpg` | `banners/desktop/pi_1.jpg` … `pi_4.jpg` | 1000×215, 100–143 KB each |

      Not copied: the smaller `banners/smartphone/` versions (responsive sizes
      should be generated from one source instead) and `logo_layover.png`
      (the legacy banner's logo overlay, which the new `Banner` does not use).
      The stamp logos are black only; dark mode needs a light or SVG variant
      that can use `currentColor`.
- [ ] **Brand font.** Evaluate `voresfont` (Alte DIN 1451 Mittelschrift,
      `theme/www/css/fonts/voresfont.*`): confirm the licence allows web use,
      or choose an open alternative, then add it with a `--font-display`
      variable.
- [ ] **Configure Astro i18n routing** once the URL decision is made, so
      `Astro.currentLocale` drives component language; add a language switcher
      and translated EmDash menus.
- [ ] Verify `/styleguide` with a real admin session in a production build.
- [ ] Use the components in `Base.astro` (header with logo, footer) and the
      existing page routes.
- [ ] Map Janitor menus to EmDash menus (`main-public`, `footer`) in the seed.
- [ ] Add a `sidebar` widget area for the shortcuts and newsletter boxes.
- [ ] Define block types for the home page (`hero`, `steps`, `video`,
      `featured_news`) and a seeded "Komponenter" draft page for editors.

## References

- [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.2: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [EmDash Preview Mode](https://docs.emdashcms.com/guides/preview/)
- [EmDash Blocks](https://docs.emdashcms.com/guides/blocks/)
- [@storybook-astro/renderer](https://www.jsdelivr.com/package/npm/@storybook-astro/renderer)
