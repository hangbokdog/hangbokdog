import { useMatches } from "react-router-dom";
import Header from "@/components/common/Header";
import RouteBackHeader from "@/components/common/RouteBackHeader";
import ManagerFooter from "@/components/common/ManagerFooter";
import { Outlet } from "react-router-dom";

export default function ManagerMainLayout() {
	const matches = useMatches();

	const showHeader = matches.reduce((acc, match) => {
		const current = (match.handle as { showHeader?: boolean })?.showHeader;
		return current !== undefined ? current : acc;
	}, true);

	return (
		<>
			{showHeader ? <Header /> : <RouteBackHeader />}
			<main
				className={`flex-1 overflow-y-auto ${showHeader && "pt-2.5 mb-14"} scrollbar-hidden`}
			>
				<Outlet />
			</main>
			{showHeader && <ManagerFooter />}
		</>
	);
}
