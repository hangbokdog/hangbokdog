import { useEffect, useState } from "react";
import ListPanel from "@/components/common/ListPanel";
import AdoptDogCard from "@/components/my/AdoptDogCard";
import ProtectDogCard from "@/components/my/ProtectDogCard";
import {
	type AdoptedDogDetailsResponse,
	fetchAdoptionApplicationsAPI,
	fetchApprovedDogDetailsAPI,
} from "@/api/adoption";
import {
	type MyFosterDog,
	fetchMyFosterDogsAPI,
	Status as FosterStatus,
} from "@/api/foster";
import useCenterStore from "@/lib/store/centerStore";

export default function DogTabsPanel() {
	const { selectedCenter } = useCenterStore();
	const centerId = Number(selectedCenter?.centerId);
	const [adoptedDogs, setAdoptedDogs] = useState<AdoptedDogDetailsResponse[]>(
		[],
	);
	const [protectedDogs, setProtectedDogs] = useState<MyFosterDog[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				if (!centerId) return;

				// ✅ 1. 입양 정보
				const appliedDogs =
					await fetchAdoptionApplicationsAPI(centerId);

				const results = await Promise.allSettled(
					appliedDogs.map((dog) =>
						fetchApprovedDogDetailsAPI(dog.dogId),
					),
				);

				const fulfilled = results
					.map((res) =>
						res.status === "fulfilled" ? res.value : null,
					)
					.filter((v): v is AdoptedDogDetailsResponse => v !== null);

				const adopted = fulfilled.filter((dog) => dog.adoptedDate);
				setAdoptedDogs(adopted);

				// ✅ 2. 임보 정보
				const fosters = await fetchMyFosterDogsAPI();
				setProtectedDogs(fosters);
			} catch (err) {
				console.error("입양/임보 정보 불러오기 실패", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllData();
	}, [centerId]);

	if (isLoading) return <div className="p-4">불러오는 중...</div>;

	// ✅ 입양 정보 포맷 (AdoptedDogDetailsResponse → props)
	const formatAdoptCardProps = (dog: AdoptedDogDetailsResponse) => ({
		id: dog.dogId,
		name: dog.dogName,
		age: `${Math.floor(dog.age / 12)}세 ${dog.age % 12}개월`,
		imageUrl: dog.profileImageUrl,
		gender: dog.gender,
		status: "APPROVED",
		startDate: dog.rescuedDate.slice(0, 10),
		endDate: dog.adoptedDate?.slice(0, 10),
	});

	// ✅ 임보 정보 포맷 (MyFosterDog → props)
	const formatFosterCardProps = (dog: MyFosterDog) => ({
		id: dog.dogId,
		name: dog.dogName,
		age: "나이 미상", // ❗추가 정보 없으므로 생략
		imageUrl: dog.profileImage,
		gender: "MALE", // ❗추정 불가 → 기본값
		status: dog.status === FosterStatus.FOSTERING ? "APPROVED" : "PENDING",
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

	return <ListPanel link="/dogs" tabs={tabs} />;
}
