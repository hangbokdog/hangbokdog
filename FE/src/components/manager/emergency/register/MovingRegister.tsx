import { useState } from "react";
import { createTransportPostAPI } from "@/api/emergencyRegister";
import useCenterStore from "@/lib/store/centerStore";

export default function MovingRegister() {
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		dueDate: "",
		targetGrade: "ALL",
	});

	const { selectedCenter } = useCenterStore();
	const centerId = Number(selectedCenter?.centerId);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!centerId) {
			alert("센터 정보가 없습니다.");
			return;
		}

		try {
			await createTransportPostAPI(centerId, {
				title: formData.title,
				content: formData.content,
				dueDate: new Date(formData.dueDate).toISOString(),
				targetGrade: "ALL",
			});
			alert("운송 게시글이 등록되었습니다!");

			// 입력값 초기화
			setFormData({
				title: "",
				content: "",
				dueDate: "",
				targetGrade: "ALL",
			});
		} catch (err) {
			console.error("등록 실패:", err);
			alert("등록에 실패했습니다.");
		}
	};

	return (
		<div className="max-w-md mx-auto px-0 py-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* 제목 */}
				<Field
					label="제목"
					name="title"
					value={formData.title}
					onChange={handleChange}
				/>

				{/* 이동 일시 */}
				<Field
					label="이동 일시"
					name="dueDate"
					value={formData.dueDate}
					onChange={handleChange}
				/>

				{/* 사유 (content) */}
				<div className="mx-2.5">
					<label
						htmlFor="content"
						className="block text-gray-700 text-lg font-medium mb-2"
					>
						사유
					</label>
					<textarea
						name="content"
						id="content"
						value={formData.content}
						onChange={handleChange}
						rows={6}
						className="w-full border rounded-xl border-gray-300 p-2 focus:outline-none"
					/>
				</div>

				<div className="pt-4">
					<button
						type="submit"
						className="w-full bg-male text-white font-medium py-3 px-4 rounded-full transition"
					>
						등록하기
					</button>
				</div>
			</form>
		</div>
	);
}

// 공통 필드 컴포넌트
function Field({
	label,
	name,
	value,
	onChange,
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div className="mx-2.5">
			<label
				htmlFor={name}
				className="block text-gray-700 text-lg font-medium mb-2"
			>
				{label}
			</label>
			<div className="relative">
				<input
					type={name === "dueDate" ? "date" : "text"}
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className="w-full border bg-background rounded-xl border-gray-300 p-2 pr-4"
				/>
			</div>
		</div>
	);
}
