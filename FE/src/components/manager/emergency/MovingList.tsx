import MovingListItem from "@/components/common/emergency/movingListItem";

export default function MovingList() {
	const movingList = [
		{
			img: "", // 기본 이미지가 없을 경우 AvatarFallback 사용됨
			name: "서현",
			startLocation: "서울",
			endLocation: "인천공항",
			date: "D-10시간",
			index: 0,
		},
		{
			img: "",
			name: "도넛",
			startLocation: "부산",
			endLocation: "대구",
			date: "D-2일",
			index: 1,
		},
	];

	return (
		<div className="space-y-2">
			<div className="font-bold text-lg">이동</div>
			{movingList.map((item) => (
				<MovingListItem
					key={item.index}
					img={item.img}
					name={item.name}
					startLocation={item.startLocation}
					endLocation={item.endLocation}
					date={item.date}
					index={item.index}
				/>
			))}
		</div>
	);
}
