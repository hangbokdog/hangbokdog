import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VolunteerListItemProps {
	img: string;
	name: string;
	date: string;
	location: string;
	time: string;
	index: number;
}

export default function VolunteerListItem(props: VolunteerListItemProps) {
	const { img, name, date, location, time, index } = props;

	return (
		<div
			className={`flex rounded-full ${index % 2 === 1 && "bg-background"} text-grayText text-base font-medium items-center px-5 py-1`}
		>
			<div className="flex w-32 text-blueGray font-semibold items-center gap-2">
				<Avatar className="w-6 h-6 flex justify-center items-center">
					<AvatarImage src={img} />
					<AvatarFallback className="text-center bg-superLightGray text-grayText">
						{name[0]}
					</AvatarFallback>
				</Avatar>
				{name} 님
			</div>
			<div className="flex-1 flex justify-center items-center gap-2.5">
				{date}
			</div>
			<div className="flex-1 text-center font-semibold text-blueGray">
				{location}
			</div>
			<div className="flex-1 text-center">{time}</div>
		</div>
	);
}
