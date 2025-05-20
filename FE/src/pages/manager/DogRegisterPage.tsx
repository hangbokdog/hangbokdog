import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	DogStatus,
	Gender,
	DogBreed,
	DogStatusLabel,
	DogBreedLabel,
	DogColor,
	DogColorLabel,
	DogColorBgClass,
} from "@/types/dog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useCenterStore from "@/lib/store/centerStore";
import axios from "axios";
import { createDogAPI } from "@/api/dog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { type AddressBook, fetchAddressBooks } from "@/api/center";

export default function DogRegisterPage() {
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const centerId = useCenterStore().selectedCenter?.centerId;

	const { data: addressBook } = useQuery<AddressBook[], Error>({
		queryKey: ["addressBooks", centerId],
		queryFn: () => fetchAddressBooks(centerId as string),
		enabled: !!centerId,
	});
	const navigate = useNavigate();

	const { selectedCenter } = useCenterStore();

	const [ocrDetectedFields, setOcrDetectedFields] = useState<{
		gender?: Gender;
		colors?: DogColor[];
		neutered?: string;
		breedDetail?: DogBreed;
	}>({});

	const [form, setForm] = useState<{
		name: string;
		gender: Gender;
		status: DogStatus;
		breed: string;
		breedDetail: DogBreed;
		weight: string;
		colors: DogColor[];
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
		colors: [],
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
			navigate(`/dogs/${dogId}`, { replace: true });
		},
		onError: (error) => {
			const errorMessage =
				error.message || "알 수 없는 오류가 발생했습니다.";
			toast("등록실패 ", { description: errorMessage });
		},
	});

	const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(false);

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

	const toggleColor = (color: DogColor) => {
		setForm((prev) => {
			const isSelected = prev.colors.includes(color);
			const newColors = isSelected
				? prev.colors.filter((c) => c !== color)
				: [...prev.colors, color];

			return { ...prev, colors: newColors };
		});
	};

	const updateFormWithHighlight = (updates: Partial<typeof form>) => {
		const fieldsToHighlight = Object.keys(updates);

		setForm((prev) => ({ ...prev, ...updates }));
		setUpdatedFields((prev) => {
			const newSet = new Set(prev);
			for (const field of fieldsToHighlight) {
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

		setIsLoading(true);

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_AI_URL_PRODUCT}/ocr`,
				formData,
			);
			const data = res.data.data;
			const formattedBirth = data.birthYear
				? `${data.birthYear.match(/\d{4}/)?.[0] || ""}-01-01`
				: "";

			const colorMapping: Record<string, DogColor> = {
				베이지: DogColor.BEIGE,
				갈색: DogColor.BROWN,
				갈: DogColor.BROWN,
				흰색: DogColor.WHITE,
				흰: DogColor.WHITE,
				회색: DogColor.GRAY,
				회: DogColor.GRAY,
				검정색: DogColor.BLACK,
				검정: DogColor.BLACK,
				검: DogColor.BLACK,
			};

			const detectedColors: DogColor[] = [];
			if (data.color) {
				const colorStr = data.color.toLowerCase();
				for (const [key, value] of Object.entries(colorMapping)) {
					if (colorStr.includes(key.toLowerCase())) {
						detectedColors.push(value);
					}
				}
			}

			const detectedGender = data.gender
				? GenderFromLabel[data.gender]
				: undefined;
			const detectedBreed = data.subType
				? DogBreedFromLabel[data.subType]
				: undefined;

			setOcrDetectedFields({
				gender: detectedGender,
				colors: detectedColors.length > 0 ? detectedColors : undefined,
				neutered: data.neutered || undefined,
				breedDetail: detectedBreed,
			});

			updateFormWithHighlight({
				gender: detectedGender ?? form.gender,
				neutered: data.neutered ?? "",
				colors:
					detectedColors.length > 0 ? detectedColors : form.colors,
				birth: formattedBirth ?? "",
				breed: data.animalType ?? "",
				breedDetail: detectedBreed ?? form.breedDetail,
				weight: data.weight ?? "",
				features: data.features ?? "",
			});

			toast.success("견적 정보가 업데이트되었습니다");
		} catch (error) {
			toast.error("이미지 분석 중 오류가 발생했습니다");
			console.error("OCR 처리 오류:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const ocrAutoInputRef = useRef<HTMLInputElement>(null);
	const triggerAutoOCR = () => {
		ocrAutoInputRef.current?.click();
	};

	const ocrHighlightClass = "ring-2 ring-green-400";

	const isFieldDetected = (fieldName: string): boolean => {
		switch (fieldName) {
			case "gender":
				return ocrDetectedFields.gender !== undefined;
			case "colors":
				return ocrDetectedFields.colors !== undefined;
			case "neutered":
				return ocrDetectedFields.neutered !== undefined;
			case "breedDetail":
				return (
					ocrDetectedFields.breedDetail !== undefined ||
					updatedFields.has("breedDetail")
				);
			case "birth":
				return updatedFields.has("birth") && form.birth !== "";
			case "weight":
				return updatedFields.has("weight") && form.weight !== "";
			case "features":
				return updatedFields.has("features") && form.features !== "";
			default:
				return (
					updatedFields.has(fieldName) &&
					form[fieldName as keyof typeof form] !== ""
				);
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const isValueDetected = (fieldName: string, value: any): boolean => {
		switch (fieldName) {
			case "gender":
				return ocrDetectedFields.gender === value;
			case "colors":
				return (
					ocrDetectedFields.colors?.includes(value as DogColor) ||
					false
				);
			case "neutered":
				return ocrDetectedFields.neutered === value;
			case "breedDetail":
				return ocrDetectedFields.breedDetail === value;
			case "breed":
				return updatedFields.has("breed");
			default:
				return false;
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const getHighlightClass = (fieldName: string, value?: any) => {
		if (value !== undefined) {
			return isValueDetected(fieldName, value) ? ocrHighlightClass : "";
		}

		return isFieldDetected(fieldName) ? ocrHighlightClass : "";
	};

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
		if (!form.weight) {
			toast("무게를 입력해주세요.");
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
		if (form.colors.length === 0) {
			toast("색상을 최소 하나 이상 선택해주세요.");
			return;
		}

		const requestData = {
			status: form.status,
			centerId: selectedCenter.centerId,
			name: form.name,
			breed: form.breedDetail,
			color: form.colors.map((color) => DogColorLabel[color]),
			rescuedDate: form.rescueDate ? `${form.rescueDate}T00:00:00` : null,
			weight: form.weight ? Number(form.weight) : null,
			description: form.features || null,
			isStar: form.isStar ?? false,
			gender: form.gender,
			isNeutered: form.neutered === "O",
			birth: form.birth ? `${form.birth}T00:00:00` : null,
			locationId: form.locationId || -1,
		};

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
		<div className="flex flex-col gap-6 p-4 text-base text-grayText bg-white max-w-md mx-auto pb-30">
			{isLoading && (
				<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-male" />
						<p className="text-sm text-gray-600">
							이미지를 분석중입니다...
						</p>
					</div>
				</div>
			)}
			<h3 className="text-xl font-bold text-black">강아지 등록</h3>

			<div className="flex flex-col gap-3">
				<label className="w-full h-56 bg-gray-100 rounded-xl flex justify-center items-center cursor-pointer overflow-hidden shadow-sm transition-all hover:shadow-md relative">
					{profilePreview ? (
						<>
							<img
								src={profilePreview}
								alt="preview"
								className="object-cover w-full h-full"
							/>
							<div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
								탭하여 변경
							</div>
						</>
					) : (
						<div className="flex flex-col items-center gap-2 text-gray-400">
							<span className="text-4xl">＋</span>
							<span className="text-sm flex gap-1">
								아이 사진 추가하기
								<span className="text-red-500">*</span>
							</span>
						</div>
					)}
					<input
						type="file"
						accept="image/*"
						onChange={handleProfileImageChange}
						className="hidden"
					/>
				</label>
			</div>

			<div className="flex flex-col gap-5">
				<div className="border-b pb-1 flex items-center justify-between">
					<h2 className="text-black text-lg font-bold">견적사항</h2>
					<span className="text-xs text-gray-400">
						* 필수 입력사항
					</span>
				</div>
				<input
					ref={ocrAutoInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleOCRImageAuto}
				/>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<button
							type="button"
							className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-800 text-white rounded-lg font-medium text-sm shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-white"
								aria-hidden="true"
							>
								<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
								<polyline points="10 17 15 12 10 7" />
								<line x1="15" x2="3" y1="12" y2="12" />
							</svg>
							AI 로 아이 정보 등록
						</button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader className="text-start">
							<DialogTitle>AI 이미지 분석 가이드</DialogTitle>
							<DialogDescription>
								아래 예시와 같이 아이의 정보가 담긴 사진을
								등록하면 자동으로 정보를 분석해드립니다.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 pb-2">
							<div className="space-y-2">
								<h4 className="font-medium text-sm">
									이미지 예시
								</h4>
								<div className="relative w-full overflow-hidden rounded-lg border bg-gray-100">
									<img
										src="/dog-ai-example.jpg"
										alt="AI 분석 가이드 이미지"
										className="object-cover w-full"
									/>
								</div>
							</div>
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
								<h4 className="font-medium text-sm text-yellow-800 mb-1">
									주의사항
								</h4>
								<p className="text-sm text-yellow-700">
									AI 분석의 정확도는 100%가 아닙니다. 분석되지
									않은 정보나 잘못 분석된 정보는 직접
									입력해주세요!
								</p>
							</div>
						</div>
						<div className="flex justify-end">
							<button
								type="button"
								onClick={() => {
									setIsDialogOpen(false);
									triggerAutoOCR();
								}}
								className="bg-male text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-male/90 transition-colors"
							>
								이미지 선택하고 분석 시작하기
							</button>
						</div>
					</DialogContent>
				</Dialog>

				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						<label
							htmlFor="dog-name"
							className="font-medium text-sm text-black"
						>
							아이 이름 <span className="text-red-500">*</span>
						</label>
						<div className="flex items-center gap-2">
							<input
								id="dog-name"
								value={form.name}
								onChange={(e) =>
									setForm({ ...form, name: e.target.value })
								}
								className={cn(
									"border text-grayText bg-white px-3 py-2 flex-1 rounded-lg text-base",
									getHighlightClass("name"),
								)}
								placeholder="이름을 입력하세요"
							/>
							{/* <button
								type="button"
								className="px-3 py-2 bg-gradient-to-r from-green-400 to-blue-800 text-white rounded-lg text-xs whitespace-nowrap"
							>
								AI 생성
							</button> */}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<fieldset className="flex flex-col gap-2">
							<legend className="font-medium text-sm text-black mb-1">
								성별 <span className="text-red-500">*</span>
							</legend>
							<div className="grid grid-cols-2 gap-2 p-0.5 bg-gray-100 rounded-lg">
								{Object.values(Gender).map((g) => (
									<button
										key={g}
										type="button"
										onClick={() =>
											setForm({ ...form, gender: g })
										}
										className={cn(
											"py-2.5 rounded-md text-center transition-all duration-200 text-base font-medium",
											form.gender === g
												? g === Gender.FEMALE
													? "bg-female text-white shadow-sm"
													: "bg-male text-white shadow-sm"
												: "bg-transparent text-gray-500 hover:bg-gray-50",
											getHighlightClass("gender", g),
										)}
									>
										{g === Gender.MALE ? "남아" : "여아"}
									</button>
								))}
							</div>
						</fieldset>
					</div>

					<div className="flex flex-col gap-2">
						<fieldset className="flex flex-col gap-2">
							<legend className="font-medium text-sm text-black mb-1">
								별 여부
							</legend>
							<div className="flex items-center gap-4">
								<div
									role="switch"
									tabIndex={0}
									aria-checked={form.isStar}
									className={cn(
										"relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
										form.isStar
											? "bg-blue-300"
											: "bg-gray-200",
									)}
									onClick={() =>
										setForm((prev) => ({
											...prev,
											isStar: !prev.isStar,
											locationId: !prev.isStar
												? -1
												: prev.locationId,
										}))
									}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" ||
											e.key === " "
										) {
											e.preventDefault();
											setForm((prev) => ({
												...prev,
												isStar: !prev.isStar,
												locationId: !prev.isStar
													? -1
													: prev.locationId,
											}));
										}
									}}
								>
									<span
										className={cn(
											"pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
											form.isStar
												? "translate-x-7"
												: "translate-x-0.5",
											getHighlightClass("isStar"),
										)}
										style={{ marginTop: "2px" }}
									/>
								</div>
								<span className="text-sm">
									{form.isStar
										? "별이 되었습니다"
										: "별이 되지 않았습니다"}
								</span>
							</div>
						</fieldset>
					</div>

					<div className="flex flex-col gap-2">
						<fieldset className="flex flex-col gap-2">
							<legend className="font-medium text-sm text-black mb-1">
								소속 위치<span className="text-red-500">*</span>
							</legend>
							{form.isStar ? (
								<div className="w-full py-2.5 rounded-lg text-center bg-indigo-400 text-white opacity-60">
									별<span className="text-red-500">*</span>
								</div>
							) : (
								<Select
									value={String(form.locationId)}
									onValueChange={(val) =>
										setForm({
											...form,
											locationId: Number(val),
										})
									}
									disabled={form.isStar}
								>
									<SelectTrigger
										className={cn(
											"w-full py-2.5 text-base rounded-lg",
											getHighlightClass("locationId"),
										)}
									>
										<SelectValue placeholder="소속 위치를 선택하세요" />
									</SelectTrigger>
									<SelectContent className="text-base">
										{addressBook?.map(
											({ id, addressName }) => (
												<SelectItem
													key={id}
													value={String(id)}
												>
													{addressName}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							)}
						</fieldset>
					</div>

					<div className="flex flex-col gap-2">
						<fieldset className="flex flex-col gap-2">
							<legend className="font-medium text-sm text-black mb-1">
								보호상태 <span className="text-red-500">*</span>
							</legend>
							<div className="grid grid-cols-2 gap-2 p-0.5 bg-gray-100 rounded-lg">
								{Object.values(DogStatus).map((s) => (
									<button
										key={s}
										type="button"
										onClick={() =>
											setForm({ ...form, status: s })
										}
										className={cn(
											"py-2.5 rounded-md text-center transition-all duration-200 text-sm",
											form.status === s
												? "bg-blue-300 text-white shadow-sm"
												: "bg-transparent text-gray-500 hover:bg-gray-50",
										)}
									>
										{DogStatusLabel[s]}
									</button>
								))}
							</div>
						</fieldset>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="dog-birth"
							className="font-medium text-sm text-black"
						>
							출생년도<span className="text-red-500">*</span>
						</label>
						<input
							id="dog-birth"
							type="date"
							value={form.birth}
							onChange={(e) =>
								setForm({ ...form, birth: e.target.value })
							}
							className={cn(
								"border px-3 py-2.5 rounded-lg w-full text-base",
								getHighlightClass("birth"),
							)}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="dog-breed"
							className="font-medium text-sm text-black"
						>
							종<span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<Select
								value={form.breedDetail}
								onValueChange={(val) =>
									setForm({
										...form,
										breedDetail: val as DogBreed,
									})
								}
							>
								<SelectTrigger
									className={cn(
										"w-full py-2.5 text-base rounded-lg",
										getHighlightClass("breedDetail"),
									)}
								>
									<SelectValue placeholder="종을 선택하세요" />
								</SelectTrigger>
								<SelectContent className="text-base">
									{Object.values(DogBreed).map((b) => (
										<SelectItem key={b} value={b}>
											{DogBreedLabel[b]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="dog-weight"
							className="font-medium text-sm text-black"
						>
							무게<span className="text-red-500">*</span>
						</label>
						<div className="flex items-center">
							<input
								id="dog-weight"
								type="number"
								value={form.weight}
								onChange={(e) =>
									setForm({ ...form, weight: e.target.value })
								}
								className={cn(
									"border px-3 py-2.5 rounded-lg flex-1 text-base",
									getHighlightClass("weight"),
								)}
								placeholder="kg"
							/>
							<span className="text-sm ml-2">kg</span>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<fieldset className="flex flex-col gap-2">
							<legend className="font-medium text-sm text-black mb-1">
								색상 <span className="text-red-500">*</span>
							</legend>
							<div className="grid grid-cols-3 gap-2">
								{Object.values(DogColor).map((color) => (
									<button
										key={color}
										type="button"
										onClick={() => toggleColor(color)}
										aria-pressed={form.colors.includes(
											color,
										)}
										className={cn(
											"py-2.5 rounded-lg cursor-pointer transition-all text-center",
											DogColorBgClass[color],
											form.colors.includes(color)
												? "ring-2 ring-blue-500 scale-[1.02] shadow-md"
												: "opacity-70 hover:opacity-100",
											color === DogColor.WHITE ||
												color === DogColor.BEIGE
												? "text-gray-800"
												: "text-white",
											getHighlightClass("colors", color),
										)}
									>
										{DogColorLabel[color]}
										{form.colors.includes(color) && (
											<span className="ml-1">✓</span>
										)}
									</button>
								))}
							</div>
							{form.colors.length > 0 && (
								<div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
									<span>선택된 색상:</span>
									{form.colors.map((c, i) => (
										<span
											key={c}
											className="bg-gray-100 px-1.5 py-0.5 rounded-full"
										>
											{DogColorLabel[c]}
											{i < form.colors.length - 1
												? ""
												: ""}
										</span>
									))}
								</div>
							)}
						</fieldset>
					</div>

					<div className="flex flex-col gap-2">
						<fieldset className="flex flex-col gap-2">
							<legend className="font-medium text-sm text-black mb-1">
								중성화 <span className="text-red-500">*</span>
							</legend>
							<div className="grid grid-cols-2 gap-2 p-0.5 bg-gray-100 rounded-lg">
								{["O", "X"].map((val) => (
									<button
										key={val}
										type="button"
										onClick={() =>
											setForm({ ...form, neutered: val })
										}
										className={cn(
											"py-2.5 rounded-md text-center transition-all duration-200 text-lg font-medium",
											form.neutered === val
												? "bg-blue-300 text-white shadow-sm"
												: "bg-transparent text-gray-500 hover:bg-gray-50",
											getHighlightClass("neutered", val),
										)}
									>
										{val}
									</button>
								))}
							</div>
						</fieldset>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="rescue-date"
							className="font-medium text-sm text-black"
						>
							구조일시
						</label>
						<input
							id="rescue-date"
							type="date"
							value={form.rescueDate}
							onChange={(e) =>
								setForm({ ...form, rescueDate: e.target.value })
							}
							className="border px-3 py-2.5 rounded-lg w-full text-base"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="dog-features"
							className="font-medium text-sm text-black"
						>
							특이사항
						</label>
						<textarea
							id="dog-features"
							value={form.features}
							onChange={(e) =>
								setForm({ ...form, features: e.target.value })
							}
							placeholder="특이사항을 입력해주세요"
							className={cn(
								"border w-full h-28 p-3 rounded-lg text-base resize-none",
								getHighlightClass("features"),
							)}
						/>
					</div>
				</div>
			</div>

			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
				<button
					type="button"
					onClick={handleSubmit}
					className="w-full py-3.5 bg-male text-white rounded-xl font-bold text-base shadow-md active:scale-[0.98] transition-transform"
				>
					등록하기
				</button>
			</div>
		</div>
	);
}
