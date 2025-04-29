import CreateVolunteerSchedule from "./CreateVolunteerSchedule";
import TodayVolunteerMembers from "./TodayVolunteerMembers";
import VolunteerRequests from "./VolunteerRequests";

export default function YipTangTtleVolunteerPanel() {
	const volunteerMembers = {
		day: ["홍길동 님"],
		morning: ["홍길금 님", "홍길은 님"],
		night: [],
	};

	const volunteerSchedules: { startDate: string; endDate: string }[] = [];

	return (
		<div className="flex flex-col gap-5">
			<TodayVolunteerMembers label="입양뜰" members={volunteerMembers} />
			<CreateVolunteerSchedule volunteerSchedules={volunteerSchedules} />
			<VolunteerRequests />
		</div>
	);
}
