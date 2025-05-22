import { Navigate, useLocation } from "react-router-dom";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";

interface CenterProtectedRouteProps {
	children: React.ReactNode;
}

export default function CenterProtectedRoute({
	children,
}: CenterProtectedRouteProps) {
	const { selectedCenter } = useCenterStore();
	const location = useLocation();

	if (!selectedCenter?.centerId) {
		toast.error("보호소를 선택해주세요.");
		return (
			<Navigate
				to="/center-decision"
				state={{ from: location }}
				replace
			/>
		);
	}

	return <>{children}</>;
}
