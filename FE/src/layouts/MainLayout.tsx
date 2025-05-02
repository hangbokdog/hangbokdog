import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import RouteBackHeader from "@/components/common/RouteBackHeader";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useMatches } from "react-router-dom";

export default function MainLayout() {
	const matches = useMatches();

	const showHeader = matches.reduce((acc, match) => {
		const current = (match.handle as { showHeader?: boolean })?.showHeader;
		return current !== undefined ? current : acc;
	}, true);

	const getRouteBackHeaderProps = () => {
		const currentPath = matches[matches.length - 1].pathname;

		if (
			currentPath.includes("/dogs/") &&
			currentPath.includes("/comments")
		) {
			return {
				title: "댓글",
				sub: "2개",
				bgColor: "bg-white",
			};
		}

		return {
			title: "",
			sub: "",
			bgColor: "",
		};
	};

	return (
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full w-full max-w-[440px] bg-background shadow-custom-xs">
				{showHeader ? (
					<Header />
				) : (
					<RouteBackHeader {...getRouteBackHeaderProps()} />
				)}
				<main className="flex-1 overflow-y-auto mb-14 pt-2.5 scrollbar-hidden">
					<Outlet />
				</main>
			</div>
			{showHeader && <Footer />}
			<Toaster />
		</div>
	);
}
