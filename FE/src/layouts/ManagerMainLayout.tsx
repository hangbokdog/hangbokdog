import Header from "@/components/common/Header";
import ManagerFooter from "@/components/common/ManagerFooter";
import { Outlet } from "react-router-dom";

export default function ManagerMainLayout() {
	return (
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full min-w-[402px] bg-background shadow-custom-xs">
				<Header />
				<main className="flex-1 overflow-y-auto mb-14 px-2.5 pt-2.5 scrollbar-hidden">
					<Outlet />
				</main>
			</div>
			<ManagerFooter />
		</div>
	);
}
