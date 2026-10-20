# KBHFF member system: repository recap

## Application

KBHFF's member system is a PHP application built on the Janitor framework. The repository contains the application in `theme/` and Janitor as a Git submodule in `submodules/janitor/`. The application uses Apache, PHP, and MariaDB/MySQL, with Janitor providing shared framework features such as users, shop, subscriptions, and administration.

The application covers member accounts and subscriptions, product ordering, outlet/department operations, purchasing, pickup dates, and administration. App-specific classes and templates are under `theme/classes/` and `theme/templates/`; public entry points are under `theme/www/`.

## Local development

A Docker Compose setup is present:

- `docker-compose.yml` starts MariaDB and the PHP/Apache application.
- `Dockerfile` builds the PHP 7.4 Apache image and enables the required extensions and rewrite module.
- `docker/00-init.sh` imports the Janitor and application schemas/default data and seeds a local admin account.
- `docker/seed-access.php` grants Janitor access to the Developer group on startup without overwriting existing grants.
- `apache/httpd-vhosts-docker.conf` configures the local Apache virtual host and aliases.
- `DOCKER.md` documents startup, URLs, and local credentials.

Start the environment from the repository root with:

```bash
docker compose up -d --build
```

The setup is intended for local development. Do not reuse its sample credentials in a production deployment. The Docker setup has not been runtime-verified as part of this recap.

## Janitor admin navigation patch

Janitor's client-side admin navigation URL cleaner uses `location.host` rather than `document.domain`, so non-default ports are retained. The change is in Janitor's source and merged bundles, and in the production admin bundles under `theme/www/janitor/js/`.

The Janitor source patch is committed separately in the submodule on branch `fix/admin-navigation-port`; the parent repository commit records the updated submodule pointer and production bundles. Preserve this patch if Janitor is updated or the bundles are rebuilt.

## Modernisation discussion

`MODERN-STACK-TLDR.md` records the proposed direction for a future rebuild: pilot EmDash/Astro on Cloudflare for editorial content, with custom application workflows for membership, subscriptions, outlet operations, and global coordination. It recommends a shared operational database with outlet-scoped records and explicitly notes that the CMS does not replace the operations system.
