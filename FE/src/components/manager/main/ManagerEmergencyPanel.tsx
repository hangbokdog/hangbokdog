import MovingListItem from "@/components/common/emergency/movingListItem";
import ListPanel from "@/components/common/ListPanel";
import DonationListItem from "@/components/common/emergency/donationListItem";
import VolunteerListItem from "@/components/common/emergency/volunteerListItem";

export default function ManagerEmergencyPanel() {
	const movingList = [
		{
			name: "서현",
			startLocation: "서울",
			endLocation: "인천공항",
			date: "D-10시간",
			index: 0,
		},
		{
			name: "도넛",
			startLocation: "부산",
			endLocation: "대구",
			date: "D-2일",
			index: 1,
		},
	];

	const volunteerList = [
		{
			title: "이삿짐 옮기기",
			current: 2,
			target: 5,
			date: "D-1일",
			index: 0,
		},
		{
			title: "고양이 돌보기",
			current: 1,
			target: 2,
			date: "D-3일",
			index: 1,
		},
	];

	const donationList = [
		{
			title: "수술비 지원",
			current: 30,
			target: 100,
			date: "D-5일",
			index: 0,
		},
		{
			title: "월세 지원",
			current: 70,
			target: 100,
			date: "D-2일",
			index: 1,
		},
	];
	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center py-2">
				<div className="flex gap-2 items-center">
					<div className="flex rounded-full w-6 h-6 bg-red overflow-hidden">
						<img
							src="/src/assets/images/3D Siren Light Model.png"
							className="w-6 h-6"
							alt="Emergency Icon"
						/>
					</div>
					<div className="text-lg font-bold text-grayText">긴급</div>
				</div>
				<div>
					<button
						type="button"
						className="px-3 py-1 bg-male text-white rounded-full hover:bg-blue-500"
					>
						긴급 생성
					</button>
				</div>
			</div>

			<ListPanel
				link={"/emergency"}
				tabs={[
					{
						key: "moving",
						label: "이동",
						data: movingList,
						component: MovingListItem,
					},
					{
						key: "volunteer",
						label: "일손",
						data: volunteerList,
						component: VolunteerListItem,
					},
					{
						key: "donation",
						label: "후원",
						data: donationList,
						component: DonationListItem,
					},
				]}
			/>
		</div>
	);
}
