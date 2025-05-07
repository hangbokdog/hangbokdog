import { Navigate, useLocation } from "react-router-dom";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";

interface CenterMemberProtectedRouteProps {
	children: React.ReactNode;
}

export default function CenterMemberProtectedRoute({
	children,
}: CenterMemberProtectedRouteProps) {
	const { isCenterMember } = useCenterStore();
	const location = useLocation();

	if (!isCenterMember) {
		toast.error("해당 보호소의 회원이 아닙니다.");
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
