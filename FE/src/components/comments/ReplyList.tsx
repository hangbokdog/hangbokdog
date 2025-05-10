import CommentDropdown from "../common/CommentDropdown";
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
				<div
					key={reply.dogComment.id}
					className="p-2 max-w-full break-words"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<img
								src={reply.dogComment.author.profileImage}
								alt={reply.dogComment.author.nickName}
								className="w-6 h-6 rounded-full flex-shrink-0"
							/>
							<span className="font-bold text-xs">
								{reply.dogComment.author.nickName}
							</span>
							<span className="text-xs text-lightGray">
								{new Date(
									reply.dogComment.createdAt,
								).toLocaleDateString("ko-KR", {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
						{reply.dogComment.isAuthor && <CommentDropdown />}
					</div>
					<div className="text-sm mt-1 whitespace-normal break-words">
						{reply.dogComment.content}
					</div>
				</div>
			))}
		</>
	);
}
