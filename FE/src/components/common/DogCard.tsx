import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface DogCardProps {
	id: number;
	name: string;
	age: string;
	imageUrl: string;
	gender: "MALE" | "FEMALE";
	isLiked: boolean;
	bgColor?: string;
}

export default function DogCard({
	id,
	name,
	age,
	imageUrl,
	gender,
	isLiked,
	bgColor,
}: DogCardProps) {
	return (
		<Link to={`/dogs/${id}`}>
			<div
				className={`flex flex-col rounded-xl shadow-custom-sm ${bgColor}`}
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
						<span className="absolute right-1 top-1 px-1.5 text-xs text-white bg-male rounded-full">
							남아
						</span>
					) : (
						<span className="absolute right-1 top-1 px-1.5 text-xs text-white bg-female rounded-full">
							여아
						</span>
					)}
				</div>
				<div className="flex justify-between items-center px-1 py-1.5">
					<div>
						<p className="text-sm font-medium text-grayText">
							{name}{" "}
							<span className="text-xs text-blueGray">{age}</span>
						</p>
					</div>
					{isLiked ? (
						<FaHeart className="text-red size-4 cursor-pointer" />
					) : (
						<FaRegHeart className="text-blueGray size-4 cursor-pointer" />
					)}
				</div>
			</div>
		</Link>
	);
}
