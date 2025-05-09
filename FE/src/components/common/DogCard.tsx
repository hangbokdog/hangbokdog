import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface DogCardProps {
	dogId: number;
	name: string;
	ageMonth: string;
	imageUrl: string;
	gender: "MALE" | "FEMALE";
	isFavorite: boolean;
	bgColor?: string;
	isManager?: boolean;
}

export default function DogCard({
	dogId,
	name,
	ageMonth,
	imageUrl,
	gender,
	isFavorite,
	bgColor,
	isManager = false,
}: DogCardProps) {
	const managerUrl = isManager ? "/manager" : "";
	return (
		<Link to={`${managerUrl}/dogs/${dogId}`}>
			<div
				className={`flex flex-col rounded-xl ${bgColor && "shadow-custom-sm"}`}
			>
				<div
					className={`${bgColor ? "rounded-tl-xl rounded-tr-xl" : "rounded-xl"} overflow-hidden relative`}
				>
					<img
						src={imageUrl}
						alt={name}
						className="aspect-square object-cover"
					/>
					{gender === "MALE" ? (
						<span className="absolute right-1 top-1 px-1.5 py-0.5 text-sm text-white bg-male rounded-full">
							남아
						</span>
					) : (
						<span className="absolute right-1 top-1 px-1.5 py-0.5 text-sm text-white bg-female rounded-full">
							여아
						</span>
					)}
				</div>
				<div className="flex justify-between items-center px-1 py-1.5">
					<div>
						<p className="text-sm font-medium text-grayText">
							{name}{" "}
							<span className="text-xs text-blueGray">
								{ageMonth}개월
							</span>
						</p>
					</div>
					{isFavorite ? (
						<FaHeart className="text-red size-4 cursor-pointer" />
					) : (
						<FaRegHeart className="text-blueGray size-4 cursor-pointer" />
					)}
				</div>
			</div>
		</Link>
	);
}
