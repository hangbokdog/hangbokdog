import EmergencyPanel from "@/components/manager/emergency/EmergencyPanel";
import useCenterStore from "@/lib/store/centerStore";
import { AlertTriangle } from "lucide-react";

export default function EmergencyPage() {
	const { selectedCenter } = useCenterStore();

	return (
		<div className="flex flex-col h-full bg-gray-50 pb-16">
			<div className="bg-white shadow-sm pb-4 pl-4 pr-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="gap-2 text-xl font-bold text-gray-800 mb-1 flex items-center">
						<AlertTriangle className="w-5 h-5 text-red-600" />
						긴급 관리
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 긴급 목록을
						관리하세요
					</p>
				</div>
			</div>
			<EmergencyPanel />
		</div>
	);
}
