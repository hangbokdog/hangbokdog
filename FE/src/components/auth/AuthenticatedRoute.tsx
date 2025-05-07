import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/lib/store/authStore";

interface AuthenticatedRouteProps {
	children: ReactNode;
}

export default function AuthenticatedRoute({
	children,
}: AuthenticatedRouteProps) {
	const { accessToken } = useAuthStore();
	const location = useLocation();

	const from = location.state?.from?.pathname || "/center-decision";

	if (accessToken) {
		return <Navigate to={from} replace />;
	}

	return <>{children}</>;
}
