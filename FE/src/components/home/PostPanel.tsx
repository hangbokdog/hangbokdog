import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
	fetchAnnouncementsAPI,
	type AnnouncementResponse,
} from "@/api/announcement";
import {
	fetchPostTypesAPI,
	fetchPostsAPI,
	type PostTypeResponse,
	type PostSummaryResponse,
} from "@/api/post";
import useCenterStore from "@/lib/store/centerStore";
import { ChevronRight, Loader2 } from "lucide-react";
import AnnouncementItem from "@/components/announcement/AnnouncementItem";
import { cn } from "@/lib/utils";
import PostItem from "../post/PostItem";

export default function PostPanel() {
	const [announcements, setAnnouncements] = useState<AnnouncementResponse[]>(
		[],
	);
	const [postTypes, setPostTypes] = useState<PostTypeResponse[]>([]);
	const [posts, setPosts] = useState<PostSummaryResponse[]>([]);
	const [activeTab, setActiveTab] = useState<"announcements" | number>(
		"announcements",
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { selectedCenter } = useCenterStore();
	const navigate = useNavigate();
	const tabsContainerRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(4);

	// Fetch post types
	useEffect(() => {
		const fetchPostTypes = async () => {
			if (!selectedCenter?.centerId) return;

			try {
				const types = await fetchPostTypesAPI(
					Number(selectedCenter.centerId),
				);
				setPostTypes(types);
			} catch (err) {
				console.error("게시판 타입을 불러오는데 실패했습니다.", err);
			}
		};

		fetchPostTypes();
	}, [selectedCenter]);

	// Adjust visible tabs based on container width
	useEffect(() => {
		if (!postTypes.length) return;

		const calculateVisibleTabs = () => {
			const container = tabsContainerRef.current;
			if (!container) return;

			// Reset to measure properly
			container.style.overflow = "visible";

			// Always show announcements tab
			const announcementTab = container.children[0] as HTMLElement;
			const announcementWidth = announcementTab?.offsetWidth || 0;

			// Available width minus announcements tab
			const containerWidth =
				container.offsetWidth - announcementWidth - 10; // 10px buffer

			// Measure each additional tab
			let availableWidth = containerWidth;
			let count = 0;

			// Start from index 1 (after announcements tab)
			for (let i = 1; i < container.children.length - 1; i++) {
				const tab = container.children[i] as HTMLElement;
				if (tab) {
					const tabWidth = tab.offsetWidth + 8; // Add gap
					if (availableWidth - tabWidth >= 80) {
						// keep 80px for dropdown
						availableWidth -= tabWidth;
						count++;
					} else {
						break;
					}
				}
			}

			// Set overflow back to auto
			container.style.overflow = "auto";

			setVisibleCount(count);
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

	// Fetch announcements
	useEffect(() => {
		const fetchAnnouncements = async () => {
			if (!selectedCenter?.centerId) return;

			setIsLoading(true);
			setError(null);
			try {
				const response = await fetchAnnouncementsAPI(
					Number(selectedCenter.centerId),
				);
				setAnnouncements(response.data.slice(0, 5));
			} catch (err) {
				console.error("공지사항을 불러오는데 실패했습니다.", err);
				setError("공지사항을 불러오는데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		if (activeTab === "announcements") {
			fetchAnnouncements();
		}
	}, [selectedCenter, activeTab]);

	// Fetch posts for selected post type
	useEffect(() => {
		const fetchPosts = async () => {
			if (!selectedCenter?.centerId || activeTab === "announcements")
				return;

			setIsLoading(true);
			setError(null);
			try {
				const response = await fetchPostsAPI(
					Number(selectedCenter.centerId),
					undefined,
					activeTab as number,
				);
				// Filter posts by the current post type ID - this is now redundant since we filter by API
				setPosts(response.data.slice(0, 5));
			} catch (err) {
				console.error("게시글을 불러오는데 실패했습니다.", err);
				setError("게시글을 불러오는데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPosts();
	}, [selectedCenter, activeTab]);

	const handleAnnouncementClick = (id: number) => {
		navigate(`/posts/${id}`);
	};

	const handlePostClick = (id: number) => {
		navigate(`/posts/${id}`);
	};

	const handleViewAllClick = () => {
		if (activeTab === "announcements") {
			navigate("/posts");
		} else {
			navigate(`/posts?type=${activeTab}`);
		}
	};

	return (
		<div className="flex flex-col mx-2.5 py-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center">
					<div className="bg-blueGray h-5 w-1 rounded-full mr-2" />
					<h3 className="text-lg font-bold">게시글</h3>
				</div>
				<button
					type="button"
					onClick={handleViewAllClick}
					className="flex items-center text-sm text-blue-600 font-medium"
				>
					더보기
					<ChevronRight className="w-4 h-4 ml-0.5" />
				</button>
			</div>

			{/* Horizontal scrollable tabs */}
			<div className="mb-4">
				<div
					ref={tabsContainerRef}
					className="flex overflow-x-auto no-scrollbar gap-2 pb-2"
				>
					<button
						type="button"
						onClick={() => setActiveTab("announcements")}
						className={cn(
							"px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap",
							activeTab === "announcements"
								? "bg-blue-100 text-blue-600"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200",
						)}
					>
						공지사항
					</button>
					{visiblePostTypes.map((type) => (
						<button
							key={type.id}
							type="button"
							onClick={() => setActiveTab(type.id)}
							className={cn(
								"px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap",
								activeTab === type.id
									? "bg-blue-100 text-blue-600"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200",
							)}
						>
							{type.name}
						</button>
					))}

					{hiddenPostTypes.length > 0 && (
						<button
							type="button"
							onClick={handleViewAllClick}
							className={cn(
								"px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap",
								"bg-gray-100 text-gray-600 hover:bg-gray-200",
							)}
						>
							...
						</button>
					)}
				</div>
			</div>

			{/* Content */}
			{isLoading ? (
				<div className="flex justify-center items-center h-24">
					<Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
				</div>
			) : error ? (
				<div className="text-center py-3 text-gray-500">{error}</div>
			) : activeTab === "announcements" ? (
				announcements.length === 0 ? (
					<div className="text-center py-3 text-gray-500">
						공지사항이 없습니다.
					</div>
				) : (
					<div className="flex flex-col">
						{announcements.map((announcement) => (
							<AnnouncementItem
								key={announcement.id}
								announcement={announcement}
								onClick={handleAnnouncementClick}
								compact={true}
								className="border-b border-gray-100"
							/>
						))}
					</div>
				)
			) : posts.length === 0 ? (
				<div className="text-center py-3 text-gray-500">
					게시글이 없습니다.
				</div>
			) : (
				<div className="flex flex-col">
					{posts.map((post) => (
						<PostItem
							key={post.postId}
							post={post}
							onClick={() => handlePostClick(post.postId)}
							className="py-3 px-3 text-left w-full border-b border-gray-300"
							compact={true}
						/>
					))}
				</div>
			)}
		</div>
	);
}
