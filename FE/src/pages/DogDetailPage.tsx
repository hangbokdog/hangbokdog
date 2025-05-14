import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MdEditNote } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import DogImage from "@/components/dog/DogImage";
import DogHeader from "@/components/dog/DogHeader";
import DogInfoCard from "@/components/dog/DogInfoCard";
import DogInfoItem from "@/components/dog/DogInfoItem";
import DogGridInfoItem from "@/components/dog/DogGridInfoItem";
import DogActionButtons from "@/components/dog/DogActionButtons";
import DogSponsors from "@/components/dog/DogSponsors";
import useCenterStore from "@/lib/store/centerStore";
import {
	type DogDetailResponse,
	fetchDogDetail,
	updateDogAPI,
} from "@/api/dog";
import { toast } from "sonner";
import dog1 from "@/assets/images/dog1.png";
import {
	type DogBreed,
	DogBreedLabel,
	type DogStatus as DogStatusType,
	type Gender,
} from "@/types/dog";
import DogStatus from "@/components/dog/DogStatus";
import DogMediInfos from "@/components/dog/DogMediInfos";
import { fetchAddressBooks, type AddressBook } from "@/api/center";

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
	locationId: number;
	isLiked: boolean;
	favoriteCount: number;
	currentSponsorCount: number;
	dogCommentCount: number;
	medicationDate: string;
	medicationInfo: string;
	medicationNotes: string;
	comments: number;
}

const formatDate = (dateStr: string): string => {
	if (!dateStr || Number.isNaN(Date.parse(dateStr))) return "알 수 없음";
	return new Date(dateStr).toISOString().split("T")[0];
};

const formatAge = (age: number | null | undefined): string => {
	if (age == null || Number.isNaN(age) || age < 0) return "알 수 없음";
	if (age >= 12) return `${Math.floor(age / 12)}살`;
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
	breed: response.breed,
	age: `${formatAge(response.age)}`,
	location: response.location || "알 수 없음",
	locationId: response.locationId,
	isLiked: response.isLiked,
	favoriteCount: response.favoriteCount,
	currentSponsorCount: response.currentSponsorCount,
	dogCommentCount: response.dogCommentCount,
	medicationDate: "정보 없음",
	medicationInfo: "정보 없음",
	medicationNotes: "없음",
	comments: 0,
});

