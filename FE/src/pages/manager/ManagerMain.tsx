import ManagerEmergencyPanel from "@/components/manager/main/ManagerEmergencyPanel";
import ManagerManagePanel from "@/components/manager/main/ManagerManagePanel";
import ManagerRequestsPanel from "@/components/manager/main/ManagerRequestsPanel";

export default function ManagerMain() {
	return (
		<div className="flex flex-col gap-3 mx-2.5">
			<ManagerEmergencyPanel />
			<ManagerRequestsPanel />
			<ManagerManagePanel />
		</div>
	);
}
