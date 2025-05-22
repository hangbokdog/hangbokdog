import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface TodayVolunteerSectionProps {
	label: string; // "종일", "오전", "오후"
	colorKey: "morning" | "night";
	allDayMembers?: string[];
	maxMemberCount?: number;
	members: string[];
	addedMembers?: string[];
}

const styleMap: Record<TodayVolunteerSectionProps["colorKey"], string> = {
	morning: "border-morning bg-gradient-to-r from-[var(--color-morning)]/20",
	night: "border-night bg-gradient-to-r from-[var(--color-night)]/20",
};

export default function VolunteerMemberSection({
	label,
	colorKey,
	allDayMembers = [],
	maxMemberCount,
	members,
	addedMembers,
}: TodayVolunteerSectionProps) {
	const [isOpen, setIsOpen] = useState(false);
	const memberCount =
		allDayMembers.length + members.length + (addedMembers?.length || 0);

	return (
		<div className="flex flex-col">
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={`flex w-fit items-center gap-1 text-sm font-bold text-blueGray border-l-2 px-2 ${styleMap[colorKey]}`}
			>
				{label} {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
				{maxMemberCount && (
					<span
						className={`text-sm font-semibold ${
							memberCount > maxMemberCount
								? "text-red-500"
								: "text-grayText"
						}`}
					>
						{memberCount} / {maxMemberCount}명
					</span>
				)}
			</button>

			<div
				className={`flex flex-col mt-2 overflow-hidden transition-all duration-150 ${
					isOpen ? "max-h-[500px]" : "max-h-0"
				}`}
			>
				{memberCount > 0 ? (
					<>
						{allDayMembers.map((name, index) => (
							<div
								key={`${name}-allDay-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									index
								}`}
								className={`flex gap-4 items-center px-4 py-2 rounded-full text-sm font-semibold text-grayText ${
									index % 2 === 0 ? "bg-background" : ""
								}`}
							>
								{name}
								<span className="text-day">종일</span>
							</div>
						))}
						{members.map((name, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={`${name}-member-${index}`}
								className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold text-grayText ${
									(index + allDayMembers.length) % 2 === 0
										? "bg-background"
										: ""
								}`}
							>
								{name}
							</div>
						))}
						{addedMembers?.map((name, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={`${name}-member-${index}`}
								className={
									"bg-blue-50 flex items-center px-4 py-2 rounded-full text-sm font-semibold text-grayText"
								}
							>
								{name}
							</div>
						))}
					</>
				) : (
					<div className="text-sm text-gray-400 p-2">인원 없음</div>
				)}
			</div>
		</div>
	);
}
