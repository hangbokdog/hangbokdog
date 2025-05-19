import { useState } from "react";
import ProtectDogCard from "@/components/my/MyDogCard";
import type { ProtectDogCardProps } from "@/components/my/MyDogCard";
import dog1 from "@/assets/images/dog1.png";
import dog2 from "@/assets/images/dog2.png";
import dog3 from "@/assets/images/dog3.png";
import MedicalInfo from "@/components/manager/dogs/MedicalInfo";
import DrugsCalendar from "@/components/manager/dogs/DrugsCalendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const dummyDogs: ProtectDogCardProps[] = [
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

const ITEMS_PER_VIEW = 1;

export default function DogDrugsPanel() {
	const [index, setIndex] = useState(0);
	const maxIndex = dummyDogs.length - ITEMS_PER_VIEW;
	const slideWidth = 100;

	return (
		<div className="relative w-full">
			{/* 왼쪽 화살표 */}
			{index > 0 && (
				<button
					type="button"
					onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
					className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
				>
					<FaChevronLeft className="text-gray-600 w-4 h-4" />
				</button>
			)}

			{/* 오른쪽 화살표 */}
			{index < maxIndex && (
				<button
					type="button"
					onClick={() =>
						setIndex((prev) => Math.min(prev + 1, maxIndex))
					}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
				>
					<FaChevronRight className="text-gray-600 w-4 h-4" />
				</button>
			)}

			{/* 슬라이드 영역 */}
			<div className="overflow-hidden">
				<div
					className="flex transition-transform duration-300 ease-in-out"
					style={{ transform: `translateX(-${index * slideWidth}%)` }}
				>
					{dummyDogs.map((dog) => (
						<div key={dog.id} className="min-w-full px-2">
							<ProtectDogCard {...dog} />
							<MedicalInfo />
							<DrugsCalendar />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
