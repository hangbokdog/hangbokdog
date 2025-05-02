import { Link } from "react-router-dom";
import OngoingVolunteerDateBox from "./OngoingVolunteerDateBox";
import OngoingVolunteerImage from "./OngoingVolunteerImage";
import OngoingVolunteerInfo from "./OngoingVolunteerInfo";
import dog1 from "@/assets/images/dog1.png";

interface OngoingVolunteerCardProps {
	id: number;
}

export default function OngoingVolunteerCard({
	id,
}: OngoingVolunteerCardProps) {
	return (
		<Link to={`/volunteer/${id}`}>
			<div className="bg-white rounded-[8px] shadow-custom-sm flex overflow-hidden h-24">
				<OngoingVolunteerDateBox
					startMonth={4}
					startDay={29}
					endMonth={5}
					endDay={5}
				/>
				<OngoingVolunteerInfo
					title="쉼뜰 봉사"
					location="파주 어딘가"
					description="방청소 바닥청소 설거지"
				/>
				<OngoingVolunteerImage src={dog1} alt="dog1" />
			</div>
		</Link>
	);
}
