import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, MessageCircle, Heart } from "lucide-react";

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
		<div className="flex flex-col p-3 border rounded-lg mb-2 hover:shadow-sm transition-shadow">
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
		</div>
	);
};

export default function PostsTabContent() {
	const [activeTab, setActiveTab] = useState<PostTabType>("written");

	// Dummy data
	const writtenPosts: PostItemProps[] = [
		{
			id: 1,
			title: "강아지 산책시키기 좋은 장소 추천해주세요",
			date: "2024.06.15",
			boardName: "자유게시판",
			commentCount: 5,
			likeCount: 3,
		},
		{
			id: 2,
			title: "강아지 사료 추천 부탁드립니다",
			date: "2024.05.20",
			boardName: "질문게시판",
			commentCount: 10,
			likeCount: 2,
		},
	];

	const commentedPosts: PostItemProps[] = [
		{
			id: 3,
			title: "강아지 백신 접종 후기",
			date: "2024.06.10",
			boardName: "후기게시판",
			commentCount: 8,
		},
		{
			id: 4,
			title: "강아지가 아파요ㅜㅜ",
			date: "2024.06.05",
			boardName: "질문게시판",
			commentCount: 15,
		},
		{
			id: 5,
			title: "강아지 목욕 방법",
			date: "2024.05.28",
			boardName: "정보게시판",
			commentCount: 3,
		},
	];

	const likedPosts: PostItemProps[] = [
		{
			id: 6,
			title: "강아지 훈련 방법 총정리",
			date: "2024.06.18",
			boardName: "정보게시판",
			likeCount: 20,
		},
		{
			id: 7,
			title: "강아지 집 꾸미기",
			date: "2024.05.25",
			boardName: "자유게시판",
			likeCount: 8,
		},
	];

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

	const renderPostList = () => {
		switch (activeTab) {
			case "written":
				return writtenPosts.length > 0 ? (
					<div className="space-y-2">
						{writtenPosts.map((post) => (
							<PostItem key={post.id} {...post} />
						))}
					</div>
				) : (
					renderEmptyState("written")
				);
			case "commented":
				return commentedPosts.length > 0 ? (
					<div className="space-y-2">
						{commentedPosts.map((post) => (
							<PostItem key={post.id} {...post} />
						))}
					</div>
				) : (
					renderEmptyState("commented")
				);
			case "liked":
				return likedPosts.length > 0 ? (
					<div className="space-y-2">
						{likedPosts.map((post) => (
							<PostItem key={post.id} {...post} />
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
			<div className="flex border-b mb-2.5">
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "written"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
					)}
					onClick={() => setActiveTab("written")}
				>
					작성글
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "liked"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
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
