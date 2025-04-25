import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
export default function MainLayout() {
	return (
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full min-w-[402px] bg-[#F6F7F9]">
				<Header />
				<Outlet />
			</div>
		</div>
	);
}
