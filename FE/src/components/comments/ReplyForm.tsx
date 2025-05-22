import useAuthStore from "@/lib/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import img from "@/assets/logo.png";

interface ReplyFormProps {
	replyValue: string;
	setReplyValue: (value: string) => void;
	replyLength: number;
	setReplyLength: (length: number) => void;
	handleReplySubmit: () => void;
	setReplyOpenId: (id: number | null) => void;
}

export default function ReplyForm({
	replyValue,
	setReplyValue,
	replyLength,
	setReplyLength,
	handleReplySubmit,
	setReplyOpenId,
}: ReplyFormProps) {
	const { user } = useAuthStore();

	return (
		<div className="mt-2 flex flex-col rounded-[8px] bg-background p-2 gap-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<Avatar className="w-8 h-8 flex justify-center items-center rounded-full">
						<AvatarImage src={user.profileImage || img} />
						<AvatarFallback className="text-center bg-superLightGray text-grayText">
							{user.nickName}
						</AvatarFallback>
					</Avatar>
					<div className="font-bold text-xs mb-1">
						{user.nickName}
					</div>
				</div>
				<span
					className={`text-xs ${
						replyLength === 200 ? "text-red" : "text-lightGray"
					}`}
				>
					{replyLength} / 200
				</span>
			</div>
			<textarea
				className="w-full border rounded p-1 text-sm resize-none whitespace-pre-wrap"
				maxLength={200}
				placeholder="답글을 입력하세요."
				value={replyValue}
				onChange={(e) => {
					setReplyValue(e.target.value);
					setReplyLength(e.target.value.length);
				}}
			/>
			<div className="flex justify-end gap-2 mt-1">
				<button
					type="button"
					className="text-primary bg-superLightGray rounded-[8px] px-2 py-1 text-sm"
					onClick={() => {
						setReplyOpenId(null);
						setReplyValue("");
						setReplyLength(0);
					}}
				>
					취소
				</button>
				<button
					type="button"
					className="text-white bg-main rounded-[8px] px-2 py-1 text-sm"
					onClick={handleReplySubmit}
					disabled={!replyValue.trim()}
				>
					등록
				</button>
			</div>
		</div>
	);
}