export default function DogDetailPage() {
	const { selectedCenter } = useCenterStore();
	const { id } = useParams<{ id: string }>();
	const [isEditing, setIsEditing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const {
		data: addressBooks,
		isLoading: isAddressLoading,
		error: addressError,
	} = useQuery<AddressBook[], Error>({
		queryKey: ["addressBooks", selectedCenter?.centerId],
		queryFn: () =>
			fetchAddressBooks(selectedCenter?.centerId?.toString() || ""),
		enabled: !!selectedCenter?.centerId && isEditing,
	});

	const getAddressName = (id: string) => {
		if (!addressBooks) return id;
		const found = addressBooks.find((ab) => ab.id.toString() === id);
		return found ? found.addressName : id;
	};

	const { data, isLoading, error, refetch } = useQuery<DogDetail, Error>({
		queryKey: ["dogDetail", id, selectedCenter?.centerId],
		queryFn: () =>
			fetchDogDetail(Number(id), selectedCenter?.centerId || "").then(
				mapDogDetailResponseToDogDetail,
			),
		enabled:
			!!id && !Number.isNaN(Number(id)) && !!selectedCenter?.centerId,
	});

	useEffect(() => {
		if (data) console.log(data);
	}, [data]);

	const [form, setForm] = useState({
		imageFile: null as File | null,
		imagePreview: null as string | null,
		dogName: "",
		weight: 0,
		description: "",
		isNeutered: false,
		locationId: data?.locationId,
		dogBreed: data?.breed,
	});

	useEffect(() => {
		if (data) {
			setForm({
				imageFile: null,
				imagePreview: data.profileImageUrl || null,
				dogName: data.dogName,
				weight: Number.parseFloat(data.weight),
				description: data.description,
				isNeutered: data.isNeutered === "O",
				locationId: data.locationId,
				dogBreed: data.breed,
			});
		}
	}, [data]);

	if (!id || Number.isNaN(Number(id))) {
		return (
			<p className="p-4 text-red-500">유효하지 않은 강아지 ID입니다.</p>
		);
	}

	if (!selectedCenter?.centerId) {
		return <p className="p-4 text-red-500">보호소를 선택해주세요.</p>;
	}

	if (isLoading) {
		return (
			<p className="p-4 text-grayText">강아지 정보를 불러오는 중...</p>
		);
	}

	if (error || !data) {
		return (
			<p className="p-4 text-red-500">
				강아지 정보를 불러오지 못했습니다:{" "}
				{error?.message || "알 수 없는 오류"}
			</p>
		);
	}

	if (data.centerId !== Number(selectedCenter.centerId)) {
		return (
			<p className="p-4 text-red-500">
				현재 선택된 보호소와 강아지의 보호소가 일치하지 않습니다.
			</p>
		);
	}

	const handleUpdate = async () => {
		try {
			await updateDogAPI(
				data.centerId,
				data.dogId,
				{
					dogName: form.dogName,
					weight: form.weight,
					description: form.description,
					isNeutered: form.isNeutered,
					locationId: form.locationId ?? 0,
					dogBreed:
						(form.dogBreed as DogBreed) || DogBreedLabel.OTHER,
				},
				form.imageFile,
			);
			toast.success("수정이 완료되었습니다");
			setIsEditing(false);
			refetch();
		} catch (e) {
			console.error(e);
			toast.error("수정 실패");
		}
	};

	const handleImageClick = () => {
		if (isEditing && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (form.imagePreview?.startsWith("blob:")) {
				URL.revokeObjectURL(form.imagePreview);
			}
			const preview = URL.createObjectURL(file);
			setForm((prev) => ({
				...prev,
				imageFile: file,
				imagePreview: preview,
			}));
		}
	};

	return (
		<motion.div
			className="flex flex-col"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="relative">
				<DogImage
					src={
						isEditing && form.imagePreview
							? form.imagePreview
							: data.profileImageUrl || dog1
					}
					alt={data.dogName}
					className={isEditing ? "cursor-pointer" : ""}
				/>
				{isEditing && (
					<div
						className="absolute inset-x-0 top-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] w-full h-full p-2"
						onClick={handleImageClick}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								handleImageClick();
							}
						}}
					>
						<p className="text-xl font-semibold text-superLightBlueGray">
							이미지 변경하기
						</p>
					</div>
				)}
			</div>
			{isEditing && (
				<input
					type="file"
					accept="image/*"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleImageChange}
				/>
			)}

			<div className="flex flex-col p-2.5 gap-3">
				<DogHeader
					name={data.dogName}
					age={data.age}
					likes={data.favoriteCount}
					isLiked={data.isLiked}
					comments={data.dogCommentCount}
				/>
				<div className="flex justify-between items-center">
					<DogStatus
						status={data.dogStatus as DogStatusType}
						gender={data.gender as Gender}
					/>
					{selectedCenter?.status === "MANAGER" &&
						(isEditing ? (
							<button
								type="button"
								className="bg-green-500 text-white rounded-full px-4 py-1 font-semibold"
								onClick={handleUpdate}
							>
								확인
							</button>
						) : (
							<button
								type="button"
								className="flex items-center gap-1 bg-main rounded-full px-4 py-1 text-white font-semibold"
								onClick={() => setIsEditing(true)}
							>
								정보 수정
								<MdEditNote />
							</button>
						))}
				</div>

				<DogSponsors
					sponsorCount={data.currentSponsorCount}
					dogId={data.dogId}
				/>

				<DogInfoCard title="견적사항">
					<div className="grid grid-cols-2">
						<DogGridInfoItem
							label="종"
							value={
								isEditing ? (
									<select
										value={form.dogBreed}
										defaultValue={data.breed}
										onChange={(e) =>
											setForm({
												...form,
												dogBreed: e.target.value,
											})
										}
										className="w-full bg-white rounded-full p-1 text-center"
									>
										{Object.entries(DogBreedLabel).map(
											([breed, label]) => (
												<option
													key={breed}
													value={breed}
												>
													{label}
												</option>
											),
										)}
									</select>
								) : (
									DogBreedLabel[data.breed as DogBreed]
								)
							}
						/>
						<DogGridInfoItem label="색상" value={data.color} />
					</div>
					<div className="grid grid-cols-2">
						<DogGridInfoItem
							label="무게"
							value={
								isEditing ? (
									<input
										type="number"
										value={form.weight}
										className="w-full bg-white rounded-full p-1 text-center"
										onChange={(e) =>
											setForm({
												...form,
												weight: Number(e.target.value),
											})
										}
									/>
								) : (
									data.weight
								)
							}
						/>
						<DogGridInfoItem
							label="중성화"
							value={
								isEditing ? (
									<select
										value={form.isNeutered ? "O" : "X"}
										className="flex w-full h-full justify-center text-center bg-white rounded-full p-1"
										onChange={(e) =>
											setForm({
												...form,
												isNeutered:
													e.target.value === "O",
											})
										}
									>
										<option value="O">O</option>
										<option value="X">X</option>
									</select>
								) : (
									data.isNeutered
								)
							}
						/>
					</div>
					<DogInfoItem
						label="특이사항"
						value={
							isEditing ? (
								<textarea
									value={form.description}
									className="w-full min-h-[100px] max-h-[300px] bg-white p-1"
									onChange={(e) =>
										setForm({
											...form,
											description: e.target.value,
										})
									}
								/>
							) : (
								data.description
							)
						}
					/>
				</DogInfoCard>

				<DogInfoCard title="기타">
					<DogInfoItem
						label="구조일시"
						value={formatDate(data.rescuedDate)}
					/>
					<DogInfoItem
						label="위치"
						value={
							isEditing ? (
								<div className="flex flex-col gap-2">
									{isAddressLoading && <p>주소 로딩 중...</p>}
									{addressError && (
										<p className="text-red-500">
											주소 불러오기 실패
										</p>
									)}
									<select
										value={form.locationId}
										defaultValue={data.locationId}
										onChange={(e) =>
											setForm({
												...form,
												locationId: Number(
													e.target.value,
												),
											})
										}
										className="border p-2 rounded bg-white"
									>
										{addressBooks?.map((ab) => (
											<option key={ab.id} value={ab.id}>
												{ab.addressName}
											</option>
										))}
									</select>
								</div>
							) : (
								getAddressName(data.location)
							)
						}
					/>
				</DogInfoCard>

				<DogMediInfos
					isManager={selectedCenter?.status === "MANAGER"}
					dogId={data.dogId}
					centerId={data.centerId}
				/>

				<DogActionButtons
					sponsorLink="https://www.ihappynanum.com/Nanum/B/21G6PTU1W5"
					adoptionLink={`/dogs/${id}/adoption/notice`}
				/>
			</div>
		</motion.div>
	);
}
