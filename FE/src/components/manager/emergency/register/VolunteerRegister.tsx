import { useState } from "react";
import { CalendarIcon, SearchIcon } from "lucide-react";

export default function VolunteerRegister() {
	const [formData, setFormData] = useState({
		title: "",
		targetPeople: "",
		location: "",
		date: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("제출된 데이터:", formData);
		// 여기에 데이터 제출 로직 추가
	};

	return (
		<div className="max-w-md mx-auto p-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* 제목(사유) 필드 */}
				<div>
					<label
						htmlFor="title"
						className="block text-gray-700 text-lg font-medium mb-2"
					>
						제목(사유)
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className="w-full border rounded-xl border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* 목표 인원 필드 */}
				<div>
					<label
						htmlFor="targetPeople"
						className="block text-gray-700 text-lg font-medium mb-2"
					>
						목표 인원
					</label>
					<div className="flex items-center">
						<input
							type="text"
							id="targetPeople"
							name="targetPeople"
							value={formData.targetPeople}
							onChange={handleChange}
							className="w-24 border rounded-xl border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<span className="ml-2 text-gray-700">명</span>
					</div>
				</div>

				{/* 위치 필드 */}
				<div>
					<label
						htmlFor="location"
						className="block text-gray-700 text-lg font-medium mb-2"
					>
						위치
					</label>
					<div className="relative">
						<input
							type="text"
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							className="w-full border rounded-xl border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="absolute right-2 top-1/2 transform -translate-y-1/2"
							onClick={() => console.log("현위치 검색")}
							aria-label="현위치 검색"
						>
							<SearchIcon className="h-5 w-5 text-gray-500" />
						</button>
					</div>
				</div>

				{/* 일시 필드 */}
				<div>
					<label
						htmlFor="date"
						className="block text-gray-700 text-lg font-medium mb-2"
					>
						일시
					</label>
					<div className="relative">
						<input
							type="text"
							id="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							className="w-full border rounded-xl border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="absolute right-2 top-1/2 transform -translate-y-1/2"
							onClick={() => console.log("달력 열기")}
							aria-label="달력 열기"
						>
							<CalendarIcon className="h-5 w-5 text-gray-500" />
						</button>
					</div>
				</div>

				{/* 등록 버튼 */}
				<div className="pt-4">
					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-full transition duration-200"
					>
						등록하기
					</button>
				</div>
			</form>
		</div>
	);
}
