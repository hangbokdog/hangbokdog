import AddressBookPanel from "@/components/manager/center/AddressBookPanel";
import RequestPanel from "@/components/manager/center/RequestPanel";
import StatsPanel from "@/components/manager/center/StatsPanel";
import { IoStatsChart, IoLocation, IoPeople } from "react-icons/io5";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TabType = "stats" | "location" | "requests" | "notices";

export default function CenterManagerMainPage() {
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
	];

	return (
		<div className="flex flex-col h-full bg-gray-50">
			{/* 모바일 탭 바 */}
			<div className="sticky top-0 px-1 py-1.5 z-10 bg-white shadow-sm">
				<div className="grid grid-cols-3 gap-1 mx-auto max-w-lg">
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
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
