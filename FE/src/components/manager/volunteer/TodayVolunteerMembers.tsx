import VolunteerMemberSection from "./VolunteerMemberSection";

interface TodayVolunteerMemberProps {
	label: string;
	members: {
		day: string[];
		morning: string[];
		night: string[];
	};
}

export default function TodayVolunteerMembers({
	label,
	members,
}: TodayVolunteerMemberProps) {
	const today = new Date();
	const formattedDate = `${String(today.getMonth() + 1).padStart(2, "0")}.${String(
		today.getDate(),
	).padStart(2, "0")}`;

	return (
		<div className="flex flex-col gap-3 text-grayText">
			<div className="flex gap-2 text-base font-bold">
				{"금일"}
				<span className="flex font-semibold text-lightGra gap-0.5">
					{"("}
					<span className="flex items-center">{label}</span>
					<span className="text-blueGray">{formattedDate}</span>
					{")"}
				</span>{" "}
				{"봉사 인원"}
			</div>
			<VolunteerMemberSection
				label="오전"
				colorKey="morning"
				allDayMembers={members.day}
				members={members.morning}
			/>
			<VolunteerMemberSection
				label="오후"
				colorKey="night"
				allDayMembers={members.day}
				members={members.night}
			/>
		</div>
	);
}
