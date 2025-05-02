import { MdAddCircle } from "react-icons/md";

interface CreateVolunteerScheduleProps {
	volunteerSchedules: {
		startDate: Date;
		endDate: Date;
	}[];
}

export default function CreateVolunteerSchedule(
	props: CreateVolunteerScheduleProps,
) {
	const { volunteerSchedules } = props;

	const formatDate = (date: Date) =>
		`${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

	return (
		<div className="flex flex-col gap-3 text-grayText">
			<div className="flex gap-2 text-base font-bold">
				{"봉사 일정 생성"}
			</div>
			<div>
				{volunteerSchedules.map((v, idx) => (
					<div
						className={`flex justify-between px-4 py-2 rounded-full text-sm font-semibold ${
							idx % 2 === 0 ? "bg-background" : ""
						}`}
						key={`${v.startDate.toISOString()}-${idx}`}
					>
						<div className="flex gap-2">
							{`${formatDate(v.startDate)} - ${formatDate(v.endDate)}`}
						</div>
						<div className="text-lightGray font-light text-xs flex items-center hover:text-blueGray">
							상세보기
						</div>
					</div>
				))}
				<div
					className={`flex text-blueGray justify-center px-4 py-2 rounded-full text-sm font-semibold ${
						volunteerSchedules.length % 2 === 0
							? "bg-background"
							: ""
					}`}
				>
					<MdAddCircle size="16" />
				</div>
			</div>
		</div>
	);
}
