import type { AnnouncementResponse } from "@/api/announcement";

interface AnnouncementItemProps {
	announcement: AnnouncementResponse;
	onClick: (id: number) => void;
	className?: string;
	compact?: boolean;
}

export default function AnnouncementItem({
	announcement,
	onClick,
	className = "",
	compact = false,
}: AnnouncementItemProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
	};

	return (
		<button
			type="button"
			onClick={() => onClick(announcement.id)}
			className={`w-full text-left hover:bg-gray-50 transition-colors ${compact ? "py-2 px-1" : "p-4"} ${className}`}
		>
			<div className="flex flex-col">
				<div className="flex items-center mb-2">
					<span
						className={`${compact ? "text-sm" : "text-lg"} font-medium text-gray-800`}
					>
						{announcement.title}
					</span>
				</div>
				<div
					className={`flex items-center ${compact ? "text-xs" : "text-sm"} text-gray-500`}
				>
					<div className="flex items-center">
						<span className="text-gray-700">
							{announcement.authorName}
						</span>
						<span
							className={`${compact ? "mx-1" : "mx-2"} ${compact ? "" : "text-gray-300"}`}
						>
							{compact ? "•" : "|"}
						</span>
						<span>{formatDate(announcement.createdAt)}</span>
					</div>
				</div>
			</div>
		</button>
	);
}
