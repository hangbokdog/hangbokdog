import ManagerEmergencyPanel from "@/components/manager/main/ManagerEmergencyPanel";
import ManagerManagePanel from "@/components/manager/main/ManagerManagePanel";
import ManagerRequestsPanel from "@/components/manager/main/ManagerRequestsPanel";
import useCenterStore from "@/lib/store/centerStore";

export default function ManagerMainPage() {
	const selectedCenter = useCenterStore((state) => state.selectedCenter);

	if (!selectedCenter) {
		return <div>센터 정보를 불러오는 중입니다...</div>;
	}

	const centerId = Number(selectedCenter.centerId);

	return (
		<div className="flex flex-col gap-3 mx-2.5">
			<ManagerEmergencyPanel centerId={centerId} />
			<ManagerRequestsPanel />
			<ManagerManagePanel />
		</div>
	);
}
