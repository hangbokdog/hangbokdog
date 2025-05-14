import ManagerEmergencyPanel from "@/components/manager/main/ManagerEmergencyPanel";
import ManagerManagePanel from "@/components/manager/main/ManagerManagePanel";
import ManagerRequestsPanel from "@/components/manager/main/ManagerRequestsPanel";
import useCenterStore from "@/lib/store/centerStore";

export default function ManagerMainPage() {
	const centerId = useCenterStore((state) =>
		Number(state.selectedCenter?.centerId),
	);
	// 선택된 센터가 없을 때는 렌더링하지 않거나 안내 메시지
	if (!centerId) {
		return <div>센터 정보를 불러오는 중입니다...</div>;
	}

	return (
		<div className="flex flex-col gap-3 mx-2.5">
			<ManagerEmergencyPanel centerId={centerId} />
			<ManagerRequestsPanel />
			<ManagerManagePanel />
		</div>
	);
}
