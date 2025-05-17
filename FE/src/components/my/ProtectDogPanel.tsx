import { useEffect, useState } from "react";
import PanelTitle from "../common/PanelTitle";
import ProtectDogCard from "@/components/my/ProtectDogCard";
import {
	type AdoptedDogDetailsResponse,
	fetchAdoptionApplicationsAPI,
	fetchApprovedDogDetailsAPI,
} from "@/api/adoption";
import useCenterStore from "@/lib/store/centerStore";

export default function ProtectDogPanel() {
	const { selectedCenter } = useCenterStore();
	const centerId = Number(selectedCenter?.centerId);
	const [dogDetailsList, setDogDetailsList] = useState<
		AdoptedDogDetailsResponse[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				if (!centerId) return;

				// 1. 내가 신청한 입양 목록 가져오기
				const appliedDogs =
					await fetchAdoptionApplicationsAPI(centerId);

				// 2. 각 dogId에 대해 승인된 상세 정보 가져오기
				const results = await Promise.allSettled(
					appliedDogs.map((dog) =>
						fetchApprovedDogDetailsAPI(dog.dogId),
					),
				);

				// 3. 성공한 것만 필터링
				const fulfilled = results
					.map((res, idx) =>
						res.status === "fulfilled" ? res.value : null,
					)
					.filter((v) => v !== null);

				setDogDetailsList(fulfilled);
			} catch (err) {
				console.error("입양양 정보 불러오기 실패", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllData();
	}, [centerId]);

	if (isLoading) return <div className="p-4">불러오는 중...</div>;

	return (
		<div className="flex flex-col p-2.5 mx-2.5 rounded-xl bg-white shadow-custom-xs">
			<PanelTitle title="입양 정보" link="/dogs" />
			<div className="max-w-[400px] grid grid-rows-3 gap-2.5 pb-2.5">
				{dogDetailsList.map((dog) => {
					const ageText = `${Math.floor(dog.age / 12)}세 ${dog.age % 12}개월`;

					return (
						<ProtectDogCard
							key={dog.dogId}
							id={dog.dogId}
							name={dog.dogName}
							age={ageText}
							imageUrl={dog.profileImageUrl}
							gender={dog.gender}
							status={"APPROVED"} // 임보 완료 기준
							startDate={dog.rescuedDate.slice(0, 10)}
							endDate={dog.adoptedDate?.slice(0, 10)}
						/>
					);
				})}
			</div>
		</div>
	);
}
