import CreateVolunteerSchedule from "./CreateVolunteerSchedule";
import TodayVolunteerMembers from "./TodayVolunteerMembers";
import VolunteerRequests from "./VolunteerRequests";

export default function YipTangTtleVolunteerPanel() {
	const volunteerMembers = {
		day: ["홍길동 님"],
		morning: ["홍길금 님", "홍길은 님"],
		night: [],
	};

	const volunteerSchedules: { startDate: Date; endDate: Date }[] = [
		{ startDate: new Date("2025-05-01"), endDate: new Date("2025-05-03") },
		{ startDate: new Date("2025-05-14"), endDate: new Date("2025-05-20") },
	];

	return (
		<div className="flex flex-col gap-5">
			<TodayVolunteerMembers label="입양뜰" members={volunteerMembers} />
			<CreateVolunteerSchedule volunteerSchedules={volunteerSchedules} />
			<VolunteerRequests />
		</div>
	);
}
