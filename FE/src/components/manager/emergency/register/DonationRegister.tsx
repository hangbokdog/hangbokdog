import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCenterStore from "@/lib/store/centerStore";
import { createDonationPostAPI } from "@/api/emergencyRegister";
import { type DonationRequest, TargetGrade } from "@/types/emergencyRegister";
import TargetGradeTag from "./TargetGradeTag";
import { toast } from "sonner";

export default function DonationRegister() {
	const [formData, setFormData] = useState<DonationRequest>({
		title: "",
		content: "",
		dueDate: "",
		targetAmount: 0,
		targetGrade: TargetGrade.ALL,
	});

	const navigate = useNavigate();
	// 선택된 센터 정보를 가져오기
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
			toast("센터 정보가 없습니다.");
			return;
		}

		// 제목
		if (!formData.title.trim()) {
			toast("제목을 입력해주세요.");
			return;
		}

		// 내용(사유)
		if (!formData.content.trim()) {
			toast("사유를 입력해주세요.");
			return;
		}

		// 목표 금액 (포함)
		if (formData.targetAmount <= 0) {
			toast("목표 금액은 1원 이상이어야 합니다.");
			return;
		}

		// 일시
		if (!formData.dueDate) {
			toast("일시를 선택해주세요.");
			return;
		}

		try {
			await createDonationPostAPI(centerId, {
				...formData,
				dueDate: `${formData.dueDate}T00:00:00`,
			});
			toast("후원 게시글이 등록되었습니다!");
			navigate("/manager/emergency");
			// 초기화
			setFormData({
				title: "",
				content: "",
				dueDate: "",
				targetAmount: 0,
				targetGrade: TargetGrade.ALL,
			});
		} catch (err) {
			console.error("등록 실패:", err);
			toast("등록에 실패했습니다.");
		}
	};

	// TargetGrade 선택 처리 함수
	const handleGradeChange = (grade: TargetGrade) => {
		setFormData((prev) => ({ ...prev, targetGrade: grade }));
	};

	return (
		<div className="max-w-md mx-auto px-0 py-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="text-gray-700 mx-2.5 text-lg font-medium">
					알림 대상
				</div>
				<div className="flex gap-2 mx-2.5 mb-4">
					{(Object.values(TargetGrade) as TargetGrade[]).map(
						(grade) => (
							<TargetGradeTag
								key={grade}
								grade={grade}
								selected={formData.targetGrade === grade}
								onClick={handleGradeChange}
							/>
						),
					)}
				</div>
				{/* 제목 */}
				<Field
					label="제목"
					name="title"
					value={formData.title}
					onChange={handleChange}
				/>

				{/* 일시 */}
				<Field
					label="일시"
					name="dueDate"
					value={formData.dueDate}
					onChange={handleChange}
					type="date"
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

				{/* 사유 */}
				<Field
					label="사유"
					name="content"
					value={formData.content}
					onChange={handleChange}
					type="textarea"
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
		<div className="mx-2.5">
			<label
				htmlFor={name}
				className="block text-gray-700 text-lg font-medium mb-2"
			>
				{label}
			</label>
			<div className="relative">
				{type === "textarea" ? (
					<textarea
						id={name}
						name={name}
						value={value}
						onChange={onChange}
						rows={4}
						className="w-full border bg-background rounded-xl border-gray-300 p-2 pr-4"
					/>
				) : (
					<input
						type={type}
						id={name}
						name={name}
						value={value}
						onChange={onChange}
						className="w-full border bg-background rounded-xl border-gray-300 p-2 pr-4"
					/>
				)}
			</div>
		</div>
	);
}
