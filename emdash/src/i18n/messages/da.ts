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
	search: {
		label: "Søg i nyheder", // REVIEW
		placeholder: "Søg…", // legacy: shop/index.php ("Søg"), ellipsis added for the placeholder
		submit: "Søg", // legacy: shop/index.php
	},
	header: {
		menu: "Menu", // REVIEW
		mainNavigation: "Hovedmenu", // REVIEW
	},
	news: {
		title: "Nyheder", // legacy: www/nyheder.php page title
		latest: "Seneste nyheder", // REVIEW
		empty: "Ingen nyheder", // legacy: posts/posts.php
		emptyFiltered: "Ingen nyheder her endnu.", // REVIEW
		filters: "Filtrér nyheder", // REVIEW
		categories: "Kategorier", // REVIEW
		tags: "Tags", // REVIEW
		allNews: "Alle nyheder", // REVIEW
		pagination: "Sider", // REVIEW
		firstPage: "Første side", // REVIEW
		nextPage: "Næste side", // legacy: weeklybag/list.php
	},
	notFound: {
		title: "Hov! Siden findes ikke", // REVIEW: legacy pages/view.php used "Hov!" + "Der skete en fejl."
		body: "Vi kunne ikke finde den ønskede side.", // legacy: pages/view.php
		home: "Gå til forsiden", // REVIEW
	},
	languageBanner: {
		message: "Denne side findes også på dansk.", // REVIEW
		action: "Se på dansk", // REVIEW
		dismiss: "Luk", // legacy: www/js/lib/desktop/types/m-user_profile.js
		region: "Sprogforslag", // REVIEW
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
	theme: {
		label: "Tema", // REVIEW
		system: "System", // REVIEW
		light: "Lys", // REVIEW
		dark: "Mørk", // REVIEW
	},
};

export default da;
