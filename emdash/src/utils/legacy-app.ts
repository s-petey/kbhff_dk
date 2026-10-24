/**
 * Membership, ordering and account workflows stay in the existing PHP
 * application. Links to them are built from this base URL so local
 * development can point at the Docker setup instead of production.
 */
const LEGACY_APP_URL = (import.meta.env.PUBLIC_LEGACY_APP_URL ?? "https://kbhff.dk").replace(/\/$/, "");

export function legacyAppUrl(path: string): string {
	return `${LEGACY_APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
