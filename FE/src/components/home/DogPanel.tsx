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
		gender: "MALE",
		isLiked: false,
	},
	{
		id: 2,
		name: "찬희",
		age: "6살",
		imageUrl: dog2,
		gender: "FEMALE",
		isLiked: true,
	},
	{
		id: 3,
		name: "백돌",
		age: "2개월",
		imageUrl: dog3,
		gender: "FEMALE",
		isLiked: false,
	},
];

export default function DogPanel() {
	return (
		<div className="flex flex-col mx-2.5 p-2.5 rounded-[8px] bg-white shadow-custom-sm">
			<PanelTitle title="보호중인 아이들" link="/dogs" />
			<div className="max-w-[362px] grid grid-cols-3 gap-2.5 pb-2.5">
				{dummyDogs.map((dog) => (
					<DogCard
						key={dog.id}
						id={dog.id}
						name={dog.name}
						age={dog.age}
						imageUrl={dog.imageUrl}
						gender={dog.gender as "MALE" | "FEMALE"}
						isLiked={dog.isLiked}
					/>
				))}
			</div>
		</div>
	);
}
