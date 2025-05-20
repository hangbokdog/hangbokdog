import ManagerEmergencyPanel from "@/components/manager/main/ManagerEmergencyPanel";
import useCenterStore from "@/lib/store/centerStore";

export default function AllEmergencyPage() {
	const { selectedCenter } = useCenterStore();

	return (
		<div className="flex flex-col min-h-[calc(100vh-3rem)] max-h-[calc(100vh-3rem)] overflow-hidden">
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="px-1 pt-2 text-xl font-bold text-gray-800 flex justify-between items-center">
						긴급 요청
					</div>
				</div>
			</div>
			<div className="flex-1 p-4 max-w-lg mx-auto w-full overflow-y-auto">
				<ManagerEmergencyPanel
					centerId={Number(selectedCenter?.centerId)}
					isHome={false}
				/>
			</div>
		</div>
	);
}
