import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SiDatadog } from "react-icons/si";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDogFavoriteAPI, removeDogFavoriteAPI } from "@/api/dog";
import { toast } from "sonner";
import clsx from "clsx";
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
	maxWidth?: number;
}

export default function DogCard({
	dogId,
	name,
	ageMonth,
	imageUrl,
	gender,
	isFavorite,
	bgColor,
	maxWidth,
}: DogCardProps) {
	const centerId = useCenterStore.getState().selectedCenter?.centerId;
	const [isLiked, setIsLiked] = useState(isFavorite);
	const [isDisabled, setIsDisabled] = useState(false);
	const [imgError, setImgError] = useState(false);
	const queryClient = useQueryClient();

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
		<Link to={`/dogs/${dogId}`}>
			<div
				className={clsx(
					"rounded-lg shadow-sm border border-gray-100 overflow-hidden",
					"bg-white",
					bgColor && `bg-${bgColor}`,
				)}
				style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
			>
				<div className="relative">
					{imgError ? (
						<div className="w-full h-32 flex justify-center items-center bg-gray-100">
							<SiDatadog className="text-5xl text-gray-400" />
						</div>
					) : (
						<img
							src={imageUrl}
							alt={name}
							className="w-full h-42 object-cover"
							referrerPolicy="no-referrer"
							loading="lazy"
							onError={() => setImgError(true)}
						/>
					)}
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-end">
						<div
							className={`text-xs px-2 py-0.5 rounded-full ${
								gender === "MALE"
									? "bg-blue-100 text-blue-700"
									: "bg-pink-100 text-pink-700"
							}`}
						>
							{Number(ageMonth) >= 12
								? `${Math.floor(Number(ageMonth) / 12)}살 · `
								: `${ageMonth}개월 · `}
							{gender === "MALE" ? "남아" : "여아"}
						</div>
					</div>
				</div>
				<div className="p-3">
					<div className="flex items-center justify-start mb-1">
						<span className="text-sm font-medium">{name}</span>
					</div>
					<div className="flex justify-between items-center">
						<button
							type="button"
							className="mt-2 text-xs text-blue-600 font-medium"
						>
							상세 정보
						</button>
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
			</div>
		</Link>
	);
}
