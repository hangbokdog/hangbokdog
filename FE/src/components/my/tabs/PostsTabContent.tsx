import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, MessageCircle, Heart } from "lucide-react";
import { fetchMyLikedPostsAPI, fetchMyPostsAPI } from "@/api/post";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// Type for the different post categories
type PostTabType = "written" | "commented" | "liked";

// Post item component
interface PostItemProps {
	id: number;
	title: string;
	date: string;
	boardName: string;
	commentCount?: number;
	likeCount?: number;
}

const PostItem = ({
	id,
	title,
	date,
	boardName,
	commentCount,
	likeCount,
}: PostItemProps) => {
	return (
		<Link
			to={`/posts/${id}`}
			className="flex flex-col p-3 border rounded-lg mb-2 hover:shadow-sm transition-shadow"
		>
			<div className="flex items-center justify-between mb-1">
				<span className="text-xs text-blue-600">{boardName}</span>
				<div className="flex items-center text-xs text-gray-500">
					<Calendar className="w-3 h-3 mr-1" />
					<span>{date}</span>
				</div>
			</div>
			<div className="font-medium mb-2 line-clamp-1">{title}</div>
			<div className="flex gap-3">
				{commentCount !== undefined && (
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<MessageCircle className="w-3 h-3" />
						<span>{commentCount}</span>
					</div>
				)}
				{likeCount !== undefined && (
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<Heart className="w-3 h-3" />
						<span>{likeCount}</span>
					</div>
				)}
			</div>
		</Link>
	);
};

export default function PostsTabContent() {
	const [activeTab, setActiveTab] = useState<PostTabType>("written");
	const { selectedCenter } = useCenterStore();
	const renderEmptyState = (type: PostTabType) => {
		const messages = {
			written:
				"아직 작성한 게시글이 없어요.\n다른 회원들과 소통해보세요!",
			commented:
				"아직 댓글을 작성한 게시글이 없어요.\n다양한 게시글에 의견을 남겨보세요!",
			liked: "아직 좋아요한 게시글이 없어요.\n마음에 드는 게시글에 좋아요를 눌러보세요!",
		};

		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-gray-500 whitespace-pre-line">
					{messages[type]}
				</p>
			</div>
		);
	};

	const { data: writtenPosts } = useQuery({
		queryKey: ["writtenPosts"],
		queryFn: () => fetchMyPostsAPI(Number(selectedCenter?.centerId)),
	});

	const { data: likedPosts } = useQuery({
		queryKey: ["likedPosts"],
		queryFn: () => fetchMyLikedPostsAPI(Number(selectedCenter?.centerId)),
	});

	const renderPostList = () => {
		switch (activeTab) {
			case "written":
				return (writtenPosts?.length ?? 0) > 0 ? (
					<div className="space-y-2">
						{writtenPosts?.map((post) => (
							<PostItem
								key={post.postId}
								id={post.postId}
								title={post.title}
								date={post.createdAt}
								boardName={post.postTypeName}
								commentCount={post.commentCount}
								likeCount={post.likeCount}
							/>
						))}
					</div>
				) : (
					renderEmptyState("written")
				);
			case "liked":
				return (likedPosts?.length ?? 0) > 0 ? (
					<div className="space-y-2">
						{likedPosts?.map((post) => (
							<PostItem
								key={post.postId}
								id={post.postId}
								title={post.title}
								date={post.createdAt}
								boardName={post.postTypeName}
								commentCount={post.commentCount}
								likeCount={post.likeCount}
							/>
						))}
					</div>
				) : (
					renderEmptyState("liked")
				);
			default:
				return null;
		}
	};

	return (
		<div>
			{/* Post Tabs */}
			<div className="flex gap-2 mb-4 px-2">
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "written"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("written")}
				>
					작성글
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "liked"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("liked")}
				>
					좋아요
				</button>
			</div>

			<div className="p-2">{renderPostList()}</div>
		</div>
	);
}
