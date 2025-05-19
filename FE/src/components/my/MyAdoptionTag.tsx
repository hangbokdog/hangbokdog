interface StatusTagProps {
	status: "APPLIED" | "ACCEPTED" | "REJECTED" | "UNDER_REVIEW";
	className?: string;
}

export default function MyAdoptionTag({
	status,
	className = "",
}: StatusTagProps) {
	const statusConfig = {
		APPLIED: { text: "신청됨", bgColor: "bg-yellow-400" },
		ACCEPTED: { text: "승인됨", bgColor: "bg-green-500" },
		REJECTED: { text: "거절됨", bgColor: "bg-red-500" },
		UNDER_REVIEW: { text: "완료됨", bgColor: "bg-gray-400" },
	} as const;

	const { text, bgColor } = statusConfig[status];

	return (
		<span
			className={`px-1.5 text-xs text-white rounded-full ${bgColor} ${className}`}
		>
			{text}
		</span>
	);
}
