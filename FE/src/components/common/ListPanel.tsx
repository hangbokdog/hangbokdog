import { useState } from "react";
import { Link } from "react-router-dom";

interface ListPanelProps {
	link: string;
	tabs: {
		key: string;
		label: string;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data: any[];
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		component: React.ComponentType<any>;
	}[];
}

export default function ListPanel({ link, tabs }: ListPanelProps) {
	const [activeTabKey, setActiveTabKey] = useState(tabs[0].key);
	const activeIndex = tabs.findIndex((tab) => tab.key === activeTabKey);
	const activeTab = tabs.find((tab) => tab.key === activeTabKey);

	return (
		<div className="flex flex-col">
			<div className="flex flex-1 flex-col items-center p-2 gap-3 rounded-lg bg-white">
				<div className="relative flex w-full justify-around mb-2">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							className={`flex-1 py-2 text-center font-bold rounded-full z-10 ${
								activeTabKey === tab.key
									? "text-black"
									: "text-grayText"
							}`}
							onClick={() => setActiveTabKey(tab.key)}
						>
							{tab.label}
						</button>
					))}

					<div
						className="absolute bottom-0 h-full bg-background rounded-full transition-all duration-300"
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

				<Link to={link}>
					<span className="text-grayText font-bold text-sm">
						더보기
					</span>
				</Link>
			</div>
		</div>
	);
}
