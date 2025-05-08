import type { Volunteer } from "@/types/volunteer";
import PanelTitle from "../common/PanelTitle";
import OngoingVolunteerCard from "../volunteer/OngoingVolunteerCard";

export default function VolunteerPanel({
	volunteers,
}: { volunteers: Volunteer[] }) {
	return (
		<div className="flex flex-col mx-2.5 p-2.5 rounded-[8px] bg-white shadow-custom-sm">
			<PanelTitle title="자원봉사 일정" link="/volunteer" />
			<div className="flex flex-col gap-2.5">
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
		</div>
	);
}
