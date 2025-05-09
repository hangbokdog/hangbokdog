import type { Volunteer } from "@/types/volunteer";
import ClosedVolunteerCard from "./ClosedVolunteerCard";

interface AllClosedVolunteerProps {
	volunteers: Volunteer[];
}

export default function AllClosedVolunteer({
	volunteers,
}: AllClosedVolunteerProps) {
	return (
		<div className="flex flex-col gap-2.5 mb-2.5">
			<span className="text-xl font-bold">전체 마감된 봉사활동</span>
			{volunteers.map((volunteer) => (
				<ClosedVolunteerCard
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
