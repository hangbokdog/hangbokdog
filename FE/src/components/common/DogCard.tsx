import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface DogCardProps {
	id: number;
	name: string;
	age: string;
	imageUrl: string;
	isMale: boolean;
	isLiked: boolean;
}

export default function DogCard({
	id,
	name,
	age,
	imageUrl,
	isMale,
	isLiked,
}: DogCardProps) {
	return (
		<Link to={`/dogs/${id}`}>
			<div className="flex flex-col gap-1">
				<div className="rounded-xl overflow-hidden relative">
					<img
						src={imageUrl}
						alt={name}
						className="aspect-square object-cover"
					/>
					{isMale ? (
						<span className="absolute right-1 top-1 px-1.5 text-xs text-white bg-male rounded-full">
							남아
						</span>
					) : (
						<span className="absolute right-1 top-1 px-1.5 text-xs text-white bg-female rounded-full">
							여아
						</span>
					)}
				</div>
				<div className="flex justify-between items-center">
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
