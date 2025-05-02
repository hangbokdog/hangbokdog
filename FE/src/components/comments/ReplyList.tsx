import CommentDropdown from "../common/CommentDropdown";

interface Reply {
	id: number;
	content: string;
	author: string;
	createdAt: string;
}

interface ReplyListProps {
	replies?: Reply[];
}

export default function ReplyList({ replies }: ReplyListProps) {
	if (!replies) return null;

	return (
		<>
			{replies.map((reply) => (
				<div key={reply.id} className="p-2 max-w-full break-words">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 rounded-full bg-grayText flex-shrink-0" />
							<span className="font-bold text-xs">
								{reply.author}
							</span>
							<span className="text-xs text-lightGray">
								{reply.createdAt}
							</span>
						</div>
						<CommentDropdown />
					</div>
					<div className="text-sm mt-1 whitespace-normal break-words">
						{reply.content}
					</div>
				</div>
			))}
		</>
	);
}
