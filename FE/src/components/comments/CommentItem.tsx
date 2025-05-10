import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
import CommentDropdown from "../common/CommentDropdown";
import useCenterStore from "@/lib/store/centerStore";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleDogCommentLikeAPI } from "@/api/dog";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import type { DogCommentItem } from "@/types/dog";

interface CommentItemProps {
	comment: DogCommentItem;
	replyOpenId: number | null;
	setReplyOpenId: (id: number | null) => void;
	replyValue: string;
	setReplyValue: (value: string) => void;
	replyLength: number;
	setReplyLength: (length: number) => void;
	handleReplySubmit: (commentId: number) => void;
}

export default function CommentItem({
	comment,
	replyOpenId,
	setReplyOpenId,
	replyValue,
	setReplyValue,
	replyLength,
	setReplyLength,
	handleReplySubmit,
}: CommentItemProps) {
	const { dogComment, replies } = comment;
	const { isCenterMember } = useCenterStore();
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
				toast.success("댓글을 좋아요 했습니다.");
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
		<div className="py-3 border-b">
			<div className="flex items-start gap-2">
				<img
					src={dogComment.author.profileImage}
					alt={dogComment.author.nickName}
					className="w-8 h-8 rounded-full flex-shrink-0"
				/>
				<div className="flex-1">
					<div className="flex items-center gap-2 justify-between">
						<span className="font-bold text-sm">
							{dogComment.author.nickName}
						</span>
						{dogComment.isAuthor && <CommentDropdown />}
					</div>
					<div className="text-sm mt-1">{dogComment.content}</div>
					<div className="flex items-center gap-2 mt-2 text-xs text-lightGray">
						<span>
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
						{isCenterMember && (
							<button
								type="button"
								className="text-blue-500 font-medium"
								onClick={() => {
									setReplyOpenId(dogComment.id);
									setReplyValue("");
									setReplyLength(0);
								}}
							>
								답글쓰기
							</button>
						)}
						<div className="flex items-center ml-2">
							<button
								onClick={handleToggleLike}
								type="button"
								disabled={isDisabled}
								className="flex items-center cursor-pointer"
								aria-label={isLiked ? "좋아요 취소" : "좋아요"}
							>
								{isLiked ? (
									<FaHeart className="text-red" />
								) : (
									<FaRegHeart />
								)}
								{likeCount > 0 && (
									<span className="ml-1">{likeCount}</span>
							)}
							</button>
						</div>
					</div>
					{replyOpenId === dogComment.id && isCenterMember && (
						<ReplyForm
							replyValue={replyValue}
							setReplyValue={setReplyValue}
							replyLength={replyLength}
							setReplyLength={setReplyLength}
							handleReplySubmit={() =>
								handleReplySubmit(dogComment.id)
							}
							setReplyOpenId={setReplyOpenId}
						/>
					)}
					{replies.length > 0 && <ReplyList replies={replies} />}
				</div>
			</div>
		</div>
	);
}
