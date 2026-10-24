/**
 * Access check for internal tooling pages such as /styleguide.
 *
 * EmDash's auth middleware sets `Astro.locals.user` on public routes when an
 * admin session exists (it never blocks the request). Role levels come from
 * `@emdash-cms/auth`: SUBSCRIBER 10, CONTRIBUTOR 20, AUTHOR 30, EDITOR 40,
 * ADMIN 50. The package is not a direct dependency, so the level is repeated
 * here.
 */
const ROLE_ADMIN = 50;

export function canViewAdminTools(locals: App.Locals): boolean {
	if (import.meta.env.DEV) return true;
	const user = locals.user;
	return Boolean(user && !user.disabled && user.role >= ROLE_ADMIN);
}
