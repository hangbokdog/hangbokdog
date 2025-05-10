import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { PiDogFill } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDogFavoriteAPI, removeDogFavoriteAPI } from "@/api/dog";
import { toast } from "sonner";
import useCenterStore from "@/lib/store/centerStore";

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
	likes: initialLikes,
	comments,
	isLiked: initialIsLiked,
}: DogHeaderProps) {
	const centerId = useCenterStore.getState().selectedCenter?.centerId;
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [likes, setLikes] = useState(initialLikes);
	const [isDisabled, setIsDisabled] = useState(false);

	const addFavoriteMutation = useMutation({
		mutationFn: () => {
			return addDogFavoriteAPI(Number(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dogDetail", id] });
			queryClient.invalidateQueries({
				queryKey: ["dogs", "latest", centerId],
			});
			toast.success("강아지를 좋아요 했습니다!");
		},
		onError: () => {
			setIsLiked(false);
			setLikes((prev) => Math.max(0, prev - 1));
			toast.error("좋아요에 실패했습니다.");
		},
	});

	const removeFavoriteMutation = useMutation({
		mutationFn: () => {
			return removeDogFavoriteAPI(Number(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dogDetail", id] });
			queryClient.invalidateQueries({
				queryKey: ["dogs", "latest", centerId],
			});
			toast.success("좋아요를 취소했습니다.");
		},
		onError: () => {
			setIsLiked(true);
			setLikes((prev) => prev + 1);
			toast.error("좋아요 취소에 실패했습니다.");
		},
	});

	const handleToggleFavorite = () => {
		if (isDisabled) return;

		setIsDisabled(true);

		const newLikeState = !isLiked;

		setIsLiked(newLikeState);
		setLikes((prev) => prev + (newLikeState ? 1 : -1));

		if (newLikeState) {
			addFavoriteMutation.mutate();
		} else {
			removeFavoriteMutation.mutate();
		}

		setTimeout(() => {
			setIsDisabled(false);
		}, 1000);
	};

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
				<button
					type="button"
					onClick={handleToggleFavorite}
					className="flex items-center"
					aria-label={isLiked ? "좋아요 취소" : "좋아요"}
					disabled={isDisabled}
				>
					{isLiked ? (
						<FaHeart className="size-5 text-red" />
					) : (
						<FaRegHeart className="size-5 text-blueGray" />
					)}
				</button>

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
