import VolunteerListItem from "@/components/common/emergency/volunteerListItem";

export default function VolunteerList() {
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

	return (
		<div className="space-y-2">
			<div className="font-bold text-lg">일손</div>
			{volunteerList.map((item) => (
				<VolunteerListItem
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
