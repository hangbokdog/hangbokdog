import { VscLocation } from "react-icons/vsc";

interface OngoingVolunteerInfoProps {
	title: string;
	location: string;
	description: string;
}

export default function OngoingVolunteerInfo({
	title,
	location,
	description,
}: OngoingVolunteerInfoProps) {
	return (
		<div className="p-3 justify-between flex flex-1 flex-col items-start">
			<div className="flex items-center justify-start gap-1">
				<span className="text-base font-bold">{title}</span>
				<span className="inline-flex gap-1 items-center">
					<VscLocation className="size-4 text-blueGray" />
					<span className="text-xs text-blueGray font-medium">
						{location}
					</span>
				</span>
			</div>
			<div className="flex items-center">
				<span className="text-sm text-blueGray">{description}</span>
			</div>
		</div>
	);
}
