import { FaRegHeart } from "react-icons/fa";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
import CommentDropdown from "../common/CommentDropdown";

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

interface CommentItemProps {
	comment: Comment;
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
	return (
		<div className="py-3 border-b">
			<div className="flex items-start gap-2">
				<div className="w-8 h-8 rounded-full bg-grayText flex-shrink-0" />
				<div className="flex-1">
					<div className="flex items-center gap-2 justify-between">
						<span className="font-bold text-sm">
							{comment.author}
						</span>
						<CommentDropdown />
					</div>
					<div className="text-sm mt-1">{comment.content}</div>
					<div className="flex items-center gap-2 mt-2 text-xs text-lightGray">
						<span>{comment.createdAt}</span>
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
						<FaRegHeart className="ml-2" />
					</div>
					{replyOpenId === comment.id && (
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
					<ReplyList replies={comment.replies} />
				</div>
			</div>
		</div>
	);
}
