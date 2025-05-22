import type { Volunteer } from "@/types/volunteer";
import OngoingVolunteerCard from "./OngoingVolunteerCard";

interface OngoingVolunteerProps {
	volunteers: Volunteer[];
}

export default function OngoingVolunteer({
	volunteers,
}: OngoingVolunteerProps) {
	return (
		<div className="flex flex-col gap-2.5 mb-2.5">
			<span className="text-xl font-bold">접수중인 봉사활동</span>
			{volunteers.map((volunteer) => (
				<OngoingVolunteerCard
					key={volunteer.id}
					id={volunteer.id}
					title={volunteer.title}
					content={volunteer.content}
					address={volunteer.address}
					locationType={volunteer.locationType}
					startDate={volunteer.startDate}
					endDate={volunteer.endDate}
					imageUrl={volunteer.imageUrl}
				/>
			))}
		</div>
	);
}
