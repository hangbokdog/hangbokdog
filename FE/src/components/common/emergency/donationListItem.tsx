import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";

interface DonationListItemProps {
	img: string;
	name: string;
	title: string;
	current: number;
	target: number;
	date: string;
	index: number;
	emergencyId: number;
	onClick: (emergencyId: number) => void;
	isManagement?: boolean;
}

export default function DonationListItem(props: DonationListItemProps) {
	const {
		img,
		name,
		title,
		current,
		target,
		date,
		index,
		emergencyId,
		onClick,
		isManagement,
	} = props;

	const progress = Math.min((current / target) * 100, 100);

	return (
		<button
			type="button"
			onClick={() => onClick(emergencyId)}
			className={`w-full text-left flex items-center justify-between rounded-full px-5 py-2 ${
				index % 2 === 1 ? "bg-background" : ""
			} text-grayText text-base font-medium`}
		>
			<div className="flex-1 text-start truncate">{title}</div>
			{/* <div className="flex-1 pr-2">
				<span>{target}</span>
			</div> */}
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
