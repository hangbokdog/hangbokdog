interface StatusTagProps {
	status:
		| "APPLYING"
		| "ACCEPTED"
		| "REJECTED"
		| "COMPLETED"
		| "CANCELLED"
		| "FOSTERING"
		| "STOPPED";
	className?: string;
}

export default function StatusTag({ status, className = "" }: StatusTagProps) {
	const statusConfig = {
		APPLYING: { text: "신청중", bgColor: "bg-yellow-400" },
		ACCEPTED: { text: "승인됨", bgColor: "bg-green-500" },
		REJECTED: { text: "거절됨", bgColor: "bg-red-500" },
		COMPLETED: { text: "완료됨", bgColor: "bg-gray-400" },
		CANCELLED: { text: "취소됨", bgColor: "bg-red-500" },
		FOSTERING: { text: "임보중", bgColor: "bg-green-500" },
		STOPPED: { text: "종료됨", bgColor: "bg-gray-400" },
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
