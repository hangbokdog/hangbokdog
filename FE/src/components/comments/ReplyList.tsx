import type { CommentItemData } from "@/types/comment";
import ReplyItem from "./ReplyItem";

interface ReplyListProps {
	replies: {
		comment: CommentItemData["comment"];
		replies: CommentItemData[];
	}[];
	toggleLike?: (commentId: number, isLiked: boolean) => void;
	onUpdateComment?: (commentId: number, content: string) => void;
	onDeleteComment?: (commentId: number) => void;
}

export default function ReplyList({
	replies,
	toggleLike,
	onDeleteComment,
	onUpdateComment,
}: ReplyListProps) {
	if (!replies || replies.length === 0) return null;

	return (
		<>
			{replies.map((reply) => (
				<ReplyItem
					key={reply.comment.id}
					reply={reply}
					toggleLike={toggleLike}
					onUpdateComment={onUpdateComment}
					onDeleteComment={onDeleteComment}
				/>
			))}
		</>
	);
}
