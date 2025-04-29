import calendar from "@/assets/images/calendar.png";
import PanelTitle from "../common/PanelTitle";

export default function VolunteerPanel() {
	return (
		<div className="flex flex-col mx-2.5 p-2.5 rounded-[8px] bg-white shadow-custom-sm">
			<PanelTitle title="자원봉사 일정" link="/volunteer" />
			<div className="flex justify-center">
				<img className="w-[347px]" src={calendar} alt="calendar" />
			</div>
		</div>
	);
}
