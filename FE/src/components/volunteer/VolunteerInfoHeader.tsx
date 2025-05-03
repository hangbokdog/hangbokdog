import { VscLocation } from "react-icons/vsc";

interface VolunteerInfoHeaderProps {
	title: string;
	status: string;
	date: string;
	location: string;
	time: string;
	pets: string;
}

export default function VolunteerInfoHeader({
	title,
	status,
	date,
	location,
	time,
	pets,
}: VolunteerInfoHeaderProps) {
	return (
		<div className="flex flex-col p-2.5 gap-2.5 bg-white rounded-[8px] shadow-custom-sm">
			<div className="flex gap-2 items-center">
				<span className="text-xl font-bold">{title}</span>
				<span className="font-semibold text-white bg-green px-2.5 py-1 rounded-3xl">
					{status}
				</span>
			</div>
			<span className="text-grayText font-medium">{date}</span>
			<span className="inline-flex gap-1 items-center">
				<VscLocation className="size-5 text-blueGray" />
				<span className="text-blueGray font-medium">{location}</span>
			</span>
			<span className="text-grayText font-medium">{time}</span>
			<span className="text-grayText font-medium">{pets}</span>
		</div>
	);
}
