import { useNavigate } from "react-router-dom";
import ManagerEmergencyPanel from "../main/ManagerEmergencyPanel";
import useCenterStore from "@/lib/store/centerStore";

export default function EmergencyPanel() {
	const navigate = useNavigate();
	const centerId = useCenterStore((state) =>
		Number(state.selectedCenter?.centerId),
	);
	// 선택된 센터가 없을 때는 렌더링하지 않거나 안내 메시지
	if (!centerId) {
		return <div>센터 정보를 불러오는 중입니다...</div>;
	}
	return (
		<div className="bg-white p-2.5 rounded-xl shadow-custom-xs mx-2.5 mt-4">
			<div className="flex justify-between items-center py-2">
				<div className="font-bold text-grayText text-lg mx-2.5 my-1">
					응급 목록
				</div>
				<div>
					<button
						type="button"
						className="px-3 py-1 bg-male text-white rounded-full"
						onClick={() => navigate("/manager/emergency/register")}
					>
						응급 추가
					</button>
				</div>
			</div>
			<div className="flex p-2.5 flex-col space-y-8 text-grayText">
				{/* <MovingList />
				<VolunteerList />
				<DonationList /> */}
				<ManagerEmergencyPanel centerId={centerId} />
			</div>
		</div>
	);
}
