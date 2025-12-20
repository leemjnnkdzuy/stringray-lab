import {notFound} from "next/navigation";

// Layout
import FooterLayout from "@/app/components/layout/FooterLayout";
import NothingLayout from "@/app/components/layout/NothingLayout";

import {PrivateRoute, PublicRoute} from "@/app/components/auth/RouteGuard";

// Pages
import AboutUs from "@/app/pages/AboutUs";
import SignInPage from "@/app/pages/SignInPage";
import SignUpPage from "@/app/pages/SignUpPage";
import ForgotPasswordPage from "@/app/pages/ForgotPasswordPage";
import HomePage from "@/app/pages/HomePage";

interface RouteConfig {
	path: string;
	component: React.ComponentType;
	layout: React.ComponentType<{children: React.ReactNode}>;
	isPrivate?: boolean;
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
		layout: NothingLayout,
		isPrivate: true,
	},
];

interface PageProps {
	params: Promise<{
		slug: string[];
	}>;
}

export default async function DynamicPage({params}: PageProps) {
	const {slug} = await params;
	const path = "/" + slug.join("/");
	const route = routes.find((r) => r.path === path);

	if (!route) {
		notFound();
	}

	const {component: Component, layout: Layout, isPrivate} = route;
	const Guard = isPrivate ? PrivateRoute : PublicRoute;

	return (
		<Layout>
			<Guard>
				<Component />
			</Guard>
		</Layout>
	);
}
