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
			<div className="flex">
				<div className="flex flex-col flex-1">
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
									<AvatarImage
										src={post.memberImage}
										className="object-cover"
									/>
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
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center pl-4 items-center gap-1.5">
					<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50">
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg
							className="w-3 h-3 text-blue-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
						<span
							className={`${compact ? "text-[10px]" : "text-xs"} font-medium text-blue-600`}
						>
							{formatLikeCount(post.commentCount)}
						</span>
					</div>
					<div
						className={cn(
							"flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors",
							post.isLiked ? "bg-red-50" : "bg-gray-50",
						)}
					>
						<Heart
							className={cn(
								"w-3 h-3",
								post.isLiked
									? "fill-red-500 text-red-500"
									: "text-gray-400",
							)}
						/>
						<span
							className={`${compact ? "text-[10px]" : "text-xs"} font-medium ${post.isLiked ? "text-red-600" : "text-gray-600"}`}
						>
							{formatLikeCount(post.likeCount)}
						</span>
					</div>
				</div>
			</div>
		</button>
	);
}
