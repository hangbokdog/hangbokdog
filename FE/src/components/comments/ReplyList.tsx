import ReplyItem from "./ReplyItem";
import type { DogCommentItem } from "@/types/dog";

interface ReplyListProps {
	replies: {
		dogComment: DogCommentItem["dogComment"];
		replies: DogCommentItem[];
	}[];
}

export default function ReplyList({ replies }: ReplyListProps) {
	if (!replies || replies.length === 0) return null;

	return (
		<>
			{replies.map((reply) => (
				<ReplyItem key={reply.dogComment.id} reply={reply} />
			))}
		</>
	);
}
