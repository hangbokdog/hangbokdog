import { useEffect, useState } from "react";
import ListPanel from "@/components/common/ListPanel";
import AdoptDogCard from "@/components/my/AdoptDogCard";
import ProtectDogCard from "@/components/my/ProtectDogCard";
import { type MyAdoptionResponse, fetchMyAdoptionsAPI } from "@/api/adoption";
import {
	type MyFosterDog,
	fetchMyFosterDogsAPI,
	Status as FosterStatus,
} from "@/api/foster";
import useCenterStore from "@/lib/store/centerStore";

export default function DogTabsPanel() {
	const centerIdRaw = useCenterStore((s) => s.selectedCenter?.centerId);
	const centerId = centerIdRaw ? Number(centerIdRaw) : null;

	const [adoptedDogs, setAdoptedDogs] = useState<MyAdoptionResponse[]>([]);
	const [protectedDogs, setProtectedDogs] = useState<MyFosterDog[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!centerId) return;

		const fetchAllData = async () => {
			try {
				const [fosters, adoptions] = await Promise.all([
					fetchMyFosterDogsAPI(),
					fetchMyAdoptionsAPI(centerId),
				]);

				setProtectedDogs(fosters);
				setAdoptedDogs(adoptions);
			} catch (err) {
				console.error("🔥 데이터 로딩 에러", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllData();
	}, [centerId]);

	if (isLoading) return <div className="p-4">불러오는 중...</div>;

	// ✅ 입양 카드 포맷
	const formatAdoptCardProps = (dog: MyAdoptionResponse) => ({
		id: dog.dogId,
		name: dog.dogName,
		imageUrl: dog.profileImage,
		status: dog.status,
		startDate: dog.startDate.slice(0, 10),
		endDate: undefined,
	});

	// ✅ 임보 카드 포맷
	const formatFosterCardProps = (dog: MyFosterDog) => ({
		id: dog.dogId,
		name: dog.dogName,
		imageUrl: dog.profileImage,
		status: dog.status,
		startDate: dog.startDate.slice(0, 10),
		endDate: undefined,
	});

	const tabs = [
		{
			key: "adopted",
			label: "입양 정보",
			data: adoptedDogs.map(formatAdoptCardProps),
			component: AdoptDogCard,
		},
		{
			key: "protected",
			label: "임보 정보",
			data: protectedDogs.map(formatFosterCardProps),
			component: ProtectDogCard,
		},
	];

	return (
		<div>
			<div className="mx-2.5 mb-4 flex items-center">
				<div className="bg-green h-5 w-1 rounded-full mr-2" />
				<h3 className="text-lg font-bold">내 입양&임보 목록</h3>
			</div>
			<ListPanel link="/dogs" tabs={tabs} />
		</div>
	);
}
