import { useRef, useState } from "react";
import axios from "axios";

const colors = ["검", "흰", "갈"];
const genders = ["수컷", "암컷"];
const statuses = ["보호중", "임시보호", "병원", "입원"];

export default function DogRegisterPage() {
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [form, setForm] = useState({
		name: "",
		gender: "",
		status: "",
		age: "",
		breed: "",
		breedDetail: "",
		weight: "",
		color: "",
		neutered: "",
		features: "",
		rescueDate: "",
		foundLocation: "",
		shelter: "",
		medDate: "",
		medInfo: "",
		medNotes: "",
	});

	// 이미지 미리보기 (프로필)
	const handleProfileImageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (file) setProfilePreview(URL.createObjectURL(file));
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
		setForm((prev) => ({
			...prev,
			gender: data.gender ?? "",
			neutered: data.neutered ?? "",
			color: data.color ?? "",
			age: getAgeFromYear(data.birthYear ?? ""),
			breed: data.animalType ?? "",
			breedDetail: data.subType ?? "",
			weight: data.weight ?? "",
			features: data.features ?? "",
		}));
	};

	const ocrAutoInputRef = useRef<HTMLInputElement>(null);
	const triggerAutoOCR = () => {
		ocrAutoInputRef.current?.click();
	};

	const getAgeFromYear = (birthYear: string): string => {
		const match = birthYear.match(/\d{4}/);
		if (!match) return "";
		const year = Number.parseInt(match[0]);
		const now = new Date().getFullYear();
		const age = now - year;
		if (age < 0 || age > 30) return "";
		return age.toString(); // 숫자 나이로 변환해서 저장
	};

	return (
		<div className="flex flex-col gap-5 p-4 text-sm text-grayText bg-white">
			{/* 프로필 이미지 */}
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

			{/* 이름 + AI 버튼 */}
			<div className="flex items-center gap-2">
				<label htmlFor="dog-name" className="w-20">
					아이 이름
				</label>
				<input
					id="dog-name"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					className="border px-2 py-1 flex-1 rounded"
				/>
				<button
					type="button"
					className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-800 text-white rounded text-xs"
				>
					AI 생성
				</button>
			</div>

			{/* 성별 */}
			<div className="flex gap-2 items-center">
				<label htmlFor="gender" className="w-20">
					성별
				</label>
				{genders.map((g) => (
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
									? "bg-sky-400 text-white"
									: "bg-gray-200"
							}`}
						>
							{g === "수컷" ? "남아" : "여아"}
						</label>
					</div>
				))}
			</div>

			{/* 보호상태 */}
			<div className="flex gap-2 items-center">
				<label htmlFor="status" className="w-20">
					보호상태
				</label>
				{statuses.map((s) => (
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
							className={`px-3 py-1 rounded-full cursor-pointer ${form.status === s ? "bg-blue-300 text-white" : "bg-gray-200"}`}
						>
							{s}
						</label>
					</div>
				))}
			</div>

			{/* 나이*/}
			<div className="flex items-center gap-2">
				<label htmlFor="dog-age" className="w-20">
					나이
				</label>
				<input
					id="dog-age"
					type="number"
					value={form.age}
					onChange={(e) => setForm({ ...form, age: e.target.value })}
					className="border px-2 py-1 rounded w-18"
				/>
				<span className="text-sm">살</span>
			</div>

			<div className="flex items-center gap-2">
				<label htmlFor="dog-breed" className="w-20">
					종
				</label>
				<input
					id="dog-breed"
					value={form.breedDetail}
					onChange={(e) =>
						setForm({ ...form, breedDetail: e.target.value })
					}
					className="border px-2 py-1 rounded flex-1"
				/>
			</div>

			{/* 무게 */}
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
					className="border px-2 py-1 rounded w-18"
				/>
				<span className="text-sm">kg</span>
			</div>

			{/* 색상 */}
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
							}`}
						>
							{c}
						</label>
					</div>
				))}
			</div>

			{/* 중성화 */}
			<div className="flex gap-2 items-center">
				<label htmlFor="neutered" className="w-20">
					중성화
				</label>
				<input
					type="radio"
					id="neutered-o"
					name="neutered"
					value="O"
					checked={form.neutered === "O"}
					onChange={() => setForm({ ...form, neutered: "O" })}
					className="hidden"
				/>
				<label
					htmlFor="neutered-o"
					className={`px-4 py-1 rounded-full cursor-pointer ${form.neutered === "O" ? "bg-sky-400 text-white" : "bg-gray-200"}`}
				>
					O
				</label>
				<input
					type="radio"
					id="neutered-x"
					name="neutered"
					value="X"
					checked={form.neutered === "X"}
					onChange={() => setForm({ ...form, neutered: "X" })}
					className="hidden"
				/>
				<label
					htmlFor="neutered-x"
					className={`px-4 py-1 rounded-full cursor-pointer ${form.neutered === "X" ? "bg-sky-400 text-white" : "bg-gray-200"}`}
				>
					X
				</label>
			</div>

			{/* 특이사항 */}
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
					className="border w-full h-24 p-2 rounded"
				/>
			</div>

			<span className="text-black text-lg font-bold">기타</span>

			{/* 구조, 보호, 발견 */}
			<div className="flex flex-col gap-2">
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
				<div className="flex gap-2 items-center">
					<label htmlFor="found-location" className="w-20">
						발견장소
					</label>
					<input
						id="found-location"
						value={form.foundLocation}
						onChange={(e) =>
							setForm({ ...form, foundLocation: e.target.value })
						}
						className="border p-1 rounded flex-1"
					/>
				</div>
				<div className="flex gap-2 items-center">
					<label htmlFor="shelter" className="w-20">
						보호소
					</label>
					<input
						id="shelter"
						value={form.shelter}
						onChange={(e) =>
							setForm({ ...form, shelter: e.target.value })
						}
						className="border p-1 rounded flex-1"
					/>
				</div>
			</div>

			{/* 투약정보 */}
			<div className="flex flex-col gap-2">
				<div className="flex gap-2 items-center">
					<label htmlFor="med-date" className="w-20">
						투약일시
					</label>
					<input
						id="med-date"
						type="date"
						value={form.medDate}
						onChange={(e) =>
							setForm({ ...form, medDate: e.target.value })
						}
						className="border p-1 rounded"
					/>
				</div>
				<div className="flex gap-2 items-center">
					<label htmlFor="med-info" className="w-20">
						투약정보
					</label>
					<input
						id="med-info"
						value={form.medInfo}
						onChange={(e) =>
							setForm({ ...form, medInfo: e.target.value })
						}
						className="border p-1 rounded flex-1"
					/>
				</div>
				<div className="flex gap-2 items-center">
					<label htmlFor="med-notes" className="w-20">
						특이사항
					</label>
					<input
						id="med-notes"
						value={form.medNotes}
						onChange={(e) =>
							setForm({ ...form, medNotes: e.target.value })
						}
						className="border p-1 rounded flex-1"
					/>
				</div>
			</div>

			{/* 등록 버튼 */}
			<button
				type="button"
				className="mt-4 w-full py-2 bg-male text-white rounded-full font-bold"
			>
				등록하기
			</button>
		</div>
	);
}
