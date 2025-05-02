import CommentItem from "./CommentItem";

interface Comment {
	id: number;
	content: string;
	author: string;
	createdAt: string;
	replies?: Reply[];
}

interface Reply {
	id: number;
	content: string;
	author: string;
	createdAt: string;
}

interface CommentListProps {
	comments: Comment[];
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
			{comments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
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
