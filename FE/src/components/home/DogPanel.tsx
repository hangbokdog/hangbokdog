import PanelTitle from "../common/PanelTitle";
import DogCard from "@/components/common/DogCard";
import dog1 from "@/assets/images/dog1.png";
import dog2 from "@/assets/images/dog2.png";
import dog3 from "@/assets/images/dog3.png";

// 더미 데이터
const dummyDogs = [
	{
		id: 1,
		name: "모리",
		age: "7개월",
		imageUrl: dog1,
		isMale: true,
		isLiked: false,
	},
	{
		id: 2,
		name: "찬희",
		age: "6살",
		imageUrl: dog2,
		isMale: false,
		isLiked: true,
	},
	{
		id: 3,
		name: "백돌",
		age: "2개월",
		imageUrl: dog3,
		isMale: false,
		isLiked: false,
	},
];

export default function DogPanel() {
	return (
		<div className="flex flex-col p-2.5 rounded-3xl bg-white shadow-custom-xs">
			<PanelTitle title="보호중인 아이들" link="/dogs" />
			<div className="max-w-[362px] grid grid-cols-3 gap-2.5 pb-2.5">
				{dummyDogs.map((dog) => (
					<DogCard
						key={dog.id}
						id={dog.id}
						name={dog.name}
						age={dog.age}
						imageUrl={dog.imageUrl}
						isMale={dog.isMale}
						isLiked={dog.isLiked}
					/>
				))}
			</div>
		</div>
	);
}
