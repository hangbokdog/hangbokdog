import CommentItem from "./CommentItem";
import type { DogCommentItem } from "@/types/dog";

interface CommentListProps {
	comments: DogCommentItem[];
	replyOpenId: number | null;
	setReplyOpenId: (id: number | null) => void;
	replyValue: string;
	setReplyValue: (value: string) => void;
	replyLength: number;
	setReplyLength: (length: number) => void;
	handleReplySubmit: (commentId: number) => void;
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
}: CommentListProps) {
	return (
		<div className="flex-1 px-2.5 pt-2.5">
			{comments.map((commentItem) => (
				<CommentItem
					key={commentItem.dogComment.id}
					comment={commentItem}
					replyOpenId={replyOpenId}
					setReplyOpenId={setReplyOpenId}
					replyValue={replyValue}
					setReplyValue={setReplyValue}
					replyLength={replyLength}
					setReplyLength={setReplyLength}
					handleReplySubmit={handleReplySubmit}
				/>
			))}
		</div>
	);
}
