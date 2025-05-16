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

	return (
		<>
			{showHeader ? <Header /> : <RouteBackHeader />}
			<main
				className={`flex-1 overflow-y-auto ${showHeader && "mb-16"} scrollbar-hidden`}
			>
				<Outlet />
			</main>
			{showHeader && <Footer />}
		</>
	);
}
