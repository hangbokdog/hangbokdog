import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";

interface VolunteerListItemProps {
	img: string;
	name: string;
	title: string;
	target: number;
	date: string;
	index: number;
	emergencyId: number;
	onClick: (emergencyId: number) => void;
	isManagement?: boolean;
}

export default function VolunteerListItem(props: VolunteerListItemProps) {
	const {
		img,
		name,
		title,
		target,
		date,
		index,
		emergencyId,
		onClick,
		isManagement,
	} = props;

	return (
		<button
			type="button"
			onClick={() => onClick(emergencyId)}
			className={`w-full text-left flex items-center justify-between rounded-full px-5 py-2 ${
				index % 2 === 1 ? "bg-background" : ""
			} text-grayText text-base font-medium`}
		>
			<div className="flex-1 text-start truncate">{title}</div>
			<div className="flex-1 text-center">{target} 명</div>
			<div className="flex items-center gap-2">
				<div className="w-16 text-right font-light text-[var(--color-blueGray)]">
					{date}
				</div>
				{isManagement && (
					<MoreVertical className="w-4 h-4 text-blueGray" />
				)}
			</div>
		</button>
	);
}
