import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VolunteerListItemProps {
	img: string;
	name: string;
	title: string;
	target: number;
	date: string;
	index: number;
	emergencyId: number;
	onClick: (emergencyId: number) => void;
}

export default function VolunteerListItem(props: VolunteerListItemProps) {
	const { img, name, title, target, date, index, emergencyId, onClick } =
		props;

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
			<div className="flex-1 text-center">{target} 명</div>
			<div className="w-16 text-right font-light text-[var(--color-blueGray)]">
				{date}
			</div>
		</button>
	);
}
