import {notFound} from "next/navigation";

import FooterLayout from "@/app/components/layout/FooterLayout";
import NothingLayout from "@/app/components/layout/NothingLayout";
import {HeaderLayout} from "@/app/components/layout/HeaderLayout";
import EditorLayout from "@/app/components/layout/EditorLayout";

import {PrivateRoute, PublicRoute} from "@/app/components/common/RouteGuard";

import AboutUs from "@/app/pages/AboutUs";
import SignInPage from "@/app/pages/SignInPage";
import SignUpPage from "@/app/pages/SignUpPage";
import ForgotPasswordPage from "@/app/pages/ForgotPasswordPage";
import HomePage from "@/app/pages/HomePage";
import CreatePlotPage from "@/app/pages/CreatePlotPage";
import PlotMathLabEditorPage from "@/app/pages/PlotMathLabEditorPage";
import PlotJavascriptEditorPage from "@/app/pages/PlotJavascriptEditorPage";
import PlotMathEditorPage from "@/app/pages/PlotMathEditorPage";
import ProfilePage from "@/app/pages/ProfilePage";
import EditProfilePage from "@/app/pages/EditProfilePage";

interface RouteConfig {
	path: string;
	component: React.ComponentType<{plotId?: string}>;
	layout: React.ComponentType<{children: React.ReactNode}>;
	isPrivate?: boolean;
	isDynamic?: boolean;
}

const routes: RouteConfig[] = [
	{
		path: "/about-us",
		component: AboutUs,
		layout: FooterLayout,
	},
	{
		path: "/sign-in",
		component: SignInPage,
		layout: NothingLayout,
	},
	{
		path: "/sign-up",
		component: SignUpPage,
		layout: NothingLayout,
	},
	{
		path: "/forgot-password",
		component: ForgotPasswordPage,
		layout: NothingLayout,
	},
	{
		path: "/home",
		component: HomePage,
		layout: HeaderLayout,
		isPrivate: true,
	},
	{
		path: "/profile",
		component: ProfilePage,
		layout: HeaderLayout,
		isPrivate: true,
	},
	{
		path: "/profile/edit",
		component: EditProfilePage,
		layout: HeaderLayout,
		isPrivate: true,
	},
	{
		path: "/create-plot",
		component: CreatePlotPage,
		layout: HeaderLayout,
		isPrivate: true,
	},
	{
		path: "/plot/javascript/:id/edit",
		component: PlotJavascriptEditorPage,
		layout: EditorLayout,
		isPrivate: true,
		isDynamic: true,
	},
	{
		path: "/plot/matlab/:id/edit",
		component: PlotMathLabEditorPage,
		layout: EditorLayout,
		isPrivate: true,
		isDynamic: true,
	},
	{
		path: "/plot/math/:id/edit",
		component: PlotMathEditorPage,
		layout: EditorLayout,
		isPrivate: true,
		isDynamic: true,
	},
];

interface PageProps {
	params: Promise<{
		slug: string[];
	}>;
}

function matchRoute(
	path: string,
	pattern: string
): {matched: boolean; params: Record<string, string>} {
	const pathParts = path.split("/").filter(Boolean);
	const patternParts = pattern.split("/").filter(Boolean);

	if (pathParts.length !== patternParts.length) {
		return {matched: false, params: {}};
	}

	const params: Record<string, string> = {};

	for (let i = 0; i < patternParts.length; i++) {
		if (patternParts[i].startsWith(":")) {
			params[patternParts[i].slice(1)] = pathParts[i];
		} else if (patternParts[i] !== pathParts[i]) {
			return {matched: false, params: {}};
		}
	}

	return {matched: true, params};
}

export default async function DynamicPage({params}: PageProps) {
	const {slug} = await params;
	const path = "/" + slug.join("/");

	let matchedRoute: RouteConfig | undefined;
	let routeParams: Record<string, string> = {};

	for (const route of routes) {
		if (route.isDynamic) {
			const result = matchRoute(path, route.path);
			if (result.matched) {
				matchedRoute = route;
				routeParams = result.params;
				break;
			}
		} else if (route.path === path) {
			matchedRoute = route;
			break;
		}
	}

	if (!matchedRoute) {
		notFound();
	}

	const {component: Component, layout: Layout, isPrivate} = matchedRoute;
	const Guard = isPrivate ? PrivateRoute : PublicRoute;

	return (
		<Layout>
			<Guard>
				<Component plotId={routeParams.id} />
			</Guard>
		</Layout>
	);
}
