import { useDayColor } from "@/lib/hooks/useDayColor";

interface OngoingVolunteerDateBoxProps {
	startMonth: number;
	startDay: number;
	endMonth: number;
	endDay: number;
}

export default function OngoingVolunteerDateBox({
	startMonth,
	startDay,
	endMonth,
	endDay,
}: OngoingVolunteerDateBoxProps) {
	const startDayColor = useDayColor(startMonth, startDay);
	const endDayColor = useDayColor(endMonth, endDay);

	return (
		<div className="p-3 flex flex-col items-center justify-between border-r border-superLightGray">
			<span className="text-xs font-medium text-lightGray">
				{startMonth} /{" "}
				<span className={`font-bold text-base ${startDayColor}`}>
					{startDay}
				</span>
			</span>
			<span className="text-xs font-medium">~</span>
			<span className="text-xs font-medium text-lightGray">
				{endMonth} /{" "}
				<span className={`font-bold text-base ${endDayColor}`}>
					{endDay}
				</span>
			</span>
		</div>
	);
}
