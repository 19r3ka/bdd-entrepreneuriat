import { createRouter, createWebHistory } from "vue-router";
import BusinessDetailView from "../views/BusinessDetailView.vue";
import BusinessListView from "../views/BusinessListView.vue";
import EntrepreneurDetailView from "../views/EntrepreneurDetailView.vue";
import EntrepreneurListView from "../views/EntrepreneurListView.vue";
import PortfolioDashboardView from "../views/PortfolioDashboardView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: PortfolioDashboardView,
		},
		{
			path: "/entrepreneurs",
			name: "entrepreneur-list",
			component: EntrepreneurListView,
		},
		{
			path: "/entrepreneurs/new",
			name: "entrepreneur-new",
			component: () => import("../views/EntrepreneurCreateView.vue"),
		},
		{
			path: "/entrepreneurs/:id",
			name: "entrepreneur-detail",
			component: EntrepreneurDetailView,
		},
		{
			path: "/entrepreneurs/:id/edit",
			name: "entrepreneur-edit",
			component: () => import("../views/EntrepreneurEditView.vue"),
		},
		{
			path: "/businesses",
			name: "business-list",
			component: BusinessListView,
		},
		{
			path: "/businesses/new",
			name: "business-new",
			component: () => import("../views/BusinessCreateView.vue"),
		},
		{
			path: "/businesses/:id",
			name: "business-detail",
			component: BusinessDetailView,
		},
		{
			path: "/businesses/:id/edit",
			name: "business-edit",
			component: () => import("../views/BusinessEditView.vue"),
		},
		{
			path: "/reports",
			name: "reports",
			component: () => import("../views/ReportingView.vue"),
		},
		{
			path: "/supports",
			name: "support-list",
			component: () => import("../views/SupportListView.vue"),
		},
		{
			path: "/supports/new",
			name: "support-new",
			component: () => import("../views/SupportCreateView.vue"),
		},
		{
			path: "/supports/:id/edit",
			name: "support-edit",
			component: () => import("../views/SupportEditView.vue"),
		},
		{
			path: "/supports/:id",
			name: "support-detail",
			component: () => import("../views/SupportDetailView.vue"),
		},
		{
			path: "/quick-wins",
			name: "quick-win-list",
			component: () => import("../views/QuickWinListView.vue"),
		},
		{
			path: "/quick-wins/new",
			name: "quick-win-new",
			component: () => import("../views/QuickWinCreateView.vue"),
		},
		{
			path: "/quick-wins/:id",
			name: "quick-win-detail",
			component: () => import("../views/QuickWinDetailView.vue"),
		},
		{
			path: "/quick-wins/:id/edit",
			name: "quick-win-edit",
			component: () => import("../views/QuickWinEditView.vue"),
		},
		{
			path: "/dev-tools",
			name: "dev-tools",
			component: () => import("../views/DevToolsView.vue"),
		},
	],
});

export default router;
