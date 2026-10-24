/**
 * English interface strings. This file defines the message shape; every
 * other locale must provide the same keys (enforced by the `Messages` type).
 * Placeholders use `{name}` and are filled by `format()`.
 */
const en = {
	common: {
		search: "Search…",
	},
	header: {
		menu: "Menu",
		mainNavigation: "Main navigation",
	},
	news: {
		title: "News",
		latest: "Latest news",
		empty: "No news yet.",
		emptyFiltered: "No news here yet.",
		filters: "Filter news",
		categories: "Categories",
		tags: "Tags",
		allNews: "All news",
		pagination: "Pages",
		firstPage: "First page",
		nextPage: "Next page",
	},
	notFound: {
		title: "Page not found",
		body: "We could not find the page you were looking for.",
		home: "Go to the home page",
	},
	languageBanner: {
		/** Shown in this language to visitors whose browser prefers it. */
		message: "This page is also available in English.",
		action: "View in English",
		dismiss: "Close",
		region: "Language suggestion",
	},
	shortcuts: {
		title: "Shortcuts",
		takeShift: "Take a shift",
		orderBag: "Order a bag",
		logIn: "Log in",
		becomeMember: "Become a member",
	},
	newsletter: {
		title: "Sign up for our newsletter",
		body: "News about the weekly bag, events and the community.",
		emailLabel: "Email",
		submit: "Sign up",
	},
	weeklyBag: {
		title: "This week's bag",
		weekOfYear: "Week {week}, {year}",
		notCreated: "This week's bag has not been added yet.",
		readMore: "Read more about this week's bag",
	},
	department: {
		status: {
			open: "Open",
			membersOnly: "Members only",
			closed: "Closed",
		},
		address: "Address",
		openingHours: "Opening hours",
		email: "Email",
	},
	faq: {
		empty: "No questions in this category yet.",
		openAnswer: "Open the answer",
	},
	dialog: {
		close: "Close",
		cancel: "Cancel",
	},
	theme: {
		label: "Theme",
		system: "System",
		light: "Light",
		dark: "Dark",
	},
};

export type Messages = typeof en;

export default en;
