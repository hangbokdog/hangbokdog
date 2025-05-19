import { Link } from "react-router-dom";
import OngoingVolunteerDateBox from "./OngoingVolunteerDateBox";
import OngoingVolunteerImage from "./OngoingVolunteerImage";
import OngoingVolunteerInfo from "./OngoingVolunteerInfo";

interface ClosedVolunteerCardProps {
	id: number;
	title: string;
	content: string;
	address: string;
	locationType: string;
	startDate: string;
	endDate: string;
	imageUrl: string;
}

export default function ClosedVolunteerCard({
	id,
	title,
	content,
	address,
	startDate,
	endDate,
	imageUrl,
}: ClosedVolunteerCardProps) {
	return (
		<Link to={`/volunteer/${id}`}>
			<div className="relative bg-white rounded-[8px] shadow-custom-sm flex overflow-hidden h-24 opacity-60 grayscale">
				<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
					마감
				</span>
				<div className="flex flex-grow">
					<OngoingVolunteerDateBox
						startMonth={Number.parseInt(startDate.split("-")[1])}
						startDay={Number.parseInt(startDate.split("-")[2])}
						endMonth={Number.parseInt(endDate.split("-")[1])}
						endDay={Number.parseInt(endDate.split("-")[2])}
					/>
					<OngoingVolunteerInfo
						title={title}
						location={address}
						description={content}
					/>
				</div>
				<div className="w-24 h-24 flex-shrink-0">
					<OngoingVolunteerImage src={imageUrl} alt="dog1" />
				</div>
				<div className="absolute inset-0 cursor-not-allowed z-20" />
			</div>
		</Link>
	);
}
