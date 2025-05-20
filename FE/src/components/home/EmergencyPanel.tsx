import { ChevronRight } from "lucide-react";
import ManagerEmergencyPanel from "../manager/main/ManagerEmergencyPanel";
import useCenterStore from "@/lib/store/centerStore";
import { useNavigate } from "react-router-dom";

export default function EmergencyPanel() {
	const centerId = useCenterStore((state) =>
		Number(state.selectedCenter?.centerId),
	);
	// 선택된 센터가 없을 때는 렌더링하지 않거나 안내 메시지
	if (!centerId) {
		return <div>센터 정보를 불러오는 중입니다...</div>;
	}

	const navigate = useNavigate();

	const handleViewAllClick = () => {
		navigate("/emergency");
	};

	return (
		<div className="flex flex-col mx-2.5 pb-4">
			<div className="flex justify-between items-center mb-2">
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						<div className="bg-red h-5 w-1 rounded-full mr-2" />
						<h3 className="text-lg font-bold">긴급 요청</h3>
					</div>
				</div>
				<button
					type="button"
					onClick={handleViewAllClick}
					className="flex items-center text-sm text-blue-600 font-medium"
				>
					더보기
					<ChevronRight className="w-4 h-4 ml-0.5" />
				</button>
			</div>
			<ManagerEmergencyPanel centerId={centerId} isHome />
		</div>
	);
}
