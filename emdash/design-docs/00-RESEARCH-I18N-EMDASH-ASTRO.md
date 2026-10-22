# Astro and EmDash internationalization best practices

This document summarizes the recommended approach for building a multilingual
site with Astro's built-in i18n routing and EmDash's translated content model.
It is framework guidance, not a decision about any particular site's languages,
URLs, content, or existing architecture.

## Divide responsibilities

- **Astro owns locale-aware routing.** Configure the supported locales and
  default locale in `astro.config.mjs`. Use `Astro.currentLocale` for the
  request's locale and helpers from `astro:i18n` to generate and validate
  localized URLs.
- **EmDash owns editorial translations.** Each translated entry is a separate
  row with its own database ID, slug, publication status, and revision history.
  EmDash groups related locale variants together.
- **The site owns translated interface copy.** Astro routing does not translate
  template strings. Keep navigation labels, buttons, validation messages, and
  other UI text in a consistent localization layer, separate from CMS content.

## Configure locale routing safely

Enable i18n by setting `i18n.locales` and `i18n.defaultLocale` in Astro's
configuration. Add a fallback only when the product's content policy calls for
one.

EmDash requires the default locale to remain unprefixed. Use Astro's default
`prefix-other-locales` strategy; do not set `routing: "prefix-always"` or
`prefixDefaultLocale: true`. Prefixing the default locale breaks the EmDash
admin routes mounted at `/_emdash/admin`.

```js
i18n: {
  defaultLocale: "en",
  locales: ["en", "fr"],
  fallback: { fr: "en" },
},
```

The language codes above are examples only. Choose locale identifiers and URL
structure based on the site's actual language and routing requirements.

Use Astro's file-based localized routes and `getRelativeLocaleUrl()` (or the
appropriate helper for absolute URLs) rather than constructing locale URLs by
hand. For more customized routing, follow Astro's documented manual-routing
approach and verify it alongside EmDash's injected routes.

## Query content in the active locale

Pass `Astro.currentLocale` to EmDash content and menu queries. This keeps
lookups unambiguous when slugs overlap and ensures lists contain the requested
locale:

```ts
const { entries, error } = await getEmDashCollection("posts", {
  locale: Astro.currentLocale,
  status: "published",
});
```

Handle query errors explicitly rather than treating an empty result as proof
that no content exists. Collection queries return only the requested locale;
they do not fall back to another language.

For a single entry, EmDash can follow the configured fallback chain. Fallback
uses the same slug at each locale, so it cannot discover a translation with a
different slug. Where fallback is enabled, use the returned fallback-locale
information to make the displayed language clear when appropriate.

Use EmDash's translation lookup (`getTranslations()`) to find related locale
variants, especially when their slugs differ. A language switcher should link
only to variants appropriate for the site's publication policy; translations
can exist as drafts or scheduled entries.

## Automated translation

EmDash provides translation management, but does not automatically translate
content by itself. Its admin creates a linked draft prefilled from the source
for an editor to translate. The site MCP server can also create a linked
translation draft when prompted by an AI client; the AI client, not EmDash,
provides the translation.

For a repeatable integrated workflow, a plugin can call a translation provider
and create the result through EmDash's content API. EmDash's plugin APIs support
reading entries and creating locale variants linked with `translationOf`.
Plugins can also store provider credentials as encrypted secret settings and
make network requests restricted to declared hosts.

Recommended safeguards:

- Make translation an explicit editor action or queued job, rather than
  automatically translating on every save. This avoids duplicate work,
  recursive updates, unexpected provider costs, and conflicts with active
  editorial changes.
- Always create translations as drafts. Never auto-publish machine output;
  require a human review before publication.
- Translate only appropriate translatable text fields. Preserve structured
  rich-text blocks and references, and do not translate identifiers, media
  references, URLs, or fields marked non-translatable.
- Link variants using EmDash's translation group (`translationOf`); do not
  create unrelated copies. Detect an existing target-locale variant and handle
  conflicts explicitly instead of silently overwriting it.
- Send only the content needed to the provider. Review its data-retention and
  privacy terms, protect API credentials, and report provider or validation
  errors to the editor without creating a partial or success-shaped draft.
- Record the source revision and provider/model used so editors can identify
  stale translations and review what produced a draft.

An initial low-complexity approach is to use the site MCP with an AI client to
create a linked translation draft on request. For a built-in editor button and
provider configuration, implement a plugin action with a provider adapter,
encrypted secret settings, restricted network access, and explicit draft
creation. Select the provider, target locales, eligible fields, and review
policy before wiring that integration.

## Localize navigation and metadata

- Create a translated EmDash menu for each supported locale and request it
  using the active locale.
- EmDash menu item URLs do not include Astro's locale prefix. Apply Astro's
  locale URL helper to root-relative internal links, while leaving external
  URLs unchanged.
- Use EmDash's content head integration (`EmDashHead`) on content pages so
  published translations can provide alternate-language metadata.
- Check generated sitemap output for localized URLs and alternate-language
  references. Include any routes not managed by EmDash through the site's
  appropriate sitemap mechanism.
- Localize page titles, descriptions, accessible labels, dates, number formats,
  and other user-facing output; translating only the body text is incomplete.

## Editorial and implementation workflow

1. Define the supported locales, default locale, URL strategy, and fallback
   policy before creating translated content.
2. Implement locale-aware routes, content queries, navigation, and UI strings.
3. Create translations through EmDash's translation workflow so the locale
   variants remain linked. Treat each translation's slug, status, and revision
   history as independently managed.
4. Test missing translations and fallback behavior explicitly. Do not assume
   collection listings will show fallback content.
5. Verify the admin and API routes, localized links, language switchers,
   metadata, and sitemap after enabling i18n.

## Sources

- [EmDash: Internationalization](https://docs.emdashcms.com/guides/internationalization/)
- [EmDash: AI tools and site MCP](https://docs.emdashcms.com/guides/ai-tools/)
- [EmDash: Navigation menus](https://docs.emdashcms.com/guides/menus/)
- [EmDash: JavaScript API reference](https://docs.emdashcms.com/reference/api/)
- [EmDash: Plugin capabilities and security](https://docs.emdashcms.com/plugins/creating-plugins/capabilities/)
- [EmDash: Plugin settings](https://docs.emdashcms.com/plugins/creating-plugins/settings/)
- [EmDash: Plugin API routes](https://docs.emdashcms.com/plugins/creating-plugins/api-routes/)
- [Astro: Internationalization routing](https://docs.astro.build/en/guides/internationalization/)
- [Astro: Configuration reference](https://docs.astro.build/en/reference/configuration-reference/#i18n)
