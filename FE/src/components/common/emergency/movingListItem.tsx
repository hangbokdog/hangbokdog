import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import type { ReactNode } from "react";

interface MovingListItemProps {
	img: string;
	name: string;
	title: string;
	date: ReactNode;
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
			} text-grayText text-sm font-medium`}
		>
			<div className="flex flex-2/3 overflow-hidden flex-col">
				<div className="flex items-center gap-2">
					<span className="flex items-center gap-2">
						<Avatar className="w-6 h-6">
							<AvatarImage src={img} className="object-cover" />
							<AvatarFallback>{name.charAt(0)}</AvatarFallback>
						</Avatar>
					</span>
					<span className="text-xs items-center">{name}</span>
				</div>
				<div className="text-start flex-1 truncate pl-8">{title}</div>
			</div>
			<div className="flex flex-1/3 items-center gap-2 justify-end">
				{date}
				{isManagement && (
					<MoreVertical className="w-4 h-4 text-blueGray" />
				)}
			</div>
		</button>
	);
}
