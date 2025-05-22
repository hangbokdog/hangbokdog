import { LocationLabel } from "@/types/center";
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
				<span className="text-base font-bold line-clamp-2">
					{title}
				</span>
			</div>
			<span className="flex gap-1 items-center">
				<VscLocation className="size-4 text-blueGray" />
				<span className="text-xs text-blueGray font-medium">
					{LocationLabel[location as keyof typeof LocationLabel]}
				</span>
			</span>
			<div className="flex items-center">
				<span className="text-sm text-blueGray">{description}</span>
			</div>
		</div>
	);
}
