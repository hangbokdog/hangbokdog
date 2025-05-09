import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
	DogStatus,
	Gender,
	DogBreed,
	DogStatusLabel,
	DogBreedLabel,
} from "@/types/dog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useCenterStore from "@/lib/store/centerStore";
import axios from "axios";
import { createDogAPI } from "@/api/dog";
import { toast } from "sonner";
import useManagerStore from "@/lib/store/managerStore";
import { useNavigate } from "react-router-dom";

const colors = ["검", "흰", "갈"];

export default function DogRegisterPage() {
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
	const { addressBook } = useManagerStore();
	const navigate = useNavigate();

	const { selectedCenter } = useCenterStore();

	const [form, setForm] = useState<{
		name: string;
		gender: Gender;
		status: DogStatus;
		breed: string;
		breedDetail: DogBreed;
		weight: string;
		color: string;
		neutered: string;
		features: string;
		rescueDate: string;
		isStar: boolean;
		birth: string;
		locationId: number;
	}>({
		name: "",
		gender: Gender.MALE,
		status: DogStatus.PROTECTED,
		breed: "",
		breedDetail: DogBreed.OTHER,
		weight: "",
		color: "",
		neutered: "",
		features: "",
		rescueDate: "",
		isStar: false,
		birth: "",
		locationId: -1,
	});

	const { mutate } = useMutation({
		mutationFn: (formData: FormData) => createDogAPI(formData),
		onSuccess: (dogId) => {
			toast("강아지 정보 등록");
			navigate(`/dogs/${dogId}`);
		},
		onError: (error) => {
			const errorMessage =
				error.message || "알 수 없는 오류가 발생했습니다.";
			toast("등록실패 ", { description: errorMessage });
		},
	});

	const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());

	const handleProfileImageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			setProfilePreview(URL.createObjectURL(file));
			setProfileImageFile(file);
		}
	};

	const DogBreedFromLabel = Object.entries(DogBreedLabel).reduce(
		(acc, [key, label]) => {
			acc[label] = key as DogBreed;
			return acc;
		},
		{} as Record<string, DogBreed>,
	);

	const GenderFromLabel: Record<string, Gender> = {
		수컷: Gender.MALE,
		암컷: Gender.FEMALE,
	};

	const updateFormWithHighlight = (updates: Partial<typeof form>) => {
		const changed = Object.entries(updates)
			.filter(([key, val]) => val !== form[key as keyof typeof form])
			.map(([key]) => key);

		setForm((prev) => ({ ...prev, ...updates }));
		setUpdatedFields((prev) => {
			const newSet = new Set(prev);
			for (const field of changed) {
				newSet.add(field);
			}
			return newSet;
		});
	};

	const handleOCRImageAuto = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const formData = new FormData();
		formData.append("image", file);
		const res = await axios.post(
			`${import.meta.env.VITE_AI_URI}/ocr`,
			formData,
		);
		const data = res.data.data;
		const formattedBirth = data.birthYear
			? `${data.birthYear.match(/\d{4}/)?.[0] || ""}-01-01`
			: "";
		updateFormWithHighlight({
			gender: GenderFromLabel[data.gender] ?? Gender.MALE,
			neutered: data.neutered ?? "",
			color: data.color ?? "",
			birth: formattedBirth ?? "",
			breed: data.animalType ?? "",
			breedDetail: DogBreedFromLabel[data.subType] ?? DogBreed.OTHER,
			weight: data.weight ?? "",
			features: data.features ?? "",
		});
	};

	const ocrAutoInputRef = useRef<HTMLInputElement>(null);
	const triggerAutoOCR = () => {
		ocrAutoInputRef.current?.click();
	};

	const highlightClass = (field: string) =>
		updatedFields.has(field) ? "ring-1 ring-pulse" : "";

	const handleSubmit = () => {
		if (!profileImageFile) {
			toast("이미지를 업로드해주세요.");
			return;
		}
		if (!selectedCenter?.centerId) {
			toast("센터를 선택해주세요.");
			return;
		}
		if (!form.name) {
			toast("이름을 입력해주세요.");
			return;
		}
		if (!form.gender) {
			toast("성별을 선택해주세요.");
			return;
		}
		if (!form.status) {
			toast("보호 상태를 선택해주세요.");
			return;
		}
		if (!form.breedDetail) {
			toast("견종을 선택해주세요.");
			return;
		}
		if (!form.rescueDate) {
			toast("구조 일시를 선택해주세요.");
			return;
		}

		const requestData = {
			status: form.status,
			centerId: selectedCenter.centerId,
			name: form.name,
			breed: form.breedDetail,
			color: form.color ? [form.color] : [],
			rescuedDate: form.rescueDate ? `${form.rescueDate}T00:00:00` : null,
			weight: form.weight ? Number(form.weight) : null,
			description: form.features || null,
			isStar: form.isStar ?? false,
			gender: form.gender,
			isNeutered: form.neutered === "O",
			birth: form.birth ? `${form.birth}T00:00:00` : null,
			locationId: form.locationId || -1,
		};

		console.log("requestData:", requestData);
		console.log("Enum values:", {
			status: form.status,
			breed: form.breedDetail,
			gender: form.gender,
		});

		const formData = new FormData();
		formData.append(
			"request",
			new Blob([JSON.stringify(requestData)], {
				type: "application/json",
			}),
		);
		formData.append("image", profileImageFile);

		mutate(formData);
	};

	return (
		<div className="flex flex-col gap-5 p-4 text-sm text-grayText bg-white">
			<label className="w-full h-48 bg-gray-200 rounded-md flex justify-center items-center cursor-pointer overflow-hidden">
				{profilePreview ? (
					<img
						src={profilePreview}
						alt="preview"
						className="object-cover w-full h-full"
					/>
				) : (
					<span className="text-4xl text-gray-400">＋</span>
				)}
				<input
					type="file"
					accept="image/*"
					onChange={handleProfileImageChange}
					className="hidden"
				/>
			</label>
			<input
				ref={ocrAutoInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleOCRImageAuto}
			/>
			<button
				type="button"
				onClick={triggerAutoOCR}
				className="w-full py-2 bg-green-600 text-white rounded font-bold"
			>
				이미지로 아이 정보 등록
			</button>

			<span className="text-black text-lg font-bold">견적사항</span>

			<div className="flex items-center gap-2">
				<label htmlFor="dog-name" className="w-20">
					아이 이름
				</label>
				<input
					id="dog-name"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					className={`border text-grayText bg-white px-2 py-1 flex-1 rounded ${highlightClass("name")}`}
				/>
				<button
					type="button"
					className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-800 text-white rounded text-xs"
				>
					AI 생성
				</button>
			</div>

			<div className="flex gap-2 items-center">
				<label htmlFor="gender" className="w-20">
					성별
				</label>
				{Object.values(Gender).map((g) => (
					<div key={g}>
						<input
							type="radio"
							id={`gender-${g}`}
							name="gender"
							value={g}
							checked={form.gender === g}
							onChange={() => setForm({ ...form, gender: g })}
							className="hidden"
						/>
						<label
							htmlFor={`gender-${g}`}
							className={`px-4 py-1 rounded-full cursor-pointer ${
								form.gender === g
									? form.gender === Gender.FEMALE
										? "bg-female text-white"
										: "bg-male text-white"
									: "bg-gray-200"
							} ${highlightClass("gender")}`}
						>
							{g === Gender.MALE ? "남아" : "여아"}
						</label>
					</div>
				))}
			</div>

			<div className="flex gap-2 items-center">
				<label htmlFor="isStar" className="w-20">
					별 여부
				</label>
				{[
					{ label: "별이 되지 않았다", value: false },
					{ label: "별이 되었다", value: true },
				].map(({ label, value }) => (
					<div key={label}>
						<input
							type="radio"
							id={`isStar-${value}`}
							name="isStar"
							value={String(value)}
							checked={form.isStar === value}
							onChange={() => {
								setForm((prev) => ({
									...prev,
									isStar: value,
									location: value ? "별" : prev.locationId,
								}));
							}}
							className="hidden"
						/>
						<label
							htmlFor={`isStar-${value}`}
							className={`px-4 py-1 rounded-full cursor-pointer ${
								form.isStar === value
									? "bg-blue-300 text-white"
									: "bg-gray-200"
							} ${highlightClass("isStar")}`}
						>
							{label}
						</label>
					</div>
				))}
			</div>

			<div className="flex gap-2 items-center">
				<label htmlFor="location" className="w-20 shrink-0">
					소속 위치
				</label>
				<div className="flex gap-2 flex-wrap">
					{form.isStar ? (
						<div>
							<input
								type="radio"
								id="location-star"
								name="location"
								value="-1"
								checked={form.locationId === -1}
								readOnly
								className="hidden"
							/>
							<label
								htmlFor="location-star"
								className="px-4 py-1 rounded-full bg-indigo-400 text-white cursor-not-allowed opacity-60"
							>
								별
							</label>
						</div>
					) : (
						addressBook.map(({ id, addressName }) => (
							<div key={id}>
								<input
									type="radio"
									id={`location-${id}`}
									name="location"
									value={id}
									checked={form.locationId === id}
									onChange={() =>
										setForm({ ...form, locationId: id })
									}
									className="hidden"
								/>
								<label
									htmlFor={`location-${id}`}
									className={`px-4 py-1 rounded-full cursor-pointer ${
										form.locationId === id
											? "bg-indigo-500 text-white"
											: "bg-gray-200"
									} ${highlightClass("locationId")}`}
								>
									{addressName}
								</label>
							</div>
						))
					)}
				</div>
			</div>

			<div className="flex gap-2 items-center">
				<label htmlFor="status" className="w-20">
					보호상태
				</label>
				{Object.values(DogStatus).map((s) => (
					<div key={s}>
						<input
							type="radio"
							id={`status-${s}`}
							name="status"
							value={s}
							checked={form.status === s}
							onChange={() => setForm({ ...form, status: s })}
							className="hidden"
						/>
						<label
							htmlFor={`status-${s}`}
							className={`px-3 py-1 rounded-full cursor-pointer ${
								form.status === s
									? "bg-blue-300 text-white"
									: "bg-gray-200"
							}`}
						>
							{DogStatusLabel[s]}
						</label>
					</div>
				))}
			</div>

			<div className="flex items-center gap-2">
				<label htmlFor="dog-birth" className="w-20">
					출생년도
				</label>
				<input
					id="dog-birth"
					type="date"
					value={form.birth}
					onChange={(e) =>
						setForm({ ...form, birth: e.target.value })
					}
					className={`border px-2 py-1 rounded ${highlightClass("birth")}`}
				/>
			</div>

			<div className="flex items-center gap-2">
				<label htmlFor="dog-breed" className="w-20">
					종
				</label>
				<Select
					value={form.breedDetail}
					onValueChange={(val) =>
						setForm({ ...form, breedDetail: val as DogBreed })
					}
				>
					<SelectTrigger
						className={`flex-1 ${highlightClass("breedDetail")}`}
					>
						<SelectValue placeholder="종을 선택하세요" />
					</SelectTrigger>
					<SelectContent>
						{Object.values(DogBreed).map((b) => (
							<SelectItem key={b} value={b}>
								{DogBreedLabel[b]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2">
				<label htmlFor="dog-weight" className="w-20">
					무게
				</label>
				<input
					id="dog-weight"
					type="number"
					value={form.weight}
					onChange={(e) =>
						setForm({ ...form, weight: e.target.value })
					}
					className={`border px-2 py-1 rounded w-18 ${highlightClass("weight")}`}
				/>
				<span className="text-sm">kg</span>
			</div>

			<div className="flex items-center gap-2">
				<label htmlFor="dog-color" className="w-20">
					색상
				</label>
				{colors.map((c) => (
					<div key={c}>
						<input
							type="radio"
							id={`dog-color-${c}`}
							name="dog-color"
							value={c}
							checked={form.color === c}
							onChange={() => setForm({ ...form, color: c })}
							className="hidden"
						/>
						<label
							htmlFor={`dog-color-${c}`}
							className={`px-3 py-1 rounded-full cursor-pointer ${
								form.color === c
									? "bg-black text-white"
									: "bg-gray-300"
							} ${highlightClass("color")}`}
						>
							{c}
						</label>
					</div>
				))}
			</div>

			<div className="flex gap-2 items-center">
				<label htmlFor="neutered" className="w-20">
					중성화
				</label>
				{["O", "X"].map((val) => (
					<div key={val}>
						<input
							type="radio"
							id={`neutered-${val}`}
							name="neutered"
							value={val}
							checked={form.neutered === val}
							onChange={() => setForm({ ...form, neutered: val })}
							className="hidden"
						/>
						<label
							htmlFor={`neutered-${val}`}
							className={`px-4 py-1 rounded-full cursor-pointer ${
								form.neutered === val
									? "bg-blue-300 text-white"
									: "bg-gray-200"
							} ${highlightClass("neutered")}`}
						>
							{val}
						</label>
					</div>
				))}
			</div>

			<div className="flex gap-2 items-center">
				<label htmlFor="rescue-date" className="w-20">
					구조일시
				</label>
				<input
					id="rescue-date"
					type="date"
					value={form.rescueDate}
					onChange={(e) =>
						setForm({ ...form, rescueDate: e.target.value })
					}
					className="border p-1 rounded"
				/>
			</div>

			<div>
				<label htmlFor="dog-features" className="block mb-1">
					특이사항
				</label>
				<textarea
					id="dog-features"
					value={form.features}
					onChange={(e) =>
						setForm({ ...form, features: e.target.value })
					}
					className={`border w-full h-24 p-2 rounded ${highlightClass("features")}`}
				/>
			</div>

			<button
				type="button"
				onClick={handleSubmit}
				className="mt-4 w-full py-2 bg-male text-white rounded-full font-bold"
			>
				등록하기
			</button>
		</div>
	);
}
