import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MdEditNote } from "react-icons/md";
import DogImage from "@/components/dog/DogImage";
import DogHeader from "@/components/dog/DogHeader";
import DogInfoCard from "@/components/dog/DogInfoCard";
import DogInfoItem from "@/components/dog/DogInfoItem";
import DogGridInfoItem from "@/components/dog/DogGridInfoItem";
import DogActionButtons from "@/components/dog/DogActionButtons";
import DogSponsors from "@/components/dog/DogSponsors";
import useCenterStore from "@/lib/store/centerStore";
import { type DogDetailResponse, fetchDogDetail } from "@/api/dog";
import dog1 from "@/assets/images/dog1.png";
import {
	type DogBreed,
	DogBreedLabel,
	type DogStatus as DogStatusType,
	type Gender,
} from "@/types/dog";
import DogStatus from "@/components/dog/DogStatus";
import DogMediInfos from "@/components/dog/DogMediInfos";

interface DogDetail {
	dogId: number;
	dogStatus: string;
	centerId: number;
	centerName: string;
	dogName: string;
	profileImageUrl: string;
	color: string;
	rescuedDate: string;
	weight: string;
	description: string;
	isStar: number;
	gender: string;
	isNeutered: string;
	breed: string;
	age: string;
	location: string;
	isLiked: boolean;
	favoriteCount: number;
	currentSponsorCount: number;

	medicationDate: string;
	medicationInfo: string;
	medicationNotes: string;
	comments: number;
	// sponsors: { id: number; name: string }[];
}

const formatDate = (dateStr: string): string => {
	if (!dateStr || Number.isNaN(Date.parse(dateStr))) {
		return "알 수 없음";
	}
	return new Date(dateStr).toISOString().split("T")[0];
};

const formatAge = (age: number | null | undefined): string => {
	if (age == null || Number.isNaN(age) || age < 0) {
		return "알 수 없음";
	}
	if (age >= 12) {
		return `${Math.floor(age / 12)}살`;
	}
	return `${age}개월`;
};

const mapDogDetailResponseToDogDetail = (
	response: DogDetailResponse,
): DogDetail => ({
	dogId: response.dogId,
	dogStatus: response.dogStatus,
	centerId: response.centerId,
	centerName: response.centerName,
	dogName: response.dogName,
	profileImageUrl: response.profileImageUrl,
	color: response.color.join(", "),
	rescuedDate: response.rescuedDate,
	weight: `${response.weight} kg`,
	description: response.description || "없음",
	isStar: response.isStar ? 1 : 0,
	gender: response.gender,
	isNeutered: response.isNeutered ? "O" : "X",
	breed:
		response.breed in DogBreedLabel
			? DogBreedLabel[response.breed as DogBreed]
			: DogBreedLabel.OTHER,
	age: `${formatAge(response.age)}`,
	location: response.location || "알 수 없음",
	isLiked: response.isLiked,
	favoriteCount: response.favoriteCount,
	currentSponsorCount: response.currentSponsorCount,

	medicationDate: "정보 없음",
	medicationInfo: "정보 없음",
	medicationNotes: "없음",
	comments: 0,
	// sponsors: response.sponsors || [],
});

export default function DogDetailPage() {
	const { selectedCenter } = useCenterStore();
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, error } = useQuery<DogDetail, Error>({
		queryKey: ["dogDetail", id, selectedCenter?.centerId],
		queryFn: () =>
			fetchDogDetail(Number(id), selectedCenter?.centerId || "").then(
				mapDogDetailResponseToDogDetail,
			),
		enabled:
			!!id && !Number.isNaN(Number(id)) && !!selectedCenter?.centerId,
	});

	if (!id || Number.isNaN(Number(id))) {
		return (
			<div className="flex flex-col items-center p-4">
				<p className="text-red-500">유효하지 않은 강아지 ID입니다.</p>
			</div>
		);
	}

	if (!selectedCenter?.centerId) {
		return (
			<div className="flex flex-col items-center p-4">
				<p className="text-red-500">보호소를 선택해주세요.</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center p-4">
				<p className="text-grayText">강아지 정보를 불러오는 중...</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex flex-col items-center p-4">
				<p className="text-red-500">
					강아지 정보를 불러오지 못했습니다:{" "}
					{error?.message || "알 수 없는 오류"}
				</p>
			</div>
		);
	}

	if (data.centerId !== Number(selectedCenter.centerId)) {
		return (
			<div className="flex flex-col items-center p-4">
				<p className="text-red-500">
					현재 선택된 보호소와 강아지의 보호소가 일치하지 않습니다.
				</p>
			</div>
		);
	}

	return (
		<motion.div
			className="flex flex-col"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<DogImage src={data.profileImageUrl || dog1} alt={data.dogName} />
			<div className="flex flex-col p-2.5 gap-3">
				<DogHeader
					name={data.dogName}
					age={data.age}
					likes={data.favoriteCount}
					comments={data.comments}
				/>
				<div className="flex justify-between items-center">
					<DogStatus
						status={data.dogStatus as DogStatusType}
						gender={data.gender as Gender}
					/>
					{selectedCenter?.status === "MANAGER" && (
						<button
							type="button"
							className="flex items-center gap-1 bg-main rounded-full px-4 py-1 text-white font-semibold"
						>
							정보 수정
							<MdEditNote />
						</button>
					)}
				</div>

				<DogSponsors
					sponsorCount={data.currentSponsorCount}
					dogId={data.dogId}
				/>
				{/* <DogSponsors sponsors={data.sponsors} /> */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					<DogInfoCard title="견적사항">
						<div className="grid grid-cols-2">
							<DogGridInfoItem label="종" value={data.breed} />
							<DogGridInfoItem label="색상" value={data.color} />
						</div>
						<div className="grid grid-cols-2">
							<DogGridInfoItem label="무게" value={data.weight} />
							<DogGridInfoItem
								label="중성화"
								value={data.isNeutered}
							/>
						</div>
						<DogInfoItem
							label="특이사항"
							value={data.description}
						/>
					</DogInfoCard>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
				>
					<DogInfoCard title="기타">
						<DogInfoItem
							label="구조일시"
							value={formatDate(data.rescuedDate)}
						/>
						<DogInfoItem label="발견장소" value={data.location} />
						<DogInfoItem label="보호소" value={data.centerName} />
					</DogInfoCard>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.3 }}
				>
					<DogMediInfos dogId={data.dogId} />
				</motion.div>
				<DogActionButtons
					sponsorLink="https://www.ihappynanum.com/Nanum/B/21G6PTU1W5?ltclid=6e37156f-0f73-4313-a7af-67fdd2ab06ce&fbclid=PAZXh0bgNhZW0CMTEAAadBxtRn2enWtLqH7SNGEL3WiZ4B7nTUy1REE0aTiW8ixFz2w2IT5PJPw9XdTg_aem_O_6bWU3kjURO35qBLOSEcA"
					adoptionLink="/adoption/notice"
				/>
			</div>
		</motion.div>
	);
}
