import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import MyAdoptionTag from "@/components/my/MyAdoptionTag";

export interface AdoptDogCardProps {
	id: number;
	name: string;
	age: string;
	imageUrl: string;
	status: "APPLIED" | "ACCEPTED" | "REJECTED" | "UNDER_REVIEW";
	startDate: string;
	endDate?: string;
}

export default function AdoptDogCard({
	id,
	name,
	age,
	status,
	imageUrl,
	startDate,
	endDate,
}: AdoptDogCardProps) {
	return (
		<Link
			to={`/dogs/${id}`}
			className="flex items-center p-3 bg-white rounded-lg shadow-sm"
		>
			<div className="flex-shrink-0 mr-4">
				<img
					src={imageUrl || "/placeholder.svg"}
					alt={`${name} 사진`}
					width={80}
					height={80}
					className="rounded-lg object-cover"
				/>
			</div>
			{/* 반려동물 정보 */}
			<div className="flex-1">
				<div className="relative flex gap-2 mb-2">
					<MyAdoptionTag status={status} />
				</div>
				<div className="flex items-center mb-1">
					<span className="bg-orange-100 text-orange-700 p-1 rounded-full mr-2">
						🐕
					</span>
					<span className="font-medium">{name}</span>
					<span className="text-gray-600 ml-2">{age}</span>
				</div>
				<div className="px-1.5 text-sm text-grayText rounded-full bg-gray-50 flex items-center justify-center">
					{startDate}
					{endDate ? ` ~ ${endDate}` : " ~"}
				</div>
			</div>
			<div className="flex-shrink-0 ml-2">
				<FaChevronRight className="text-gray-400" />
			</div>
		</Link>
	);
}
