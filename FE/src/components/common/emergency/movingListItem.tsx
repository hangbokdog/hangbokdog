import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";

interface MovingListItemProps {
	img: string;
	name: string;
	title: string;
	date: string;
	index: number;
	emergencyId: number;
	onClick: (emergencyId: number) => void;
	isManagement?: boolean;
}

export default function MovingListItem(props: MovingListItemProps) {
	const {
		img,
		name,
		title,
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
			<div className="text-start flex-1 truncate px-2">{title}</div>
			<div className="flex items-center gap-2">
				<div className="text-right w-16 font-light text-[var(--color-blueGray)]">
					{date}
				</div>
				{isManagement && (
					<MoreVertical className="w-4 h-4 text-blueGray" />
				)}
			</div>
		</button>
	);
}
