import { Outlet } from "react-router-dom";
export default function MainLayout() {
	return (
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full min-w-[402px] bg-[#F6F7F9]">
				<Outlet />
			</div>
		</div>
	);
}
