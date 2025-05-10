import { FaRegHeart } from "react-icons/fa";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
import CommentDropdown from "../common/CommentDropdown";
import useCenterStore from "@/lib/store/centerStore";
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
							<FaRegHeart
								className={dogComment.isLiked ? "text-red" : ""}
							/>
							{dogComment.likeCount > 0 && (
								<span className="ml-1">
									{dogComment.likeCount}
								</span>
							)}
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
