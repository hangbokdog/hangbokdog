import { Navigate, useLocation } from "react-router-dom";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";

interface CenterManagerProtectedRouteProps {
	children: React.ReactNode;
}

export default function CenterManagerProtectedRoute({
	children,
}: CenterManagerProtectedRouteProps) {
	const isCenterManager =
		useCenterStore().selectedCenter?.status === "MANAGER";
	const location = useLocation();

	if (!isCenterManager) {
		toast.error("해당 보호소의 관리자가 아닙니다.");
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
