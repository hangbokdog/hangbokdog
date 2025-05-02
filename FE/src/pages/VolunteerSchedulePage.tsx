import { useState } from "react";
import VolunteerCalendar from "@/components/volunteer/VolunteerCalendar";
import OngoingVolunteer from "@/components/volunteer/OngoingVolunteer";

export default function VolunteerSchedulePage() {
	const [currentEvents] = useState([
		{
			title: "쉼뜰",
			start: "2025-04-27",
			end: "2025-05-04",
			backgroundColor: "#F3A68B",
			borderColor: "#F3A68B",
			textColor: "#000000",
			display: "block",
		},
		{
			title: "입양뜰",
			start: "2025-04-27",
			end: "2025-05-04",
			backgroundColor: "#FFEDB4",
			borderColor: "#FFEDB4",
			textColor: "#000000",
			display: "block",
		},
		{
			title: "쉼터",
			start: "2025-05-04",
			end: "2025-05-11",
			backgroundColor: "#8BD4F4",
			borderColor: "#8BD4F4",
			textColor: "#000000",
			display: "block",
		},
		{
			title: "쉼뜰",
			start: "2025-05-04",
			end: "2025-05-11",
			backgroundColor: "#F3A68B",
			borderColor: "#F3A68B",
			textColor: "#000000",
			display: "block",
		},
		{
			title: "입양뜰",
			start: "2025-05-11",
			end: "2025-05-18",
			backgroundColor: "#FFEDB4",
			borderColor: "#FFEDB4",
			textColor: "#000000",
			display: "block",
		},
		{
			title: "쉼터",
			start: "2025-05-18",
			end: "2025-05-25",
			backgroundColor: "#8BD4F4",
			borderColor: "#8BD4F4",
			textColor: "#000000",
			display: "block",
		},
	]);

	return (
		<div className="flex flex-col mx-2.5 gap-6">
			<VolunteerCalendar events={currentEvents} />
			<OngoingVolunteer />
		</div>
	);
}
