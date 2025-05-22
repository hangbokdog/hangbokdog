import { TargetGrade } from "@/types/emergencyRegister";

interface TargetGradeTagProps {
	grade: TargetGrade;
	selected: boolean;
	onClick: (grade: TargetGrade) => void;
}

export default function TargetGradeTag({
	grade,
	selected,
	onClick,
}: TargetGradeTagProps) {
	const gradeConfig = {
		[TargetGrade.ALL]: "전체",
		[TargetGrade.USER]: "사용자",
		[TargetGrade.MANAGER]: "관리자",
	} as const;

	const bgColor = selected ? "bg-main" : "bg-lightGray";

	return (
		<button
			type="button"
			onClick={() => onClick(grade)}
			className={`px-4 py-1 text-sm text-white rounded-full ${bgColor}`}
		>
			{gradeConfig[grade]}
		</button>
	);
}
