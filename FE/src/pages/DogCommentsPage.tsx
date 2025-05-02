import { useEffect, useState } from "react";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";

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

export default function DogCommentsPage() {
	const [comments, setComments] = useState<Comment[]>([]);
	const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
	const [replyValue, setReplyValue] = useState("");
	const [replyLength, setReplyLength] = useState(0);
	const [commentValue, setCommentValue] = useState("");

	useEffect(() => {
		// TODO: API 호출로 실제 댓글 데이터를 가져오는 로직 구현
		setComments([
			{
				id: 1,
				content:
					"너무 귀여워요 이런 아이를 유기하다니 천벌 받을 놈들입니다 ㅠㅠ 제발 이 아이가 좋은 사람에게 입양되었으면 좋겠어요..",
				author: "댕댕아 항상아 사랑해",
				createdAt: "2025.04.22. 18:39",
				replies: [
					{
						id: 1,
						content: "뽀냥아 님이 미안해서 사랑해",
						author: "얼레팀",
						createdAt: "2025.04.22. 19:39",
					},
				],
			},
			{
				id: 2,
				content: "맞아요 님이 미안할 따름이죠 ㅠㅠㅠㅠㅠ",
				author: "댕댕아 항상아 사랑해",
				createdAt: "2025.04.22. 18:39",
			},
		]);
	}, []);

	const handleReplySubmit = (commentId: number) => {
		setComments((prev) =>
			prev.map((c) =>
				c.id === commentId
					? {
							...c,
							replies: [
								...(c.replies || []),
								{
									id: Date.now(),
									content: replyValue,
									author: "최준혁",
									createdAt: "2025.04.22. 19:39",
								},
							],
						}
					: c,
			),
		);
		setReplyValue("");
		setReplyOpenId(null);
		setReplyLength(0);
	};

	const handleCommentSubmit = () => {
		if (!commentValue.trim()) return;
		setComments((prev) => [
			...prev,
			{
				id: Date.now(),
				content: commentValue,
				author: "최준혁",
				createdAt: "2025.04.22. 19:39",
			},
		]);
		setCommentValue("");
	};

	return (
		<div className="flex flex-col h-full relative bg-white">
			<CommentList
				comments={comments}
				replyOpenId={replyOpenId}
				setReplyOpenId={setReplyOpenId}
				replyValue={replyValue}
				setReplyValue={setReplyValue}
				replyLength={replyLength}
				setReplyLength={setReplyLength}
				handleReplySubmit={handleReplySubmit}
			/>
			<CommentForm
				commentValue={commentValue}
				setCommentValue={setCommentValue}
				handleCommentSubmit={handleCommentSubmit}
			/>
		</div>
	);
}
