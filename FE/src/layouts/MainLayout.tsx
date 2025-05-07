import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
	return (
		<div className="w-screen h-screen flex justify-center">
			<div className="flex flex-col h-full w-full max-w-[440px] bg-background shadow-custom-xs">
				<main className="flex-1 overflow-y-auto mb-14 pt-2.5 scrollbar-hidden">
					<Outlet />
				</main>
			</div>
			<Toaster />
		</div>
	);
}
