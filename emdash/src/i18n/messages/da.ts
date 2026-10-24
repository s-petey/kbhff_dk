import type { Messages } from "./en";

/**
 * Danish interface strings.
 *
 * Each string is marked with where it came from:
 *   - `legacy: <template>`: same wording as the legacy PHP theme (theme/templates/).
 *   - `REVIEW`: new translation written for this site; needs review by a
 *     Danish speaker before public launch. Remove the marker once approved.
 */
const da: Messages = {
	common: {
		search: "Søg…", // legacy: shop/index.php ("Søg"), ellipsis added for the placeholder
	},
	shortcuts: {
		title: "Genveje", // legacy: pages/view.php sidebar
		takeShift: "Ta' en vagt", // legacy: pages/view.php sidebar
		orderBag: "Bestil en pose", // legacy: pages/view.php sidebar
		logIn: "Log ind", // legacy: pages/kbhff-login.php (the sidebar button said "Login")
		becomeMember: "Bliv medlem", // legacy: pages/view.php sidebar
	},
	newsletter: {
		title: "Tilmeld nyhedsbrev", // legacy: pages/view.php ("Tilmeld Nyhedsbrev"), sentence case
		body: "Få nyheder om ugens pose, arrangementer og fællesskabet.", // REVIEW
		emailLabel: "E-mail", // legacy: pages/view.php newsletter form
		submit: "Tilmeld", // legacy: pages/view.php newsletter form
	},
	weeklyBag: {
		title: "Ugens pose", // legacy: weeklybag/view.php
		weekOfYear: "Uge {week}, {year}", // legacy: weeklybag/list.php
		notCreated: "Ugens pose er endnu ikke oprettet.", // legacy: weeklybag/view.php
		readMore: "Læs mere om ugens pose", // legacy: weeklybag/view.php
	},
	department: {
		status: {
			open: "Åben", // legacy: purchasing/index.php
			membersOnly: "Kun for andelshavere", // REVIEW
			closed: "Lukket", // legacy: purchasing/index.php
		},
		address: "Adresse", // legacy: departments/departments-view.php
		openingHours: "Åbningstider", // legacy: departments/departments-view.php
		email: "E-mail", // legacy: pages/view.php newsletter form
	},
	faq: {
		empty: "Ingen spørgsmål i denne kategori endnu.", // REVIEW: legacy faq/list.php used "Ingen spørgsmål og svar"
		openAnswer: "Åbn svaret", // REVIEW
	},
	dialog: {
		close: "Luk", // legacy: www/js/lib/desktop/types/m-user_profile.js
		cancel: "Annuller", // legacy: signup/signup.php
	},
};

export default da;
