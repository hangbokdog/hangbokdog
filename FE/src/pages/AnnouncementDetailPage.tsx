import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
	fetchAnnouncementDetailAPI,
	deleteAnnouncementAPI,
	type AnnouncementDetailResponse,
} from "@/api/announcement";
import {
	fetchPostDetailAPI,
	deletePostAPI,
	type PostResponse,
	fetchCommentsAPI,
	createCommentAPI,
	type CommentWithRepliesResponse,
	type CommentCreateRequest,
	deleteCommentAPI,
	updateCommentAPI,
	toggleCommentLikeAPI,
	toggleLikeAPI,
} from "@/api/post";
import { fetchDogDetail, type DogDetailResponse } from "@/api/dog";
import {
	Loader2,
	Calendar,
	MoreVertical,
	Edit,
	Trash2,
	Heart,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import PostContentItem from "@/components/common/PostContentItem";
import useCenterStore from "@/lib/store/centerStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAuthStore from "@/lib/store/authStore";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import { DogBreedLabel } from "@/types/dog";
import { calAge } from "@/utils/calAge";

const formatDateWithDay = (dateString: string) => {
	const date = new Date(dateString);
	return format(date, "yyyy.MM.dd(E)", { locale: ko });
};

// Create a union type for post content
type PostContent = AnnouncementDetailResponse | PostResponse | null;

export default function PostDetailPage() {
	const { id } = useParams<{ id: string }>();
	const [searchParams] = useSearchParams();
	const isAnnouncement = searchParams.get("type") === "announcements";

	const [post, setPost] = useState<PostContent>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const navigate = useNavigate();
	const { selectedCenter, isCenterMember } = useCenterStore();
	const { user } = useAuthStore();
	const queryClient = useQueryClient();

	// Comment state
	const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
	const [replyValue, setReplyValue] = useState("");
	const [replyLength, setReplyLength] = useState(0);
	const [commentValue, setCommentValue] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);
	const [likeDisabled, setLikeDisabled] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(0);

	const [dogInfo, setDogInfo] = useState<DogDetailResponse | null>(null);

	useEffect(() => {
		const fetchPostDetail = async () => {
			if (!id) return;

			try {
				setLoading(true);
				if (isAnnouncement && selectedCenter?.centerId) {
					// Fetch announcement
					const data = await fetchAnnouncementDetailAPI(
						Number(id),
						Number(selectedCenter.centerId),
					);
					setPost(data);
				} else {
					// Fetch regular post
					const data = await fetchPostDetailAPI(Number(id));
					setPost(data);
					setIsLiked(data.isLiked);
					setLikeCount(data.likeCount);

					// Fetch dog info if dogId is valid
					if (
						data.dogId &&
						data.dogId !== -1 &&
						selectedCenter?.centerId
					) {
						try {
							const dogData = await fetchDogDetail(
								data.dogId,
								selectedCenter.centerId,
							);
							setDogInfo(dogData);
						} catch (err) {
							console.error("Failed to fetch dog info:", err);
						}
					}
				}
				setError(null);
			} catch (err) {
				console.error("Failed to fetch post:", err);
				setError("게시글을 불러오는데 실패했습니다.");
			} finally {
				setLoading(false);
			}
		};

		fetchPostDetail();
	}, [id, selectedCenter?.centerId, isAnnouncement]);

	// Refresh comments
	const refreshComments = useCallback(() => {
		if (!isAnnouncement && id) {
			queryClient.invalidateQueries({
				queryKey: ["postComments", id],
				refetchType: "all",
			});
		}
	}, [queryClient, id, isAnnouncement]);

	// Fetch comments for posts (not for announcements)
	const { data: comments = [] } = useQuery<CommentWithRepliesResponse[]>({
		queryKey: ["postComments", id],
		queryFn: () => fetchCommentsAPI(Number(id)),
		staleTime: 0,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		enabled: !isAnnouncement && !!id,
	});

	// Create comment mutation
	const { mutate: createComment } = useMutation({
		mutationFn: (data: CommentCreateRequest) =>
			createCommentAPI(Number(id), data),
		onSuccess: () => {
			refreshComments();
			setCommentValue("");
			toast.success("댓글이 등록되었습니다.");
		},
		onError: () => {
			toast.error("댓글 작성에 실패했습니다.");
		},
	});

	// Update comment mutation
	const { mutate: updateComment } = useMutation({
		mutationFn: ({
			commentId,
			content,
		}: {
			commentId: number;
			content: string;
		}) => updateCommentAPI(Number(id), commentId, { content }),
		onSuccess: () => {
			refreshComments();
			toast.success("댓글이 수정되었습니다.");
		},
		onError: () => {
			toast.error("댓글 수정에 실패했습니다.");
		},
	});

	// Delete comment mutation
	const { mutate: deleteComment } = useMutation({
		mutationFn: (commentId: number) =>
			deleteCommentAPI(Number(id), commentId),
		onSuccess: () => {
			refreshComments();
			toast.success("댓글이 삭제되었습니다.");
		},
		onError: () => {
			toast.error("댓글 삭제에 실패했습니다.");
		},
	});

	// Toggle post like mutation
	const { mutate: togglePostLike } = useMutation({
		mutationFn: () => toggleLikeAPI(Number(id)),
		onSuccess: (data) => {
			setIsLiked(data.isLiked);
			setLikeCount((prev) => (data.isLiked ? prev + 1 : prev - 1));
			toast.success(
				data.isLiked
					? "게시글을 좋아요 했습니다."
					: "좋아요를 취소했습니다.",
			);
		},
		onError: () => {
			toast.error("좋아요 처리에 실패했습니다.");
		},
	});

	// Handle post like toggle
	const handleTogglePostLike = () => {
		if (likeDisabled || isAnnouncement) return;
		setLikeDisabled(true);
		togglePostLike();

		// Prevent rapid clicking
		setTimeout(() => {
			setLikeDisabled(false);
		}, 1000);
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleDelete = async () => {
		if (!id || !window.confirm("정말 이 게시글을 삭제하시겠습니까?"))
			return;

		try {
			setIsDeleting(true);
			if (isAnnouncement) {
				await deleteAnnouncementAPI(Number(id));
				sessionStorage.setItem("announcement_refresh_needed", "true");
			} else {
				await deletePostAPI(Number(id));
			}
			navigate(-1);
		} catch (err) {
			console.error("Failed to delete post:", err);
			alert("게시글 삭제에 실패했습니다.");
			setIsDeleting(false);
		}
	};

	// Comment handlers
	const handleReplySubmit = (commentId: number) => {
		if (!replyValue.trim()) return;
		if (!user.nickName) {
			toast.error("사용자 정보를 가져오는데 실패했습니다.");
			return;
		}

		createComment({
			parentId: commentId,
			content: replyValue,
		});
		setReplyValue("");
		setReplyOpenId(null);
		setReplyLength(0);
	};

	const handleCommentSubmit = () => {
		if (!commentValue.trim()) return;
		if (!user.nickName) {
			toast.error("사용자 정보를 가져오는데 실패했습니다.");
			return;
		}

		createComment({
			parentId: null,
			content: commentValue,
		});
	};

	// Get total comment count
	const getTotalCommentCount = () => {
		if (isAnnouncement) return 0;

		let totalCount = 0;
		totalCount += comments.length;
		for (const comment of comments) {
			if (comment.replies) {
				totalCount += comment.replies.length;
			}
		}
		return totalCount;
	};

	// Check if current user is the author
	const isAuthor = () => {
		if (!user || !post) return false;

		if ("authorId" in post) {
			return post.authorId === user.memberId;
		}
		if ("author" in post && post.author) {
			return post.author.id === user.memberId;
		}
		return false;
	};

	// Handle edit
	const handleEdit = () => {
		if (!id) return;

		if (isAnnouncement) {
			navigate(`/posts/edit/${id}?type=announcements`);
		} else {
			navigate(
				`/posts/edit/${id}?type=${searchParams.get("type") || ""}`,
			);
		}
	};

	const handleUpdateComment = (commentId: number, content: string) => {
		updateComment({ commentId, content });
	};

	const handleDeleteComment = (commentId: number) => {
		deleteComment(commentId);
	};

	if (loading)
		return (
			<div className="flex items-center justify-center h-screen bg-white">
				<Loader2 className="w-8 h-8 text-male animate-spin" />
			</div>
		);

	if (error)
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-white">
				<p className="text-gray-600 mb-4">{error}</p>
				<button
					type="button"
					onClick={handleGoBack}
					className="px-4 py-2 bg-male text-white rounded-lg"
				>
					돌아가기
				</button>
			</div>
		);

	if (!post)
		return (
			<div className="flex items-center justify-center h-screen bg-white">
				게시글을 찾을 수 없습니다.
			</div>
		);

	// Helper to get proper content based on post type
	const getTitle = () => {
		if ("announcementId" in post) {
			return post.title;
		}
		return post.title;
	};

	const getContent = () => {
		if ("content" in post) {
			return post.content;
		}
		return "";
	};

	const getAuthorName = () => {
		if ("authorName" in post) {
			return post.authorName;
		}
		if ("author" in post) {
			return post.author.nickName;
		}
		return "알 수 없음";
	};

	const getAuthorImage = () => {
		if ("authorImage" in post) {
			return post.authorImage;
		}
		if ("author" in post && post.author.profileImage) {
			return post.author.profileImage;
		}
		return null;
	};

	const getCreatedAt = () => {
		if ("createdAt" in post) {
			return post.createdAt;
		}
		return new Date().toISOString();
	};

	const getImages = () => {
		if ("imageUrls" in post && Array.isArray(post.imageUrls)) {
			return post.imageUrls;
		}
		if ("images" in post && Array.isArray(post.images)) {
			return post.images;
		}
		return [];
	};

	const postType = isAnnouncement
		? "공지사항"
		: "postType" in post && post.postType
			? post.postType.name
			: "게시글";

	return (
		<div className="flex flex-col min-h-screen bg-white">
			{/* 헤더 */}

			<div className="flex-1 w-full bg-white">
				<div className="bg-white overflow-hidden mb-4">
					{/* 제목 및 작성자 정보 */}
					<div className="p-4 border-b border-gray-100">
						<h2 className="flex justify-between items-start">
							<div>
								<div className="text-sm text-blue-600 mb-1">
									{postType}
								</div>
								<div className="text-xl font-semibold">
									{getTitle()}
								</div>
							</div>
							{isAuthor() && (
								<div className="relative">
									<button
										type="button"
										onClick={() => setMenuOpen(!menuOpen)}
										className="text-gray-500 p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
									>
										<MoreVertical className="w-5 h-5" />
									</button>

									{menuOpen && (
										<div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
											<div className="py-1">
												<button
													type="button"
													onClick={() => {
														handleEdit();
														setMenuOpen(false);
													}}
													className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												>
													<Edit className="w-4 h-4 mr-2" />
													수정하기
												</button>
												<button
													type="button"
													onClick={() => {
														handleDelete();
														setMenuOpen(false);
													}}
													disabled={isDeleting}
													className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
												>
													{isDeleting ? (
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													) : (
														<Trash2 className="w-4 h-4 mr-2" />
													)}
													삭제하기
												</button>
											</div>
										</div>
									)}
								</div>
							)}
						</h2>
						<div className="flex items-center justify-between mt-3">
							<div className="flex gap-2 items-center text-grayText font-light">
								<Avatar
									className={
										"w-6 h-6 ring-2 ring-offset-1 ring-blue-50"
									}
								>
									<AvatarImage
										src={getAuthorImage() || ""}
										className="object-cover"
									/>
									<AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
										{getAuthorName()?.charAt(0) || "?"}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm font-medium">
									{getAuthorName()}
								</span>
							</div>
							<div className="flex items-center text-sm text-grayText">
								<Calendar className="w-4 h-4 mr-1" />
								<span>{formatDateWithDay(getCreatedAt())}</span>
							</div>
						</div>
					</div>

					{/* 본문 내용 */}
					<div className="p-4 bg-white border-b border-gray-200 min-h-[200px]">
						{/* Dog info panel */}
						{!isAnnouncement && dogInfo && (
							<div className="flex flex-col gap-3 mb-8">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-sm text-white bg-male rounded-full px-3 py-1.5">
										언급된 아이
									</span>
								</div>
								<button
									type="button"
									className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200 text-left shadow-[0_0_10px_0_rgba(50,100,200,0.1)]"
									onClick={() =>
										navigate(`/dogs/${dogInfo.dogId}`)
									}
								>
									<div className="flex items-center gap-4">
										<div className="relative">
											<img
												src={dogInfo.profileImageUrl}
												alt={dogInfo.dogName}
												className="w-20 h-20 rounded-2xl object-cover ring-2 ring-offset-2 ring-male/20"
											/>
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="text-lg font-bold text-gray-900 truncate">
													{dogInfo.dogName}
												</h3>
											</div>
											<div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600">
												<span className="inline-flex items-center py-0.5 rounded-full bg-gray-100 text-gray-800">
													{
														DogBreedLabel[
															dogInfo.breed
														]
													}
												</span>
												<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
													{calAge(dogInfo.age)}
												</span>
												<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
													{dogInfo.gender === "MALE"
														? "남"
														: "여"}
												</span>
											</div>
										</div>
									</div>
								</button>
							</div>
						)}

						<div className="prose max-w-none whitespace-pre-wrap mb-6">
							<PostContentItem
								content={getContent()}
								noText="-"
							/>
						</div>

						{/* 이미지 */}
						{getImages().length > 0 && (
							<div className="mt-6 space-y-4">
								{getImages().map((url, index) => (
									<div
										key={url}
										className="rounded-lg overflow-hidden shadow-sm"
									>
										<img
											src={url}
											alt={`게시글 이미지 ${index + 1}`}
											className="w-full h-auto"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Comments section - only for regular posts */}
					{!isAnnouncement && (
						<>
							<div className="p-4 flex items-center justify-between gap-2 border-b border-gray-200">
								<div className="flex items-center gap-1">
									<span className="text-base font-medium">
										댓글
									</span>
									<span className="text-sm font-medium text-blueGray">
										{getTotalCommentCount()}
									</span>
								</div>
								<button
									type="button"
									onClick={handleTogglePostLike}
									disabled={likeDisabled}
									className="flex items-center ml-4 text-grayText hover:text-red-500 transition-colors"
								>
									<Heart
										className={`w-4 h-4 mr-1 ${
											isLiked
												? "fill-red-500 text-red-500"
												: ""
										}`}
									/>
									<span>{likeCount}</span>
								</button>
							</div>

							<div className="bg-gray-50">
								<CommentList
									comments={comments}
									replyOpenId={replyOpenId}
									setReplyOpenId={setReplyOpenId}
									replyValue={replyValue}
									setReplyValue={setReplyValue}
									replyLength={replyLength}
									setReplyLength={setReplyLength}
									handleReplySubmit={handleReplySubmit}
									toggleLike={handleTogglePostLike}
									onUpdateComment={handleUpdateComment}
									onDeleteComment={handleDeleteComment}
								/>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Comment form - only for regular posts */}
			{!isAnnouncement &&
				(isCenterMember ? (
					<div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
						<CommentForm
							commentValue={commentValue}
							setCommentValue={setCommentValue}
							handleCommentSubmit={handleCommentSubmit}
						/>
					</div>
				) : (
					<div
						className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t flex flex-col gap-2 items-center px-4 py-4"
						style={{ zIndex: 10 }}
					>
						<p className="text-grayText text-sm">
							댓글을 작성하려면{" "}
							{selectedCenter?.centerName || "보호소"} 회원으로
							가입해야 합니다.
						</p>
						<button
							type="button"
							className="bg-male rounded-full text-white px-6 py-2 text-sm font-semibold w-full"
							onClick={() => navigate("/center-decision")}
						>
							{selectedCenter?.centerName || "보호소"} 가입
							신청하기
						</button>
					</div>
				))}
		</div>
	);
}
