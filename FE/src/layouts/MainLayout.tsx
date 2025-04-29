import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
	return (
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full min-w-[402px] bg-background shadow-custom-xs">
				<Header />
				<main className="flex-1 overflow-y-auto mb-14 pt-2.5 scrollbar-hidden">
					<Outlet />
				</main>
			</div>
			<Footer />
		</div>
	);
}
