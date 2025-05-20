import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCenterStore from "@/lib/store/centerStore";
import { createVolunteerPostAPI } from "@/api/emergencyRegister";
import {
	EmergencyType,
	TargetGrade,
	type VolunteerRequest,
} from "@/types/emergencyRegister";
import TargetGradeTag from "./TargetGradeTag";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function VolunteerRegister() {
	const [formData, setFormData] = useState<VolunteerRequest>({
		title: "",
		content: "",
		dueDate: "",
		capacity: 0,
		targetGrade: TargetGrade.ALL,
	});

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { selectedCenter } = useCenterStore();
	const centerId = Number(selectedCenter?.centerId);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "capacity" ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!centerId) {
			toast("센터 정보가 없습니다.");
			return;
		}

		try {
			await createVolunteerPostAPI(centerId, {
				...formData,
				dueDate: new Date(formData.dueDate).toISOString(), // ISO 포맷 보장
			});
			toast("일손 긴급이 등록되었습니다!");
			navigate(-1);
			// ✅ 캐시된 'emergency-posts' 쿼리를 무효화 → 자동으로 다시 요청됨
			await queryClient.invalidateQueries({
				queryKey: [
					"emergency-posts",
					centerId,
					EmergencyType.VOLUNTEER,
				],
			});

			setFormData({
				title: "",
				content: "",
				dueDate: "",
				capacity: 0,
				targetGrade: TargetGrade.ALL,
			});
		} catch (err) {
			console.error("등록 실패:", err);
			toast("등록에 실패했습니다.");
		}
	};

	const handleGradeChange = (grade: TargetGrade) => {
		setFormData((prev) => ({ ...prev, targetGrade: grade }));
	};

	return (
		<div className="max-w-md mx-auto py-6 px-0">
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

				{/* 목표 인원 */}
				<Field
					label="목표 인원"
					name="capacity"
					value={formData.capacity.toString()}
					onChange={handleChange}
					type="number"
					unit="명"
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
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-full transition"
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
			<div className="relative flex items-center">
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
