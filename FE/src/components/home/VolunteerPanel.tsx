import type { Volunteer } from "@/types/volunteer";
import PanelTitle from "../common/PanelTitle";
import OngoingVolunteerCard from "../volunteer/OngoingVolunteerCard";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function VolunteerPanel({
	volunteers,
}: { volunteers: Volunteer[] }) {
	return (
		<div className="flex flex-col mx-2.5 py-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center">
					<div className="bg-grayText h-5 w-1 rounded-full mr-2" />
					<h3 className="text-lg font-bold">자원봉사 일정</h3>
				</div>
				<Link
					to="/volunteer"
					className="flex items-center text-sm text-blue-600 font-medium"
				>
					더보기
					<ChevronRight className="w-4 h-4 ml-0.5" />
				</Link>
			</div>
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
