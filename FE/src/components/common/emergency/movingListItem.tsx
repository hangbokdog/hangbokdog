import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPaw } from "react-icons/fa";
import { MdSend } from "react-icons/md";

interface MovingListItemProps {
	img: string;
	name: string;
	startLocation: string;
	endLocation: string;
	date: string;
	index: number;
}

export default function MovingListItem(props: MovingListItemProps) {
	const { img, name, startLocation, endLocation, date, index } = props;

	return (
		<div
			className={`flex rounded-full ${index % 2 === 1 && "bg-background"} text-grayText text-base font-medium items-center px-5 py-1`}
		>
			<div className="flex-1 flex items-center gap-2 font-semibold">
				<Avatar className="w-6 h-6 flex justify-center items-center">
					<AvatarImage src={img} />
					<AvatarFallback className="text-center bg-superLightGray text-grayText">
						{name[0]}
					</AvatarFallback>
				</Avatar>
				{name}
				<FaPaw />
			</div>
			<div className="flex-1/4 flex justify-center items-center gap-2.5">
				<div className="flex-1/3 text-center">{startLocation}</div>
				<div className="flex-1">
					<MdSend className="text-[var(--color-lightGray)]" />
				</div>
				<div className="flex-1/3 text-center">{endLocation}</div>
			</div>
			<div className="w-16 font-light text-[var(--color-blueGray)] text-start">
				{date}
			</div>
		</div>
	);
}
