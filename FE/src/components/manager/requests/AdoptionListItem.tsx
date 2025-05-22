import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPaw } from "react-icons/fa";

interface AdoptionListItemProps {
	img: string;
	kid: string;
	requestCount: number;
	index: number;
}

export default function AdoptionListItem(props: AdoptionListItemProps) {
	const { img, kid, requestCount, index } = props;

	return (
		<div
			className={`flex rounded-full ${index % 2 === 1 && "bg-background"} text-grayText text-base font-semibold items-center px-5 py-1`}
		>
			<div className="flex-1 flex items-center gap-2.5">
				<Avatar className="w-6 h-6 flex justify-center items-center">
					<AvatarImage src={img} />
					<AvatarFallback className="text-center bg-superLightGray text-grayText">
						{kid[0]}
					</AvatarFallback>
				</Avatar>
				{kid}
				<FaPaw />
			</div>
			<div className="flex items-center gap-2">
				입양 요청
				<span className="flex h-5 w-8 rounded-full bg-male font-medium text-background justify-center items-center">
					{requestCount}
				</span>
				건
			</div>
		</div>
	);
}
