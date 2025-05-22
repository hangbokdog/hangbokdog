import CreateVolunteerSchedule from "./CreateVolunteerSchedule";
import TodayVolunteerMembers from "./TodayVolunteerMembers";
import VolunteerRequests from "./VolunteerRequests";

export default function ShimTtleVolunteerPanel() {
	const volunteerMembers = {
		day: [],
		morning: [],
		night: [],
	};

	const volunteerSchedules: { startDate: Date; endDate: Date }[] = [
		{ startDate: new Date("2025-05-01"), endDate: new Date("2025-05-03") },
		{ startDate: new Date("2025-05-14"), endDate: new Date("2025-05-20") },
	];

	return (
		<div className="flex flex-col gap-5">
			<TodayVolunteerMembers label="쉼뜰" members={volunteerMembers} />
			<CreateVolunteerSchedule volunteerSchedules={volunteerSchedules} />
			<VolunteerRequests />
		</div>
	);
}
