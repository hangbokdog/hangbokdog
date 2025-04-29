import CreateVolunteerSchedule from "./CreateVolunteerSchedule";
import TodayVolunteerMembers from "./TodayVolunteerMembers";
import VolunteerRequests from "./VolunteerRequests";

export default function ShimTuhVolunteerPanel() {
	const volunteerMembers = {
		day: ["홍길동 님", "최준혁 님"],
		morning: ["홍길금 님", "홍길은 님"],
		night: ["이재백 님", "김민지 님"],
	};

	const volunteerSchedules: { startDate: string; endDate: string }[] = [
		{ startDate: "05.01", endDate: "05.03" },
		{ startDate: "05.07", endDate: "05.09" },
	];

	return (
		<div className="flex flex-col gap-5">
			<TodayVolunteerMembers label="쉼터" members={volunteerMembers} />
			<CreateVolunteerSchedule volunteerSchedules={volunteerSchedules} />
			<VolunteerRequests />
		</div>
	);
}
