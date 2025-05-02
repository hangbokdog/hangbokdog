import { useState } from "react";
import { CalendarIcon } from "lucide-react";

export default function MovingRegister() {
	const [formData, setFormData] = useState({
		id: "",
		currentLocation: "",
		destinationLocation: "",
		date: "",
		reason: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
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
				{/* 아이디 필드 */}
				<div>
					<label
						htmlFor="id"
						className="block text-gray-700 text-sm font-medium mb-2"
					>
						아이
					</label>
					<div className="flex">
						<input
							type="text"
							id="id"
							name="id"
							value={formData.id}
							onChange={handleChange}
							className="flex-grow border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="border border-gray-300 px-4 py-2 ml-1"
							onClick={() => console.log("아이 검색")}
						>
							검색
						</button>
					</div>
				</div>

				{/* 현위치 필드 */}
				<div>
					<label
						htmlFor="currentLocation"
						className="block text-gray-700 text-sm font-medium mb-2"
					>
						현위치
					</label>
					<div className="flex">
						<input
							type="text"
							id="currentLocation"
							name="currentLocation"
							value={formData.currentLocation}
							onChange={handleChange}
							className="flex-grow border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="border border-gray-300 px-4 py-2 ml-1"
							onClick={() => console.log("현위치 검색")}
						>
							검색
						</button>
					</div>
				</div>

				{/* 이동 위치 필드 */}
				<div>
					<label
						htmlFor="destinationLocation"
						className="block text-gray-700 text-sm font-medium mb-2"
					>
						이동 위치
					</label>
					<div className="flex">
						<input
							type="text"
							id="destinationLocation"
							name="destinationLocation"
							value={formData.destinationLocation}
							onChange={handleChange}
							className="flex-grow border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="border border-gray-300 px-4 py-2 ml-1"
							onClick={() => console.log("이동 위치 검색")}
						>
							검색
						</button>
					</div>
				</div>

				{/* 일시 필드 */}
				<div>
					<label
						htmlFor="date"
						className="block text-gray-700 text-sm font-medium mb-2"
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
							className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							className="absolute right-2 top-1/2 transform -translate-y-1/2"
							onClick={() => console.log("달력 열기")}
						>
							<CalendarIcon className="h-5 w-5 text-gray-500" />
						</button>
					</div>
				</div>

				{/* 사유 필드 */}
				<div>
					<label
						htmlFor="reason"
						className="block text-gray-700 text-sm font-medium mb-2"
					>
						사유
					</label>
					<textarea
						id="reason"
						name="reason"
						value={formData.reason}
						onChange={handleChange}
						rows={6}
						className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
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
