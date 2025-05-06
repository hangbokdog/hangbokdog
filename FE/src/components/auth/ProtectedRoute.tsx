import { type ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/lib/store/authStore";
import { toast } from "sonner";

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { accessToken } = useAuthStore();
	const location = useLocation();

	useEffect(() => {
		if (!accessToken) {
			toast.error("로그인이 필요한 페이지입니다.");
		}
	}, [accessToken]);

	if (!accessToken) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
