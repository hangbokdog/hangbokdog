import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import StatusTag from "@/components/my/StatusTag";
import GenderTag from "@/components/my/GenderTag";
import type { Gender } from "@/types/dog";

export interface MyDogCardProps {
	id: number;
	name: string;
	age?: string;
	imageUrl: string;
	gender?: Gender;
	status?:
		| "PENDING"
		| "APPROVED"
		| "REJECTED"
		| "CANCELLED"
		| "APPLIED"
		| "UNDER_REVIEW"
		| "REJECTED"
		| "ACCEPTED";
	startDate?: string;
	endDate?: string;
}

export default function MyDogCard({
	id,
	name,
	age,
	gender,
	status,
	imageUrl,
	startDate,
	endDate,
}: MyDogCardProps) {
	return (
		<Link to={`/dogs/${id}`} className="w-full flex items-center p-3">
			<div className="mr-4">
				<img
					src={imageUrl || "/placeholder.svg"}
					alt={`${name} 사진`}
					className="w-16 h-16 rounded-lg object-cover"
				/>
			</div>
			{/* 반려동물 정보 */}
			<div className="flex-1">
				<div className="relative flex gap-2 mb-2">
					{gender && <GenderTag gender={gender} />}
					{status && <StatusTag status={status} />}
				</div>
				<div className="flex items-center mb-1">
					<span className="font-medium">{name}</span>
					{age && <span className="text-gray-600 ml-2">{age}</span>}
				</div>
				{startDate && (
					<div className="px-1.5 text-sm text-grayText rounded-full bg-gray-50 flex items-center justify-center">
						{startDate.split("T")[0]}
						{endDate ? ` ~ ${endDate.split("T")[0]}` : " ~"}
					</div>
				)}
			</div>
			<div className="flex-shrink-0 ml-2">
				<FaChevronRight className="text-gray-400" />
			</div>
		</Link>
	);
}
