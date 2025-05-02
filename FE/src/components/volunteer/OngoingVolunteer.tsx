import OngoingVolunteerCard from "./OngoingVolunteerCard";

export default function OngoingVolunteer() {
	return (
		<div className="flex flex-col gap-2.5 mb-2.5">
			<span className="text-xl font-bold">접수중인 봉사활동</span>
			<OngoingVolunteerCard id={1} />
			<OngoingVolunteerCard id={2} />
			<OngoingVolunteerCard id={3} />
		</div>
	);
}
