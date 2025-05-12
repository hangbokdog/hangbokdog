import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import { createDonationPostAPI } from "@/api/emergencyRegister";
import type { DonationRequest } from "@/types/emergencyRegister";

export default function DonationRegister() {
	const [formData, setFormData] = useState<DonationRequest>({
		title: "",
		content: "",
		dueDate: "",
		targetAmount: 0,
		targetGrade: "ALL",
	});

	const { selectedCenter } = useCenterStore();
	const centerId = Number(selectedCenter?.centerId);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "targetAmount" ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!centerId) {
			alert("센터 정보가 없습니다.");
			return;
		}

		try {
			await createDonationPostAPI(centerId, {
				...formData,
				dueDate: new Date(formData.dueDate).toISOString(), // 날짜 포맷 보장
			});
			alert("후원 게시글이 등록되었습니다!");

			// 초기화
			setFormData({
				title: "",
				content: "",
				dueDate: "",
				targetAmount: 0,
				targetGrade: "ALL",
			});
		} catch (err) {
			console.error("등록 실패:", err);
			alert("등록에 실패했습니다.");
		}
	};

	return (
		<div className="max-w-md mx-auto p-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* 제목 */}
				<Field
					label="제목"
					name="title"
					value={formData.title}
					onChange={handleChange}
				/>

				{/* 사유 */}
				<Field
					label="사유"
					name="content"
					value={formData.content}
					onChange={handleChange}
					type="textarea"
				/>

				{/* 목표 금액 */}
				<Field
					label="목표 금액"
					name="targetAmount"
					value={formData.targetAmount.toString()}
					onChange={handleChange}
					type="number"
					unit="원"
				/>

				{/* 일시 */}
				<Field
					label="일시"
					name="dueDate"
					value={formData.dueDate}
					onChange={handleChange}
					type="date"
					icon={<CalendarIcon className="h-5 w-5 text-gray-500" />}
				/>

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

function Field({
	label,
	name,
	value,
	onChange,
	type = "text",
	unit,
	icon,
}: {
	label: string;
	name: string;
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	type?: string;
	unit?: string;
	icon?: React.ReactNode;
}) {
	return (
		<div>
			<label
				htmlFor={name}
				className="block text-gray-700 text-lg font-medium mb-2"
			>
				{label}
			</label>
			<div className="relative flex items-center">
				{type === "textarea" ? (
					<textarea
						id={name}
						name={name}
						value={value}
						onChange={onChange}
						rows={4}
						className="w-full border rounded-xl border-gray-300 p-2 focus:outline-none"
					/>
				) : (
					<input
						type={type}
						id={name}
						name={name}
						value={value}
						onChange={onChange}
						className="w-full border rounded-xl border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				)}
				{unit && (
					<span className="absolute right-3 text-sm text-gray-500">
						{unit}
					</span>
				)}
				{icon && (
					<span className="absolute right-2 top-1/2 transform -translate-y-1/2">
						{icon}
					</span>
				)}
			</div>
		</div>
	);
}
