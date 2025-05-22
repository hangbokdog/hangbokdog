import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDropdown from "../common/CommentDropdown";
import { useState } from "react";
import type { CommentItemData } from "@/types/comment";

interface ReplyItemProps {
	reply: {
		comment: CommentItemData["comment"];
		replies: CommentItemData[];
	};
	toggleLike?: (commentId: number, isLiked: boolean) => void;
	onUpdateComment?: (commentId: number, content: string) => void;
	onDeleteComment?: (commentId: number) => void;
}

export default function ReplyItem({
	reply,
	toggleLike,
	onUpdateComment,
	onDeleteComment,
}: ReplyItemProps) {
	const { comment } = reply;

	const [isLiked, setIsLiked] = useState(comment.isLiked);
	const [likeCount, setLikeCount] = useState(comment.likeCount);
	const [isDisabled, setIsDisabled] = useState(false);

	const handleToggleLike = () => {
		if (isDisabled || !toggleLike) return;

		setIsDisabled(true);

		const newLikeState = !isLiked;
		setIsLiked(newLikeState);
		setLikeCount((prevCount) =>
			newLikeState ? prevCount + 1 : Math.max(0, prevCount - 1),
		);

		toggleLike(comment.id, isLiked);

		setTimeout(() => {
			setIsDisabled(false);
		}, 1000);
	};

	return (
		<div className="p-2 max-w-full break-words flex flex-col">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<img
						src={comment.author.profileImage}
						alt={comment.author.nickName}
						className="w-6 h-6 rounded-full flex-shrink-0"
					/>
					<span className="font-bold text-xs">
						{comment.author.nickName}
					</span>
				</div>
				{comment.isAuthor && !comment.isDeleted && (
					<CommentDropdown
						commentId={comment.id}
						content={comment.content}
						onUpdate={onUpdateComment || (() => {})}
						onDelete={onDeleteComment || (() => {})}
					/>
				)}
			</div>
			<div className="text-sm mt-1 whitespace-normal break-words">
				{comment.content}
			</div>
			<div className="flex gap-2">
				<span className="text-xs text-lightGray">
					{new Date(comment.createdAt).toLocaleDateString("ko-KR", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
				{toggleLike && (
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
				)}
			</div>
		</div>
	);
}
