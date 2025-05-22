import { useState } from "react";

interface TabPanelProps {
	tabs: {
		key: string;
		label: string;
		component: React.ComponentType;
	}[];
}

export default function TabPanel({ tabs }: TabPanelProps) {
	const [activeTabKey, setActiveTabKey] = useState(tabs[0].key);
	const activeIndex = tabs.findIndex((tab) => tab.key === activeTabKey);
	const activeTab = tabs.find((tab) => tab.key === activeTabKey);

	return (
		<div className="flex flex-col">
			<div className="flex flex-1 flex-col items-center p-2 gap-3 rounded-lg bg-white shadow-custom-sm">
				<div className="relative flex w-full justify-start border-b border-gray-200">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							className={`flex-1 py-2 text-center font-bold transition-colors ${
								activeTabKey === tab.key
									? "text-black"
									: "text-gray-400"
							}`}
							onClick={() => setActiveTabKey(tab.key)}
						>
							{tab.label}
						</button>
					))}

					<div
						className="absolute bottom-0 h-[3px] bg-black transition-all duration-300"
						style={{
							width: `${100 / tabs.length}%`,
							left: `${(activeIndex * 100) / tabs.length}%`,
						}}
					/>
				</div>

				<div className="flex flex-col w-full gap-2">
					{activeTab && <activeTab.component />}
				</div>
			</div>
		</div>
	);
}
