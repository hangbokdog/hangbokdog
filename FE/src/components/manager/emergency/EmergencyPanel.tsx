import MovingList from "./MovingList";
import VolunteerList from "./VolunteerList";
import DonationList from "./DonationList";
import { useNavigate } from "react-router-dom";

export default function EmergencyPanel() {
	const navigate = useNavigate();
	return (
		<div className="bg-white p-2.5 rounded-xl shadow-custom-xs mx-2.5 mt-4">
			<div className="flex justify-between items-center py-2">
				<div className="font-bold text-lg mx-2.5 my-1">응급 목록</div>
				<div>
					<button
						type="button"
						className="px-3 py-1 bg-male text-white rounded-full"
						onClick={() => navigate("/manager/emergency/register")}
					>
						응급 추가
					</button>
				</div>
			</div>
			<div className="flex p-2.5 flex-col space-y-8 text-grayText">
				<DonationList />
				<MovingList />
				<VolunteerList />
			</div>
		</div>
	);
}
