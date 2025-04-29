import ListPanel from "@/components/common/ListPanel";
import VolunteerListItem from "../requests/VolunteerListItem";
import ImboListItem from "../requests/ImboListItem";
import AdoptionListItem from "../requests/AdoptionListItem";

export default function ManagerRequestsPanel() {
	const volunteerList = [
		{
			name: "홍길동",
			date: "04-27",
			location: "쉼뜰",
			time: "오전",
			index: 0,
		},
		{
			name: "홍길은",
			date: "05-01",
			location: "쉼터",
			time: "종일",
			index: 1,
		},
	];

	const imboList = [
		{
			kid: "두리",
			requestCount: 2,
			index: 0,
		},
		{
			kid: "보리",
			requestCount: 5,
			index: 1,
		},
	];

	const adoptionList = [
		{
			kid: "두리",
			requestCount: 1,
			index: 0,
		},
		{
			kid: "보리",
			requestCount: 2,
			index: 1,
		},
		{
			kid: "재백",
			requestCount: 2,
			index: 2,
		},
	];

	return (
		<div>
			<div className="flex gap-2.5 items-center py-2">
				<div className="flex rounded-full w-6 h-6 bg-blue overflow-hidden">
					<img
						src="/src/assets/images/hand.png"
						className="w-6 h-6"
						alt="Volunteer Icon"
					/>
				</div>
				<div className="text-lg font-bold text-grayText">신청</div>
			</div>
			<ListPanel
				link={"/manager/volunteer"}
				tabs={[
					{
						key: "volunteer",
						label: "봉사",
						data: volunteerList,
						component: VolunteerListItem,
					},
					{
						key: "imbo",
						label: "임보",
						data: imboList,
						component: ImboListItem,
					},
					{
						key: "adoption",
						label: "입양",
						data: adoptionList,
						component: AdoptionListItem,
					},
				]}
			/>
		</div>
	);
}
