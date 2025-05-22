import type { Volunteer } from "@/types/volunteer";
import ClosedVolunteerCard from "./ClosedVolunteerCard";
import { Link } from "react-router-dom";

interface ClosedVolunteerProps {
	volunteers: Volunteer[];
}

export default function ClosedVolunteer({ volunteers }: ClosedVolunteerProps) {
	return (
		<div className="flex flex-col gap-2.5 mb-2.5">
			<div className="flex justify-between items-center">
				<span className="text-xl font-bold">마감된 봉사활동</span>
				<Link
					to={"/volunteer/closed"}
					className="text-xs text-grayText border-b-1 border-b-grayText"
				>
					더보기
				</Link>
			</div>
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
