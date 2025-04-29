import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface TodayVolunteerSectionProps {
	label: string; // "종일", "오전", "오후"
	colorKey: "day" | "morning" | "night";
	members: string[];
}

export default function TodayVolunteerSection({
	label,
	colorKey,
	members,
}: TodayVolunteerSectionProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col">
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={`flex w-fit items-center gap-1 text-sm font-bold text-blueGray border-l-2 border-${colorKey} px-2 bg-gradient-to-r from-[var(--color-${colorKey})]/20 to-[var(--color-${colorKey})]/${
					colorKey === "night" ? "0" : "1"
				}`}
			>
				{label} {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
			</button>

			<div
				className={`flex flex-col mt-2 overflow-hidden transition-all duration-150 ${
					isOpen ? "max-h-[500px]" : "max-h-0"
				}`}
			>
				{members.length > 0 ? (
					members.map((name, idx) => (
						<div
							key={name + idx.toString()}
							className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold text-grayText ${
								idx % 2 === 0 ? "bg-background" : ""
							}`}
						>
							{name}
						</div>
					))
				) : (
					<div className="text-sm text-gray-400 p-2">인원 없음</div>
				)}
			</div>
		</div>
	);
}
