import { MdSend } from "react-icons/md";

interface CommentFormProps {
	commentValue: string;
	setCommentValue: (value: string) => void;
	handleCommentSubmit: () => void;
}

export default function CommentForm({
	commentValue,
	setCommentValue,
	handleCommentSubmit,
}: CommentFormProps) {
	return (
		<div
			className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t flex items-center px-3 py-2"
			style={{ zIndex: 10 }}
		>
			<div className="w-8 h-8 rounded-full bg-grayText mr-2" />
			<input
				className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
				placeholder="댓글을 남겨보세요"
				maxLength={200}
				value={commentValue}
				onChange={(e) => setCommentValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") handleCommentSubmit();
				}}
			/>
			<button
				type="button"
				className="ml-2 text-superLightGray"
				onClick={handleCommentSubmit}
				disabled={!commentValue.trim()}
			>
				<MdSend className="size-5" />
			</button>
		</div>
	);
}
