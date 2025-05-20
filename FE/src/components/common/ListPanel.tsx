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
		<div className="flex flex-col mx-2.5">
			<div
				className={`flex flex-1 flex-col items-center p-3 gap-3 ${
					isHome
						? "rounded-xl bg-white shadow-[0_0_10px_0_rgba(50,100,200,0.1)] border border-gray-100"
						: ""
				}`}
			>
				<div className="relative flex w-full justify-around mb-3">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							className={`flex-1 py-2.5 text-center font-bold rounded-full z-10 ${
								activeTabKey === tab.key
									? "text-male"
									: "text-gray-400"
							} transition-colors duration-200`}
							onClick={() => setActiveTabKey(tab.key)}
						>
							{tab.label}
						</button>
					))}

					<div
						className="absolute bottom-0 h-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-full transition-all duration-300 shadow-sm"
						style={{
							width: `${100 / tabs.length}%`,
							left: `${(activeIndex * 100) / tabs.length}%`,
						}}
					/>
				</div>

				<div className="flex flex-col w-full gap-2">
					{activeTab?.data.map((item, index) => {
						const Component = activeTab.component;
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						return <Component key={index} {...item} />;
					})}
				</div>
			</div>
		</div>
	);
}
