import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { PiDogFill } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";

interface DogHeaderProps {
	name: string;
	age: string;
	likes: number;
	comments: number;
	isLiked: boolean;
}

export default function DogHeader({
	name,
	age,
	likes,
	comments,
	isLiked,
}: DogHeaderProps) {
	const { id } = useParams();

	return (
		<div className="flex items-center justify-between">
			<div className="flex gap-2 items-end">
				<div className="flex gap-2 items-center">
					<div className="flex">
						<div className="size-6 flex rounded-full bg-[#FFE6B1] items-center justify-center">
							<PiDogFill className="size-5 text-[#D46F1D]" />
						</div>
					</div>
					<span className="text-xl font-bold">{name}</span>
				</div>
				<span className="font-medium text-blueGray">{age}</span>
			</div>
			<div className="flex gap-2 items-center">
				{isLiked ? (
					<FaHeart className="size-5 text-red" />
				) : (
					<FaRegHeart className="size-5 text-blueGray" />
				)}

				<span className="font-medium text-textGray">{likes}</span>
				<Link
					className="flex gap-2 items-center"
					to={`/dogs/${id}/comments`}
				>
					<FaRegComment className="size-5 text-blueGray" />
					<span className="font-medium text-textGray">
						{comments}
					</span>
				</Link>
			</div>
		</div>
	);
}
