import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import StatusTag from "@/components/my/StatusTag";
import GenderTag from "@/components/my/GenderTag";

export interface ProtectDogCardProps {
	id: number;
	name: string;
	age: string;
	imageUrl: string;
	gender: "MALE" | "FEMALE";
	status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
	startDate: string;
	endDate?: string;
}

export default function ProtectDogCard({
	id,
	name,
	age,
	gender,
	status,
	imageUrl,
	startDate,
	endDate,
}: ProtectDogCardProps) {
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
					<GenderTag gender={gender} />
					<StatusTag status={status} />
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
