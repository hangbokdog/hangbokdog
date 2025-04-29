import siren from "@/assets/images/siren.png";
import MovingListItem from "../common/emergency/movingListItem";
import DonationListItem from "../common/emergency/donationListItem";
import VolunteerListItem from "../common/emergency/volunteerListItem";
import ListPanel from "../common/ListPanel";

export default function EmergencyPanel() {
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
		<div className="flex flex-col mx-2.5">
			<div className="flex items-center">
				<img className="size-10" src={siren} alt="siren" />
				<span className="relative text-lg font-semibold text-grayText ml-2">
					긴급요청
					<span className="absolute top-[-12px] right-[-17px] size-5 text-center rounded-full bg-red text-white shadow-custom-sm text-sm font-bold">
						6
					</span>
				</span>
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
