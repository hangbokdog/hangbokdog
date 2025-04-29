interface StatusTagProps {
	status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
	className?: string;
}

export default function StatusTag({ status, className = "" }: StatusTagProps) {
	const statusConfig = {
		PENDING: { text: "신청중", bgColor: "bg-yellow-400" },
		APPROVED: { text: "신청완료", bgColor: "bg-green-500" },
		REJECTED: { text: "신청반려", bgColor: "bg-red-500" },
		CANCELLED: { text: "신청취소", bgColor: "bg-gray-400" },
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
