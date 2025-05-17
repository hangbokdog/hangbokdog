import ScrollToTop from "@/components/common/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
	return (
		<div className="w-screen min-h-screen-safe h-auto flex justify-center">
			<ScrollToTop />
			<div className="flex flex-col w-full max-w-[440px] bg-background shadow-custom-xs">
				<Outlet />
			</div>
			<Toaster richColors={true} />
		</div>
	);
}
