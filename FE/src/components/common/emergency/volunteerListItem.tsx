import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPaw } from "react-icons/fa";

interface VolunteerListItemProps {
	img: string;
	name: string;
	title: string;
	target: number;
	date: string;
	index: number;
}

export default function VolunteerListItem(props: VolunteerListItemProps) {
	console.log("VolunteerListItem props:", props);
	const { img, name, title, target, date, index } = props;

	return (
		<div
			className={`flex rounded-full ${
				index % 2 === 1 && "bg-background"
			} text-grayText text-base font-medium items-center px-5 py-1`}
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
				{name}
				<FaPaw />
			</div>
			<div className="w-1/3">{title}</div>
			<div className="flex-1 text-center">{target} 명</div>
			<div className="w-16 font-light text-[var(--color-blueGray)]">
				{date}
			</div>
		</div>
	);
}
