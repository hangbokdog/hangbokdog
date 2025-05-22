import CommentItem from "./CommentItem";
import type { CommentItemData } from "@/types/comment";

interface CommentListProps {
	comments: CommentItemData[];
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

export default function CommentList({
	comments,
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
}: CommentListProps) {
	return (
		<div className="flex-1 px-2.5 pt-2.5 pb-8">
			{comments.map((commentItem) => (
				<CommentItem
					key={commentItem.comment.id}
					commentData={commentItem}
					replyOpenId={replyOpenId}
					setReplyOpenId={setReplyOpenId}
					replyValue={replyValue}
					setReplyValue={setReplyValue}
					replyLength={replyLength}
					setReplyLength={setReplyLength}
					handleReplySubmit={handleReplySubmit}
					toggleLike={toggleLike}
					onUpdateComment={onUpdateComment}
					onDeleteComment={onDeleteComment}
				/>
			))}
		</div>
	);
}
