import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDogFavoriteAPI, removeDogFavoriteAPI } from "@/api/dog";
import { toast } from "sonner";
import useCenterStore from "@/lib/store/centerStore";

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
	const centerId = useCenterStore.getState().selectedCenter?.centerId;
	const [isLiked, setIsLiked] = useState(isFavorite);
	const [isDisabled, setIsDisabled] = useState(false);
	const queryClient = useQueryClient();
	const managerUrl = isManager ? "/manager" : "";

	const addFavoriteMutation = useMutation({
		mutationFn: () => {
			return addDogFavoriteAPI(dogId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["dogs", "latest", centerId],
			});
			queryClient.invalidateQueries({ queryKey: ["dogDetail", dogId] });
			toast.success("강아지를 좋아요 했습니다!");
		},
		onError: () => {
			setIsLiked(false);
			toast.error("좋아요에 실패했습니다.");
		},
	});

	const removeFavoriteMutation = useMutation({
		mutationFn: () => {
			return removeDogFavoriteAPI(dogId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["dogs", "latest", centerId],
			});
			queryClient.invalidateQueries({ queryKey: ["dogDetail", dogId] });
			toast.success("좋아요를 취소했습니다.");
		},
		onError: () => {
			setIsLiked(true);
			toast.error("좋아요 취소에 실패했습니다.");
		},
	});

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (isDisabled) return;

		setIsDisabled(true);
		const newLikeState = !isLiked;
		setIsLiked(newLikeState);

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
					{isLiked ? (
						<FaHeart
							className="text-red size-4 cursor-pointer"
							onClick={handleToggleFavorite}
						/>
					) : (
						<FaRegHeart
							className="text-blueGray size-4 cursor-pointer"
							onClick={handleToggleFavorite}
						/>
					)}
				</div>
			</div>
		</Link>
	);
}
