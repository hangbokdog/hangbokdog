import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDropdown from "../common/CommentDropdown";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleDogCommentLikeAPI } from "@/api/dog";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import type { DogCommentItem } from "@/types/dog";

interface ReplyItemProps {
	reply: {
		dogComment: DogCommentItem["dogComment"];
		replies: DogCommentItem[];
	};
}

export default function ReplyItem({ reply }: ReplyItemProps) {
	const { dogComment } = reply;
	const { id: dogId } = useParams();
	const queryClient = useQueryClient();

	const [isLiked, setIsLiked] = useState(dogComment.isLiked);
	const [likeCount, setLikeCount] = useState(dogComment.likeCount);
	const [isDisabled, setIsDisabled] = useState(false);

	const toggleLikeMutation = useMutation({
		mutationFn: () => toggleDogCommentLikeAPI(Number(dogId), dogComment.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dogComments", dogId] });
			if (isLiked) {
				toast.success("답글을 좋아요 했습니다.");
			} else {
				toast.success("좋아요를 취소했습니다.");
			}
		},
		onError: () => {
			setIsLiked(!isLiked);
			setLikeCount((prevCount) =>
				isLiked ? prevCount + 1 : Math.max(0, prevCount - 1),
			);
			toast.error("좋아요 처리에 실패했습니다.");
		},
	});

	const handleToggleLike = () => {
		if (isDisabled) return;

		setIsDisabled(true);

		const newLikeState = !isLiked;
		setIsLiked(newLikeState);
		setLikeCount((prevCount) =>
			newLikeState ? prevCount + 1 : Math.max(0, prevCount - 1),
		);

		toggleLikeMutation.mutate();

		setTimeout(() => {
			setIsDisabled(false);
		}, 1000);
	};

	return (
		<div className="p-2 max-w-full break-words">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<img
						src={dogComment.author.profileImage}
						alt={dogComment.author.nickName}
						className="w-6 h-6 rounded-full flex-shrink-0"
					/>
					<span className="font-bold text-xs">
						{dogComment.author.nickName}
					</span>
					<span className="text-xs text-lightGray">
						{new Date(dogComment.createdAt).toLocaleDateString(
							"ko-KR",
							{
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
							},
						)}
					</span>
					<button
						onClick={handleToggleLike}
						type="button"
						disabled={isDisabled}
						className="flex items-center cursor-pointer text-xs text-lightGray"
						aria-label={isLiked ? "좋아요 취소" : "좋아요"}
					>
						{isLiked ? (
							<FaHeart className="text-red size-3" />
						) : (
							<FaRegHeart className="size-3" />
						)}
						{likeCount > 0 && (
							<span className="ml-1">{likeCount}</span>
						)}
					</button>
				</div>
				{dogComment.isAuthor && !dogComment.isDeleted && (
					<CommentDropdown
						commentId={dogComment.id}
						content={dogComment.content}
					/>
				)}
			</div>
			<div className="text-sm mt-1 whitespace-normal break-words">
				{dogComment.content}
			</div>
		</div>
	);
}
