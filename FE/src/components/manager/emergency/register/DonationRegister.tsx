import { useState } from "react";
import { CalendarIcon } from "lucide-react";

export default function DonationRegister() {
	const [formData, setFormData] = useState({
		title: "",
		targetAmount: "",
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

				{/* 목표 금액 필드 */}
				<div>
					<label
						htmlFor="targetAmount"
						className="block text-gray-700 text-lg font-medium mb-2"
					>
						목표 금액
					</label>
					<div className="flex items-center">
						<input
							type="text"
							id="targetAmount"
							name="targetAmount"
							value={formData.targetAmount}
							onChange={handleChange}
							className="w-48 border rounded-xl border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<span className="ml-2 text-gray-700">원</span>
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
							className="w-full border rounded-xl border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

				{/* 등록 버튼 */}
				<div className="pt-4 mt-40">
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
