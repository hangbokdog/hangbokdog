import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import RouteBackHeader from "@/components/common/RouteBackHeader";
import { Outlet, useMatches } from "react-router-dom";

export default function CenterLayout() {
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
		<>
			{showHeader ? (
				<Header />
			) : (
				<RouteBackHeader {...getRouteBackHeaderProps()} />
			)}
			<main className="flex-1 overflow-y-auto pt-2.5 mb-14 scrollbar-hidden">
				<Outlet />
			</main>
			{showHeader && <Footer />}
		</>
	);
}
