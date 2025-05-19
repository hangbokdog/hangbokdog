interface VolunteerTagProps {
	status: "PENDING" | "APPROVED" | "REJECTED" | "NONE" | "COMPLETED";

	className?: string;
}

export default function VolunteerTag({
	status,
	className = "",
}: VolunteerTagProps) {
	const statusConfig = {
		PENDING: { text: "대기중", bgColor: "bg-yellow-400" },
		APPROVED: { text: "승인됨", bgColor: "bg-green-500" },
		REJECTED: { text: "거절됨", bgColor: "bg-red-500" },
		NONE: { text: "없음", bgColor: "bg-gray-400" },
		COMPLETED: { text: "완료됨", bgColor: "bg-red-500" },
	} as const;

	const { text, bgColor } = statusConfig[status];

	return (
		<span
			className={`px-1.5 text-xs text-white rounded-full whitespace-nowrap ${bgColor} ${className}`}
		>
			{text}
		</span>
	);
}
