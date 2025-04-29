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
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full min-w-[402px] bg-background shadow-custom-xs">
				{showHeader ? <Header /> : <RouteBackHeader />}
				<main className="flex-1 overflow-y-auto mb-14 px-2.5 pt-2.5 scrollbar-hidden">
					<Outlet />
				</main>
			</div>
			{showHeader && <ManagerFooter />}
		</div>
	);
}
