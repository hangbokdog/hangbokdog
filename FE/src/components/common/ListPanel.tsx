import { useState } from "react";

interface ListPanelProps {
	tabs: {
		key: string;
		label: string;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data: any[];
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		component: React.ComponentType<any>;
	}[];
	isHome?: boolean;
}

export default function ListPanel({ tabs, isHome = true }: ListPanelProps) {
	const [activeTabKey, setActiveTabKey] = useState(tabs[0].key);
	const activeIndex = tabs.findIndex((tab) => tab.key === activeTabKey);
	const activeTab = tabs.find((tab) => tab.key === activeTabKey);

	return (
		<div className="flex flex-col">
			<div
				className={`flex flex-1 flex-col items-center ${
					isHome
						? "rounded-xl bg-white shadow-custom-sm border border-gray-100 min-h-[280px]"
						: ""
				}`}
			>
				<div className="relative flex w-full px-4 pt-4 pb-2">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							className={`flex-1 py-2 text-center text-sm font-medium relative z-10 transition-all duration-200 ${
								activeTabKey === tab.key
									? "text-red-600"
									: "text-gray-400 hover:text-gray-600"
							}`}
							onClick={() => setActiveTabKey(tab.key)}
						>
							{tab.label}
							{activeTabKey === tab.key && (
								<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-full" />
							)}
						</button>
					))}
				</div>

				<div className="flex flex-col w-full">
					<div className={isHome ? "divide-y divide-gray-100" : ""}>
						{activeTab?.data.map((item, index) => {
							const Component = activeTab.component;
							return (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									className="active:bg-gray-50/50 transition-colors"
								>
									<Component {...item} />
								</div>
							);
						})}
					</div>
					{activeTab?.data.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 text-gray-400">
							<p className="text-sm">데이터가 없습니다</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
