import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
	return (
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full w-full max-w-[440px] overflow-y-auto scrollbar-hidden bg-background shadow-custom-xs">
				<Outlet />
			</div>
			<Toaster richColors={true} />
		</div>
	);
}
