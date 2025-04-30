import PanelTitle from "../common/PanelTitle";
import ProtectDogCard from "@/components/my/ProtectDogCard";
import dog1 from "@/assets/images/dog1.png";
import dog2 from "@/assets/images/dog2.png";
import dog3 from "@/assets/images/dog3.png";

const dummyDogs = [
	{
		id: 1,
		name: "모리",
		age: "7개월",
		imageUrl: dog1,
		gender: "MALE",
		status: "APPROVED",
		startDate: "2025.02.01",
	},
	{
		id: 2,
		name: "찬희",
		age: "6살",
		imageUrl: dog2,
		gender: "FEMALE",
		status: "CANCELLED",
		startDate: "2025.02.02",
		endDate: "2025.02.28",
	},
	{
		id: 3,
		name: "백돌",
		age: "2개월",
		imageUrl: dog3,
		gender: "FEMALE",
		status: "PENDING",
		startDate: "2025.02.02",
	},
];

export default function ProtectDogPanel() {
	return (
		<div className="flex flex-col p-2.5 mx-2.5 rounded-xl bg-white shadow-custom-xs">
			<PanelTitle title="임보 정보" link="/dogs" />
			<div className="max-w-[362px] grid grid-rows-3 gap-2.5 pb-2.5">
				{dummyDogs.map((dog) => (
					<ProtectDogCard
						key={dog.id}
						id={dog.id}
						name={dog.name}
						age={dog.age}
						imageUrl={dog.imageUrl}
						gender={dog.gender as "MALE" | "FEMALE"}
						status={
							dog.status as
								| "PENDING"
								| "APPROVED"
								| "REJECTED"
								| "CANCELLED"
						}
						startDate={dog.startDate}
						endDate={dog.endDate}
					/>
				))}
			</div>
		</div>
	);
}
