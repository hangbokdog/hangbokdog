import calendar from "@/assets/images/calendar.png";
import PanelTitle from "../common/PanelTitle";

export default function VolunteerPanel() {
	return (
		<div className="flex flex-col p-2.5 rounded-3xl bg-white shadow-custom-xs">
			<PanelTitle title="자원봉사 일정" link="/volunteer" />
			<div className="flex justify-center">
				<img className="w-[347px]" src={calendar} alt="calendar" />
			</div>
		</div>
	);
}
