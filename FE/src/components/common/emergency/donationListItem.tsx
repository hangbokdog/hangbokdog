import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
			<div className="flex items-center gap-2 min-w-0 flex-1">
				<Avatar className="w-6 h-6 flex justify-center items-center">
					<AvatarImage src={img} />
					<AvatarFallback className="bg-superLightGray text-grayText">
						{typeof name === "string" && name.length > 0
							? name[0]
							: "?"}
					</AvatarFallback>
				</Avatar>
				<span className="truncate">{name}</span>
			</div>
			<div className="flex-1 text-center truncate">{title}</div>
			<div className="flex-1 pr-2">
				<div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
					<div
						className="absolute top-0 left-0 h-full bg-[#84A7FB]"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
			<div className="w-16 text-right font-light text-[var(--color-blueGray)]">
				{date}
			</div>
		</button>
	);
}
