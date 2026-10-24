# Task: trigram search by default

Status: **open** (2026-10-24). Related: search decisions in
[10-KBHFF-SITE-MIGRATION-PLAN.md](./10-KBHFF-SITE-MIGRATION-PLAN.md)
(phase 1, i18n).

## Goal

News and page search use the FTS5 `trigram` tokenizer in every environment
(local, staging, production) without a manual step. An admin can also see and
change the setting in the EmDash admin.

## Why trigram

The site searches Danish and English with one setting: EmDash's tokenizer is
per collection, not per language, and SQLite has no Danish stemmer. Tested
with SQLite FTS5 and the query form EmDash builds (`"word"*`, words ANDed):

| Search | `porter unicode61` (default) | `unicode61` | `trigram` |
| --- | --- | --- | --- |
| "pose" → grøntsag**spose** (Danish compound) | ✗ | ✗ | ✓ |
| "nør" → Nørrebro | ✓ | ✓ | ✓ |
| "GRØNT" (case, æ/ø/å) | ✓ | ✓ | ✓ |
| "ugens pose er" (includes a 2-letter word) | — | — | ✓ |
| "ug" (2 letters alone) | ✓ | ✓ | ✗ |
| Word endings | English stemming, also applied to Danish text | none | none (substring) |

`trigram` matches inside words, which Danish compounds need, and is no worse
than `unicode61` for English. Trade-offs: a search of only 1–2 letters finds
nothing, the index is larger (fine at news volume), and some loose matches
("ost" also matches "post"); bm25 ranking puts closer matches first.

## Current state (EmDash 1.3.1)

- Both `posts` and `pages` run on the default `porter unicode61`: their
  `_emdash_collections.search_config` is `{"enabled":true}`, and EmDash
  falls back to `DEFAULT_SEARCH_TOKENIZER` (`emdash/src/search/fts-manager.ts`).
- The tokenizer is stored per collection in the database, so it is
  per-environment state.
- It can only be set through the authenticated admin API (permission
  `search:manage`), which also rebuilds the index:

  ```
  POST /_emdash/api/search/enable
  { "collection": "posts", "enabled": true, "tokenize": "trigram" }
  ```

- It **cannot** be set in the seed (`seed/` has no tokenizer field), the CLI
  (`emdash search` only queries), the admin UI (no tokenizer control), or
  `astro.config.mjs`.
- Re-applying the seed or re-saving a collection's schema keeps an existing
  tokenizer (`schema/registry.ts` passes `config.tokenize` to the rebuild).

## Options

1. **Manual step per environment (stopgap).** An admin calls the API above
   once for `posts` and `pages` after setup. Document it in the README
   (Deployment). Easy to forget on a new environment, so not the goal.
2. **Upstream EmDash support (preferred).** Propose to EmDash, in order of
   value:
   - a seed field on collections, for example
     `"search": { "tokenize": "trigram" }`, applied on seed and setup, so the
     repository holds the setting;
   - a tokenizer select in the admin's collection search settings, so admins
     see and change it (with a note that changing it rebuilds the index);
   - optionally a site-wide default in the integration config
     (`emdash({ search: { tokenize } })`).
3. **Our own startup code (rejected).** Calling EmDash's internal search
   manager at startup is custom code against internals, which this project
   avoids.

## Steps

- [ ] Check the EmDash repository and changelog for existing support or an
  open issue (seed `search` config, admin tokenizer control).
- [ ] If none, open an issue or PR upstream for option 2, with the test table
  above as motivation (multilingual sites, compound words).
- [ ] Meanwhile, apply option 1 locally (after `emdash login`) and verify
  "pose" finds the "Ugens pose" example post on `/nyheder?q=pose`.
- [ ] Add the one-time API call to the README's Deployment section until
  option 2 lands.
- [ ] When EmDash supports it, set the tokenizer in `seed/seed.json`, remove
  the manual step, and close this task.

## Done when

- A fresh environment set up from the seed searches with `trigram` for posts
  and pages, with no manual step.
- The admin shows the tokenizer for each searchable collection.
- `/nyheder?q=pose` finds "Ugens pose", and `/en/news?search=bag` finds
  "This week's bag".
