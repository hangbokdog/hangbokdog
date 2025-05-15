import siren from "@/assets/images/siren.png";
import ManagerEmergencyPanel from "../manager/main/ManagerEmergencyPanel";
import useCenterStore from "@/lib/store/centerStore";

export default function EmergencyPanel() {
	const centerId = useCenterStore((state) =>
		Number(state.selectedCenter?.centerId),
	);
	// 선택된 센터가 없을 때는 렌더링하지 않거나 안내 메시지
	if (!centerId) {
		return <div>센터 정보를 불러오는 중입니다...</div>;
	}

	return (
		<div className="flex flex-col mx-2.5">
			<div className="flex items-center">
				<img className="size-10" src={siren} alt="siren" />
				<span className="relative text-lg font-semibold text-grayText ml-2">
					긴급요청
					<span className="absolute top-[-12px] right-[-17px] size-5 text-center rounded-full bg-red text-white shadow-custom-sm text-sm font-bold">
						6
					</span>
				</span>
			</div>
			<ManagerEmergencyPanel centerId={centerId} />
		</div>
	);
}
