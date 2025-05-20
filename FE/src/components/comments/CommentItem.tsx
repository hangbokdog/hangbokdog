import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
import CommentDropdown from "../common/CommentDropdown";
import useCenterStore from "@/lib/store/centerStore";
import { useState, useEffect } from "react";
import type { CommentItemData } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CommentItemProps {
	commentData: CommentItemData;
	replyOpenId: number | null;
	setReplyOpenId: (id: number | null) => void;
	replyValue: string;
	setReplyValue: (value: string) => void;
	replyLength: number;
	setReplyLength: (length: number) => void;
	handleReplySubmit: (commentId: number) => void;
	toggleLike?: (commentId: number, isLiked: boolean) => void;
	onUpdateComment?: (commentId: number, content: string) => void;
	onDeleteComment?: (commentId: number) => void;
}

export default function CommentItem({
	commentData,
	replyOpenId,
	setReplyOpenId,
	replyValue,
	setReplyValue,
	replyLength,
	setReplyLength,
	handleReplySubmit,
	toggleLike,
	onUpdateComment,
	onDeleteComment,
}: CommentItemProps) {
	const { comment, replies } = commentData;
	const { isCenterMember } = useCenterStore();

	const [isLiked, setIsLiked] = useState(comment.isLiked);
	const [likeCount, setLikeCount] = useState(comment.likeCount);
	const [isDisabled, setIsDisabled] = useState(false);

	// useEffect를 사용하여 comment가 변경될 때마다 로컬 상태 업데이트
	useEffect(() => {
		setIsLiked(comment.isLiked);
		setLikeCount(comment.likeCount);
	}, [comment]);

	// 좋아요 버튼 클릭 핸들러
	const handleToggleLike = () => {
		if (isDisabled || !toggleLike) return;

		setIsDisabled(true);

		// 즉시 UI 상태 업데이트
		const newLikeState = !isLiked;
		setIsLiked(newLikeState);
		setLikeCount((prevCount) =>
			newLikeState ? prevCount + 1 : Math.max(0, prevCount - 1),
		);

		// 부모 컴포넌트에서 전달받은 toggleLike 함수 호출
		toggleLike(comment.id, isLiked);

		// 빠른 클릭 방지
		setTimeout(() => {
			setIsDisabled(false);
		}, 1000);
	};

	return (
		<div className="py-3 border-b">
			<div className="flex items-start gap-2">
				<Avatar className="w-8 h-8">
					<AvatarImage
						src={comment.author.profileImage}
						className="object-cover"
					/>
					<AvatarFallback className="bg-superLightBlueGray">
						{comment.author.nickName}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					<div className="flex items-center gap-2 justify-between">
						<span className="font-bold text-sm">
							{comment.author.nickName}
						</span>
						{comment.isAuthor && !comment.isDeleted && (
							<CommentDropdown
								commentId={comment.id}
								content={comment.content}
								onUpdate={onUpdateComment || (() => {})}
								onDelete={onDeleteComment || (() => {})}
							/>
						)}
					</div>
					<div className="text-sm mt-1">{comment.content}</div>
					<div className="flex items-center gap-2 mt-2 text-xs text-lightGray">
						<span>
							{new Date(comment.createdAt).toLocaleDateString(
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
									setReplyOpenId(comment.id);
									setReplyValue("");
									setReplyLength(0);
								}}
							>
								답글쓰기
							</button>
						)}
						<div className="flex items-center ml-2">
							{toggleLike && (
								<button
									onClick={handleToggleLike}
									type="button"
									disabled={isDisabled}
									className="flex items-center cursor-pointer"
									aria-label={
										isLiked ? "좋아요 취소" : "좋아요"
									}
								>
									{isLiked ? (
										<FaHeart className="text-red" />
									) : (
										<FaRegHeart />
									)}
									{likeCount > 0 && (
										<span className="ml-1">
											{likeCount}
										</span>
									)}
								</button>
							)}
						</div>
					</div>
					{replyOpenId === comment.id && isCenterMember && (
						<ReplyForm
							replyValue={replyValue}
							setReplyValue={setReplyValue}
							replyLength={replyLength}
							setReplyLength={setReplyLength}
							handleReplySubmit={() =>
								handleReplySubmit(comment.id)
							}
							setReplyOpenId={setReplyOpenId}
						/>
					)}
					{replies.length > 0 && (
						<ReplyList
							replies={replies}
							toggleLike={toggleLike}
							onUpdateComment={onUpdateComment}
							onDeleteComment={onDeleteComment}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
