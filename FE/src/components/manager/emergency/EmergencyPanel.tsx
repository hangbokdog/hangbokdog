import { useNavigate } from "react-router-dom";
import ManagerEmergencyPanel from "../main/ManagerEmergencyPanel";
import useCenterStore from "@/lib/store/centerStore";
import { FaExclamationCircle } from "react-icons/fa";
import { MdEmergency } from "react-icons/md"; // 사이렌 아이콘

export default function EmergencyPanel() {
	const navigate = useNavigate();
	const centerId = useCenterStore((state) =>
		Number(state.selectedCenter?.centerId),
	);

	if (!centerId) {
		return <div>센터 정보를 불러오는 중입니다...</div>;
	}

	return (
		<div className="bg-white p-2.5 rounded-xl shadow-custom-xs mx-2.5 mt-4">
			<div className="flex justify-between items-center py-2">
				<div className="flex items-center gap-1 font-bold text-grayText text-lg mx-2.5 my-1">
					<MdEmergency className="text-red-500 w-5 h-5" />
					응급 요청 목록
				</div>
				<div>
					<button
						type="button"
						className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-150"
						onClick={() => navigate("/manager/emergency/register")}
					>
						응급 추가
						<FaExclamationCircle className="text-xs" />
					</button>
				</div>
			</div>
			<div className="flex p-2.5 flex-col space-y-8 text-grayText">
				<ManagerEmergencyPanel centerId={centerId} />
			</div>
		</div>
	);
}
