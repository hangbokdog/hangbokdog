import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPaw } from "react-icons/fa";

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

	// const progress = Math.min((current / target) * 100, 100);

	return (
		<button
			type="button"
			onClick={() => onClick(emergencyId)}
			className={`w-full text-left flex rounded-full ${index % 2 === 1 ? "bg-background" : ""} text-grayText text-base font-medium items-center px-5 py-1`}
		>
			<div
				className={`flex rounded-full ${index % 2 === 1 && "bg-background"} text-grayText text-base font-medium items-center px-5 py-1`}
			>
				<div className="flex-1 flex items-center gap-2 font-semibold">
					<Avatar className="w-6 h-6 flex justify-center items-center">
						<AvatarImage src={img} />
						<AvatarFallback className="text-center bg-superLightGray text-grayText">
							{typeof name === "string" && name.length > 0
								? name[0]
								: "?"}
						</AvatarFallback>
					</Avatar>
					<span className="whitespace-nowrap truncate flex-shrink-0">
						{name}
					</span>
					<FaPaw />
				</div>
				<div className="flex-1 pl-8 text-[grayBlue] whitespace-nowrap truncate flex-shrink-0">
					{title}
				</div>
				<div className="flex-1 flex items-center pr-4">
					{/* <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
						 <div
							className="h-full bg-[#84A7FB]"
							style={{ width: `${progress}%` }}
						/> 
					</div> */}
				</div>
				<div className="w-16 font-light text-[var(--color-blueGray)] text-start">
					{date}
				</div>
			</div>
		</button>
	);
}
