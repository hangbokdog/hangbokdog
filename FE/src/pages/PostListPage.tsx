import { useEffect, useRef, useState } from "react";
import {
	Link,
	useNavigate,
	useLocation,
	useSearchParams,
} from "react-router-dom";
import { fetchAnnouncementsAPI } from "@/api/announcement";
import { fetchPostsAPI, fetchPostTypesAPI } from "@/api/post";
import useCenterStore from "@/lib/store/centerStore";
import { ChevronDown, Loader2, PlusCircle } from "lucide-react";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import AnnouncementItem from "@/components/announcement/AnnouncementItem";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostItem from "@/components/post/PostItem";

// Key for announcement refresh in sessionStorage
const ANNOUNCEMENT_REFRESH_KEY = "announcement_refresh_needed";

export default function PostListPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();
	const { selectedCenter } = useCenterStore();
	const observerRef = useRef<HTMLDivElement | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const tabsContainerRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(2);

	// Get the type from URL params or default to "announcements"
	const currentType = searchParams.get("type") || "announcements";

	// Parse the post type ID if it's not "announcements"
	const currentPostTypeId =
		currentType !== "announcements"
			? Number.parseInt(currentType, 10)
			: null;

	// Fetch post types
	const { data: postTypes = [] } = useQuery({
		queryKey: ["postTypes", selectedCenter?.centerId],
		queryFn: () => fetchPostTypesAPI(Number(selectedCenter?.centerId)),
		enabled: !!selectedCenter?.centerId,
	});

	// Adjust visible tabs based on container width
	useEffect(() => {
		if (!postTypes.length) return;

		const calculateVisibleTabs = () => {
			// 항상 3개만 보이도록 고정
			setVisibleCount(2);
		};

		// Calculate on initial render
		calculateVisibleTabs();

		// Recalculate on window resize
		const handleResize = () => {
			calculateVisibleTabs();
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [postTypes.length]);

	// Visible post types (dynamically calculated)
	const visiblePostTypes = postTypes.slice(0, visibleCount);
	const hiddenPostTypes =
		postTypes.length > visibleCount ? postTypes.slice(visibleCount) : [];

	const {
		data: announcementsData,
		fetchNextPage: fetchNextAnnouncements,
		hasNextPage: hasNextAnnouncementsPage,
		isFetchingNextPage: isFetchingNextAnnouncementsPage,
		isLoading: isLoadingAnnouncements,
		isError: isAnnouncementsError,
		refetch: refetchAnnouncements,
	} = useInfiniteQuery({
		queryKey: ["announcements", selectedCenter?.centerId],
		queryFn: async ({ pageParam }) => {
			return fetchAnnouncementsAPI(
				Number(selectedCenter?.centerId),
				pageParam,
			);
		},
		getNextPageParam: (lastPage) => {
			return lastPage.hasNext ? lastPage.pageToken : undefined;
		},
		initialPageParam: undefined as string | undefined,
		enabled: !!selectedCenter?.centerId && currentType === "announcements",
	});

	const {
		data: postsData,
		fetchNextPage: fetchNextPosts,
		hasNextPage: hasNextPostsPage,
		isFetchingNextPage: isFetchingNextPostsPage,
		isLoading: isLoadingPosts,
		isError: isPostsError,
		refetch: refetchPosts,
	} = useInfiniteQuery({
		queryKey: ["posts", selectedCenter?.centerId, currentPostTypeId],
		queryFn: async ({ pageParam }) => {
			return fetchPostsAPI(
				Number(selectedCenter?.centerId),
				pageParam,
				currentPostTypeId || undefined,
			);
		},
		getNextPageParam: (lastPage) => {
			return lastPage.hasNext ? lastPage.pageToken : undefined;
		},
		initialPageParam: undefined as string | undefined,
		enabled: !!selectedCenter?.centerId && !!currentPostTypeId,
	});

	// Convenience variables for the UI
	const isLoading =
		currentType === "announcements"
			? isLoadingAnnouncements
			: isLoadingPosts;
	const isError =
		currentType === "announcements" ? isAnnouncementsError : isPostsError;
	const refetch =
		currentType === "announcements" ? refetchAnnouncements : refetchPosts;
	const fetchNextPage =
		currentType === "announcements"
			? fetchNextAnnouncements
			: fetchNextPosts;
	const hasNextPage =
		currentType === "announcements"
			? hasNextAnnouncementsPage
			: hasNextPostsPage;
	const isFetchingNextPage =
		currentType === "announcements"
			? isFetchingNextAnnouncementsPage
			: isFetchingNextPostsPage;

	useEffect(() => {
		if (currentType === "announcements") {
			refetchAnnouncements();
		} else {
			refetchPosts();
		}
	}, [currentType, refetchAnnouncements, refetchPosts]);

	useEffect(() => {
		const shouldRefresh = sessionStorage.getItem(ANNOUNCEMENT_REFRESH_KEY);
		if (shouldRefresh) {
			queryClient.invalidateQueries({
				queryKey: ["announcements", selectedCenter?.centerId],
			});
			// Clear the flag
			sessionStorage.removeItem(ANNOUNCEMENT_REFRESH_KEY);
		}
	}, [queryClient, selectedCenter?.centerId]);

	useEffect(() => {
		const shouldRefresh = location.state?.refresh;
		if (shouldRefresh) {
			if (currentType === "announcements") {
				queryClient.invalidateQueries({
					queryKey: ["announcements", selectedCenter?.centerId],
				});
			} else {
				queryClient.invalidateQueries({
					queryKey: [
						"posts",
						selectedCenter?.centerId,
						currentPostTypeId,
					],
				});
			}
			navigate(location.pathname + location.search, {
				replace: true,
				state: {},
			});
		}
	}, [
		location,
		queryClient,
		navigate,
		selectedCenter?.centerId,
		currentType,
		currentPostTypeId,
	]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage
				) {
					fetchNextPage();
				}
			},
			{ threshold: 0.5 },
		);

		const currentObserverRef = observerRef.current;
		if (currentObserverRef) {
			observer.observe(currentObserverRef);
		}

		return () => {
			if (currentObserverRef) {
				observer.unobserve(currentObserverRef);
			}
		};
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const handleAnnouncementClick = (id: number) => {
		navigate(`/posts/${id}?type=announcements`);
	};
	const handlePostClick = (id: number) => {
		navigate(`/posts/${id}?type=${currentType}`);
	};

	const handleTypeChange = (type: string) => {
		// Use replace: true to prevent adding to browser history stack
		navigate(`${location.pathname}?type=${type}`, { replace: true });
	};

	const getCurrentTypeTitle = () => {
		if (currentType === "announcements") return "공지사항";
		const type = postTypes.find((t) => t.id === currentPostTypeId);
		return type?.name || "게시글";
	};

	const getCreateLink = () => {
		if (currentType === "announcements") return "/posts/create";
		return `/posts/create?type=${currentType}`;
	};

	const allAnnouncements =
		announcementsData?.pages.flatMap((page) => page.data) || [];
	const allPosts = postsData?.pages.flatMap((page) => page.data) || [];
	const items = currentType === "announcements" ? allAnnouncements : allPosts;

	return (
		<div className="flex flex-col min-h-[calc(100vh-3rem)] max-h-[calc(100vh-3rem)] overflow-hidden">
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="flex items-center justify-between mb-2">
						{selectedCenter?.status === "MANAGER" && (
							<div className="flex gap-2">
								<Link
									to="/post/type-create"
									className="bg-teal-500 rounded-sm px-2 py-1 text-white flex items-center text-sm"
								>
									<PlusCircle className="w-3 h-3 mr-1" />{" "}
									게시판 관리
								</Link>
							</div>
						)}
					</div>

					{/* Post type navigation */}
					<div className="flex items-center relative">
						<div
							ref={tabsContainerRef}
							className="flex overflow-x-auto no-scrollbar gap-2 py-1"
						>
							<button
								type="button"
								onClick={() =>
									handleTypeChange("announcements")
								}
								className={cn(
									"px-3 py-1 rounded-full text-sm whitespace-nowrap",
									currentType === "announcements"
										? "bg-blue-100 text-blue-600"
										: "bg-gray-100 text-gray-600",
								)}
							>
								공지사항
							</button>

							{visiblePostTypes.map((type) => (
								<button
									key={type.id}
									type="button"
									onClick={() =>
										handleTypeChange(String(type.id))
									}
									className={cn(
										"px-3 py-1 rounded-full text-sm whitespace-nowrap",
										currentType === String(type.id)
											? "bg-blue-100 text-blue-600"
											: "bg-gray-100 text-gray-600",
									)}
								>
									{type.name}
								</button>
							))}

							{hiddenPostTypes.length > 0 && (
								<DropdownMenu>
									<DropdownMenuTrigger className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm whitespace-nowrap flex items-center">
										더보기
										<ChevronDown className="w-3 h-3 ml-1" />
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="min-w-32 py-1"
									>
										{hiddenPostTypes.map((type) => (
											<DropdownMenuItem
												key={type.id}
												onClick={() =>
													handleTypeChange(
														String(type.id),
													)
												}
												className={cn(
													"px-4 py-2 text-sm cursor-pointer",
													currentType ===
														String(type.id) &&
														"bg-blue-50 text-blue-600 focus:bg-blue-50",
												)}
											>
												{type.name}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>
					<div className="px-1 pt-2 text-xl font-bold text-gray-800 flex justify-between items-center">
						{getCurrentTypeTitle()}
						{(currentType !== "announcements" ||
							selectedCenter?.status === "MANAGER") && (
							<Link
								to={getCreateLink()}
								className="bg-male text-sm rounded-sm px-2 py-1 text-white"
							>
								글 작성
							</Link>
						)}
					</div>
				</div>
			</div>

			<div className="flex-1 py-2 max-w-lg mx-auto w-full overflow-y-auto">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Loader2 className="w-8 h-8 text-male animate-spin" />
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center mt-10">
						<p className="text-gray-600 mb-4">
							게시글을 불러오는데 실패했습니다.
						</p>
						<button
							type="button"
							onClick={() => refetch()}
							className="px-4 py-2 bg-male text-white rounded-lg"
						>
							다시 시도
						</button>
					</div>
				) : items.length === 0 ? (
					<div className="text-center py-10">
						<p className="text-gray-500">
							등록된 {getCurrentTypeTitle()}이(가) 없습니다.
						</p>
					</div>
				) : (
					<div className="bg-white overflow-hidden">
						<div className="divide-y divide-gray-200">
							{currentType === "announcements"
								? allAnnouncements.map((announcement) => (
										<AnnouncementItem
											key={announcement.id}
											announcement={announcement}
											onClick={handleAnnouncementClick}
											className="border-b border-gray-300"
										/>
									))
								: allPosts.map((post) => (
										<PostItem
											key={post.postId}
											post={post}
											onClick={() =>
												handlePostClick(post.postId)
											}
											className="py-3 px-3 text-left w-full border-b border-gray-300"
										/>
									))}
						</div>

						{/* 무한 스크롤 로더 */}
						{hasNextPage && (
							<div
								ref={observerRef}
								className="py-4 flex justify-center"
							>
								{isFetchingNextPage ? (
									<Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
								) : (
									<span className="text-sm text-gray-400">
										스크롤하여 더 불러오기
									</span>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
