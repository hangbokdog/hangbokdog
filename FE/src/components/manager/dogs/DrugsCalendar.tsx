import { useState } from "react";
import { CalendarIcon, Check } from "lucide-react";

export default function StatusSection() {
	const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
		이버멕틴: false,
		구충: false,
	});

	const toggleCheck = (itemName: string) => {
		setCheckedItems((prev) => ({
			...prev,
			[itemName]: !prev[itemName],
		}));
	};

	return (
		<div className="p-6 mt-8 bg-white rounded-2xl">
			<div className="flex items-center mb-4">
				<span className="text-lg text-grayText font-bold">
					2025.05.08
				</span>
				<CalendarIcon className="ml-2 text-grayText w-5 h-5" />
			</div>

			<div className="flex flex-col gap-4">
				{Object.keys(checkedItems).map((itemName) => {
					const checked = checkedItems[itemName];
					return (
						<div key={itemName} className="flex items-center">
							<div className="px-6 py-2 bg-[#f6f7f9] rounded-full">
								<span className="text-[#4e5968]">
									{itemName}
								</span>
							</div>
							<button
								type="button"
								onClick={() => toggleCheck(itemName)}
								className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 ${
									checked
										? "bg-[#68c2f3]"
										: "border-2 border-grayText"
								}`}
							>
								<Check
									className={`w-5 h-5 ${checked ? "text-white" : "text-grayText"}`}
								/>
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
