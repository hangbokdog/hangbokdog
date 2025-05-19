import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { PostSummaryResponse } from "@/api/post";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostItemProps {
	post: PostSummaryResponse;
	onClick: (id: number) => void;
	className?: string;
	compact?: boolean;
}

export default function PostItem({
	post,
	onClick,
	className = "",
	compact = false,
}: PostItemProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
	};

	const formatLikeCount = (count: number): string => {
		if (count >= 1000) {
			return `${Math.floor(count / 100) / 10}k`;
		}
		return count.toString();
	};

	return (
		<button
			type="button"
			onClick={() => onClick(post.postId)}
			className={`w-full text-left hover:bg-gray-50 active:bg-gray-100 transition-colors ${className}`}
		>
			<div className="flex pt-2">
				<div className="flex flex-col flex-3/4">
					{/* Post title */}
					<div className="mb-2">
						<div
							className={`font-medium text-gray-900 ${compact ? "text-sm leading-5" : "text-base leading-6"} line-clamp-1 overflow-hidden text-ellipsis`}
							title={post.title}
						>
							{post.title}
						</div>
					</div>
					<div className="flex items-center">
						{/* Author info and date */}
						<div className="flex items-center gap-2 w-full">
							<div className="flex items-center min-w-0">
								<Avatar
									className={
										compact
											? "w-4 h-4 ring-2 ring-offset-1 ring-blue-50"
											: "w-6 h-6 ring-2 ring-offset-1 ring-blue-50"
									}
								>
									<AvatarImage src={post.memberImage} />
									<AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
										{post.memberNickName?.charAt(0) || "?"}
									</AvatarFallback>
								</Avatar>
								<div className="ml-2 min-w-0">
									<span
										className={`block text-grayText font-light ${compact ? "text-xs" : "text-sm"} whitespace-nowrap`}
										title={
											post.memberNickName || "이름없음"
										}
									>
										{post.memberNickName || "이름없음"}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-2 ml-auto min-w-0">
								<span
									className={`text-gray-400 ${compact ? "text-[10px]" : "text-xs"} overflow-hidden text-ellipsis whitespace-nowrap`}
								>
									{formatDate(post.createdAt)}
								</span>
								<span
									className={`flex items-center gap-1 ${compact ? "text-xs" : "text-sm"} font-medium ${post.isLiked ? "text-red-500" : "text-gray-500"} overflow-hidden text-ellipsis whitespace-nowrap`}
								>
									<span className="text-xs">댓글</span>
									{formatLikeCount(post.commentCount)}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-1/4 items-center justify-center pl-8">
					<div className="flex bg-superLightBlueGray rounded-sm h-full w-full flex-col justify-center items-center">
						<Heart
							className={cn(
								compact ? "w-3.5 h-3.5" : "w-4.5 h-4.5",
								post.isLiked
									? "fill-red-500 text-red-500"
									: "text-gray-400 hover:text-gray-500",
							)}
						/>
						<span
							className={`${compact ? "text-xs" : "text-sm"} font-medium ${post.isLiked ? "text-red-500" : "text-gray-500"}`}
						>
							{formatLikeCount(post.likeCount)}
						</span>
					</div>
				</div>
			</div>
		</button>
	);
}
