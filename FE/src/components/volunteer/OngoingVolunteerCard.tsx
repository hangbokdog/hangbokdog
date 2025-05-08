import { Link } from "react-router-dom";
import OngoingVolunteerDateBox from "./OngoingVolunteerDateBox";
import OngoingVolunteerImage from "./OngoingVolunteerImage";
import OngoingVolunteerInfo from "./OngoingVolunteerInfo";
import dog1 from "@/assets/images/dog1.png";

interface OngoingVolunteerCardProps {
	id: number;
	title: string;
	content: string;
	address: string;
	locationType: string;
	startDate: string;
	endDate: string;
	imageUrl: string;
}

export default function OngoingVolunteerCard({
	id,
	title,
	content,
	address,
	locationType,
	startDate,
	endDate,
	imageUrl,
}: OngoingVolunteerCardProps) {
	return (
		<Link to={`/volunteer/${id}`}>
			<div className="bg-white rounded-[8px] shadow-custom-sm flex overflow-hidden h-24">
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
				<OngoingVolunteerImage src={dog1} alt="dog1" />
			</div>
		</Link>
	);
}
