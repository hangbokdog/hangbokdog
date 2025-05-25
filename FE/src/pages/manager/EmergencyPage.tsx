import EmergencyList from "@/components/common/emergency/EmergencyList";
import EmergencyApplicationList from "@/components/common/emergency/EmergencyApplicationList";
import useCenterStore from "@/lib/store/centerStore";
import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import RecruiteEmergencyList from "@/components/common/emergency/RecruiteEmergencyList";
import { useQueryClient } from "@tanstack/react-query";

export default function EmergencyPage() {
	const { selectedCenter } = useCenterStore();
	const [tab, setTab] = useState<"list" | "applications">("list");
	const [applicationCount, setApplicationCount] = useState(0);
	const queryClient = useQueryClient();

	const handleTabChange = (newTab: "list" | "applications") => {
		setTab(newTab);
		if (newTab === "applications") {
			queryClient.invalidateQueries({
				queryKey: ["recruited-emergency-posts"],
			});
		}
	};

	return (
		<div className="flex flex-col h-full bg-gray-50 pb-16">
			{/* 헤더 */}
			<div className="bg-white shadow-sm pb-4 pl-4 pr-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="flex items-center justify-between">
						<div className="gap-2 text-xl font-bold text-gray-800 mb-1 flex items-center">
							<AlertTriangle className="w-5 h-5 text-red-600" />
							긴급 관리
						</div>
						<Link
							to="/manager/emergency/register"
							className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
						>
							<Plus className="w-4 h-4" />
							긴급 생성
						</Link>
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 긴급 목록을
						관리하세요
					</p>
				</div>
			</div>

			<div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
				{/* 탭 */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="flex border-b">
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center relative ${
								tab === "list"
									? "text-red-600 border-b-2 border-red-600"
									: "text-gray-500"
							}`}
							onClick={() => handleTabChange("list")}
						>
							모집 중
						</button>
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center relative ${
								tab === "applications"
									? "text-red-600 border-b-2 border-red-600"
									: "text-gray-500"
							}`}
							onClick={() => handleTabChange("applications")}
						>
							모집 완료
							{applicationCount > 0 && (
								<span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
									{applicationCount}
								</span>
							)}
						</button>
					</div>
				</div>

				{/* 긴급 목록 탭 */}
				{tab === "list" && (
					<div className="flex flex-col gap-2">
						<EmergencyList />
					</div>
				)}

				{/* 신청 대기 탭 */}
				{tab === "applications" && (
					<div className="flex flex-col gap-2">
						<RecruiteEmergencyList />
					</div>
				)}
			</div>
		</div>
	);
}
