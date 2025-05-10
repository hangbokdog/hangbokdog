import { MdSend } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import img from "@/assets/logo.png";
import useAuthStore from "@/lib/store/authStore";

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
	const { user } = useAuthStore();

	return (
		<div
			className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t flex gap-2 items-center px-3 py-2"
			style={{ zIndex: 10 }}
		>
			<Avatar className="w-8 h-8 flex justify-center items-center rounded-full">
				<AvatarImage src={user.profileImage || img} />
				<AvatarFallback className="text-center bg-superLightGray text-grayText">
					{user.nickName}
				</AvatarFallback>
			</Avatar>
			<input
				className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
				placeholder="댓글을 남겨보세요"
				maxLength={200}
				value={commentValue}
				onChange={(e) => setCommentValue(e.target.value)}
			/>
			<button
				type="button"
				className="text-superLightGray"
				onClick={handleCommentSubmit}
				disabled={!commentValue.trim()}
			>
				<MdSend className="size-5" />
			</button>
		</div>
	);
}
