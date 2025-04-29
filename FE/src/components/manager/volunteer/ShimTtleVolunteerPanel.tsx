import CreateVolunteerSchedule from "./CreateVolunteerSchedule";
import TodayVolunteerMembers from "./TodayVolunteerMembers";
import VolunteerRequests from "./VolunteerRequests";

export default function ShimTtleVolunteerPanel() {
	const volunteerMembers = {
		day: [],
		morning: [],
		night: [],
	};

	const volunteerSchedules: { startDate: string; endDate: string }[] = [
		{ startDate: "05.01", endDate: "05.03" },
	];

	return (
		<div className="flex flex-col gap-5">
			<TodayVolunteerMembers label="쉼뜰" members={volunteerMembers} />
			<CreateVolunteerSchedule volunteerSchedules={volunteerSchedules} />
			<VolunteerRequests />
		</div>
	);
}
