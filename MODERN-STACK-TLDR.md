# Modernisation recommendation: TL;DR

**Recommendation:** Pilot **EmDash + Astro on Cloudflare** for the public website and CMS, with a custom TypeScript application for member, outlet, and global operations. Keep all outlets in **one shared operational database**, with every outlet-owned record scoped by `outlet_id`.

This is a good fit if low infrastructure cost and Cloudflare are priorities, and the organisation has a developer who can build and maintain the custom workflows. EmDash is a capable, promising CMS, but it is new; test it with the volunteers who will edit pages before committing to it.

## What goes where

- **EmDash:** public pages, news, images, menus, drafts, and revisions. Editors work with a small set of page types and approved content blocks; developers control the design and layout.
- **Custom application:** membership, subscriptions, orders, outlet products and availability, purchasing, stock coordination, and payments.
- **Permissions:** CMS roles govern editorial work. Application permissions separately scope members and outlet supervisors, while global staff can work across outlets.
- **Data:** one operational database for all outlets keeps global reporting and coordination straightforward. Keep editorial content separate logically; use a separate database only if it makes migrations, access, or backups safer without adding undue operational burden.

## Alternatives

- Choose **WordPress plus a separate operations application** if volunteer familiarity and a well-established editing experience matter most. Expect two applications to maintain and integrate.
- Choose **Laravel + PostgreSQL + Filament** for a more conventional, conservative foundation for business-critical workflows. Filament accelerates custom admin screens; it is not a turnkey CMS.
- **Payload + Next.js** is a credible TypeScript option, but is not the obvious choice if the main reason is Cloudflare: verify the maturity of the Cloudflare/Next.js and D1 integration paths before selecting it.

## Cost and operational caveats

Cloudflare can be inexpensive at modest usage: Workers Paid currently has a **$5/month account minimum**, with D1 and R2 usage subject to their respective included allowances and limits. This is infrastructure pricing, not a total cost estimate: payment processing, email, development, maintenance, and backups are additional.

D1's paid plan currently limits each database to **10 GB**, and each database processes queries one at a time. This may be entirely adequate for the co-op, but validate ordering peaks, concurrent stock changes, recovery, and migrations before relying on it for operations. Do not create one database per outlet unless physical isolation or independent operation is a real requirement; it complicates global reporting and cross-outlet workflows.

## First step

Run a short pilot with real editors: have them create and publish a news item and update a representative page using the proposed blocks. Separately prototype a critical operational flow—such as placing an order against outlet availability—and test permissions and simultaneous updates. Decide only after both the editor experience and operational model have been exercised.

## Sources checked (18 October 2026)

- [EmDash Cloudflare deployment](https://docs.emdashcms.com/deployment/cloudflare/)
- [EmDash admin panel and roles](https://docs.emdashcms.com/concepts/admin-panel/)
- [EmDash page blocks](https://docs.emdashcms.com/guides/blocks/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 limits and throughput](https://developers.cloudflare.com/d1/platform/limits/)
- [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [EmDash project and roadmap](https://github.com/emdash-cms/emdash)
- [WordPress publishing features](https://wordpress.org/about/features/)
- [Filament installation](https://filamentphp.com/docs/5.x/introduction/installation)
- [Payload database options](https://payloadcms.com/docs/database/overview)
- [Cloudflare Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
