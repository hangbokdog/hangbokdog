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
			<main className={showHeader ? "pb-16" : ""}>
				<Outlet />
			</main>
			{showHeader && <Footer />}
		</>
	);
}
