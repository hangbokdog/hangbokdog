import AddressBookPanel from "@/components/manager/center/AddressBookPanel";
import RequestPanel from "@/components/manager/center/RequestPanel";
import StatsPanel from "@/components/manager/center/StatsPanel";
import MembersPanel from "@/components/manager/center/MembersPanel";
import { IoStatsChart, IoLocation, IoPeople, IoPerson } from "react-icons/io5";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings } from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
type TabType = "stats" | "location" | "requests" | "members";

export default function CenterManagerMainPage() {
	const { selectedCenter } = useCenterStore();
	const [activeTab, setActiveTab] = useState<TabType>("stats");

	const tabs = [
		{
			id: "stats",
			label: "통계",
			icon: <IoStatsChart className="size-5" />,
		},
		{
			id: "location",
			label: "지역",
			icon: <IoLocation className="size-5" />,
		},
		{
			id: "requests",
			label: "가입 요청",
			icon: <IoPeople className="size-5" />,
		},
		{
			id: "members",
			label: "회원",
			icon: <IoPerson className="size-5" />,
		},
	];

	return (
		<div className="flex flex-col h-full bg-gray-50">
			<div className="bg-white shadow-sm pb-4 pl-4 pr-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="text-xl font-bold gap-2 text-gray-800 mb-1 flex items-center">
						<Settings className="w-5 h-5 text-purple-600" />
						센터 관리
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}을 관리하세요
					</p>
				</div>
			</div>
			{/* 모바일 탭 바 */}
			<div className="sticky top-0 px-1 py-1.5 z-10 bg-white shadow-sm">
				<div className="grid grid-cols-4 gap-1 mx-auto max-w-lg">
					{tabs.map((tab) => (
						<button
							type="button"
							key={tab.id}
							className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg ${
								activeTab === tab.id
									? "bg-main/10 text-main"
									: "text-gray-500 hover:bg-gray-100"
							}`}
							onClick={() => setActiveTab(tab.id as TabType)}
						>
							{tab.icon}
							<span className="text-xs mt-1 font-medium">
								{tab.label}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* 패널 컨텐츠 영역 */}
			<div className="flex-1 px-3 py-4 overflow-auto">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="flex flex-col gap-4 max-w-lg mx-auto"
					>
						{activeTab === "stats" && <StatsPanel />}
						{activeTab === "location" && <AddressBookPanel />}
						{activeTab === "requests" && <RequestPanel />}
						{activeTab === "members" && <MembersPanel />}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
