import { useState } from "react";
import { cn } from "@/lib/utils";
import MyDogCard from "@/components/my/MyDogCard";
import dog1 from "@/assets/images/dog1.png";
import dog2 from "@/assets/images/dog2.png";
import dog3 from "@/assets/images/dog3.png";
import dog4 from "@/assets/images/dog1.png"; // Reusing existing dog images
import dog5 from "@/assets/images/dog2.png";
import dog6 from "@/assets/images/dog3.png";

// Dummy data for each category
const protectedDogs = [
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

const likedDogs = [
	{
		id: 4,
		name: "초코",
		age: "3살",
		imageUrl: dog4,
		gender: "MALE",
		status: "APPROVED",
		startDate: "2025.03.01",
	},
	{
		id: 5,
		name: "까망이",
		age: "2살",
		imageUrl: dog5,
		gender: "MALE",
		status: "APPROVED",
		startDate: "2025.03.05",
	},
];

const adoptedDogs = [
	{
		id: 6,
		name: "달리",
		age: "1살",
		imageUrl: dog6,
		gender: "FEMALE",
		status: "APPROVED",
		startDate: "2024.01.15",
	},
];

type DogTabType = "liked" | "protected" | "adopted";

export default function DogsTabContent() {
	const [activeTab, setActiveTab] = useState<DogTabType>("protected");

	const renderEmptyState = (type: DogTabType) => {
		const messages = {
			liked: "아직 좋아요한 강아지가 없어요.\n마음에 드는 친구를 찾아보세요!",
			protected:
				"아직 임시보호 중인 강아지가 없어요.\n소중한 보호자가 되어주세요!",
			adopted:
				"아직 입양한 강아지가 없어요.\n평생 함께할 가족을 만들어보세요!",
		};

		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-gray-500 whitespace-pre-line">
					{messages[type]}
				</p>
			</div>
		);
	};

	const renderDogsList = () => {
		switch (activeTab) {
			case "liked":
				return likedDogs.length > 0 ? (
					<div className="max-w-[400px] grid grid-rows-3 gap-2.5 pb-2.5">
						{likedDogs.map((dog) => (
							<MyDogCard
								key={dog.id}
								id={dog.id}
								name={dog.name}
								age={dog.age}
								imageUrl={dog.imageUrl}
								gender={dog.gender as "MALE" | "FEMALE"}
								status={dog.status as "APPROVED"}
								startDate={dog.startDate}
							/>
						))}
					</div>
				) : (
					renderEmptyState("liked")
				);
			case "protected":
				return protectedDogs.length > 0 ? (
					<div className="max-w-[400px] grid grid-rows-3 gap-2.5 pb-2.5">
						{protectedDogs.map((dog) => (
							<MyDogCard
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
				) : (
					renderEmptyState("protected")
				);
			case "adopted":
				return adoptedDogs.length > 0 ? (
					<div className="max-w-[400px] grid grid-rows-3 gap-2.5 pb-2.5">
						{adoptedDogs.map((dog) => (
							<MyDogCard
								key={dog.id}
								id={dog.id}
								name={dog.name}
								age={dog.age}
								imageUrl={dog.imageUrl}
								gender={dog.gender as "MALE" | "FEMALE"}
								status={dog.status as "APPROVED"}
								startDate={dog.startDate}
							/>
						))}
					</div>
				) : (
					renderEmptyState("adopted")
				);
			default:
				return null;
		}
	};

	return (
		<div>
			{/* Inner Dog Tabs */}
			<div className="flex border-b mb-2.5">
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "liked"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
					)}
					onClick={() => setActiveTab("liked")}
				>
					좋아요
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "protected"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
					)}
					onClick={() => setActiveTab("protected")}
				>
					임시보호
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "adopted"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
					)}
					onClick={() => setActiveTab("adopted")}
				>
					입양
				</button>
			</div>

			{renderDogsList()}
		</div>
	);
}
