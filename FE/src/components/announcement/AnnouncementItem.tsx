import type { AnnouncementResponse } from "@/api/announcement";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
				<div
					className={`flex items-center ${compact ? "text-xs" : "text-sm"} text-gray-500`}
				>
					<div className="flex items-center gap-2">
						<Avatar className="w-6 h-6">
							<AvatarImage
								src={announcement.authorImage}
								className="object-cover"
							/>
							<AvatarFallback className="bg-superLightBlueGray">
								{announcement.authorName}
							</AvatarFallback>
						</Avatar>
						<span className="text-grayText">
							{announcement.authorName
								? announcement.authorName
								: "이름없음"}
						</span>
						<span
							className={`${compact ? "mx-1" : "mx-2"} ${compact ? "" : "text-gray-300"}`}
						>
							{compact ? "•" : "|"}
						</span>
						<span>{formatDate(announcement.createdAt)}</span>
					</div>
				</div>
				<div className="flex items-center mb-2 pl-8">
					<span
						className={`${compact ? "text-sm" : "text-base"} font-medium text-gray-800 w-[80%] overflow-hidden text-ellipsis`}
					>
						{announcement.title}
					</span>
				</div>
			</div>
		</button>
	);
}
