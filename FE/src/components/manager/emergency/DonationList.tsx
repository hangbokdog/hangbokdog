import DonationListItem from "@/components/common/emergency/donationListItem";

export default function DonationList() {
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
		<div className="space-y-2">
			<div className="font-bold text-lg">후원</div>
			{donationList.map((item) => (
				<DonationListItem
					key={item.index}
					title={item.title}
					current={item.current}
					target={item.target}
					date={item.date}
					index={item.index}
				/>
			))}
		</div>
	);
}
