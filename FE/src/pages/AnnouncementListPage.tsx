import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAnnouncementsAPI } from "@/api/announcement";
import useCenterStore from "@/lib/store/centerStore";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import AnnouncementItem from "@/components/announcement/AnnouncementItem";

export default function AnnouncementListPage() {
	const navigate = useNavigate();
	const { selectedCenter } = useCenterStore();
	const observerRef = useRef<HTMLDivElement | null>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
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
		enabled: !!selectedCenter?.centerId,
	});

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
		navigate(`/announcements/${id}`);
	};

	const allAnnouncements = data?.pages.flatMap((page) => page.data) || [];
	return (
		<div className="flex flex-col min-h-screen bg-gray-50 pb-16">
			{/* 헤더 */}
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="flex items-center justify-between">
						<div className="text-xl font-bold text-gray-800">
							공지사항
						</div>
						{selectedCenter?.status === "MANAGER" && (
							<Link
								to="/announcements/create"
								className="bg-male rounded-sm px-2 py-1 text-white"
							>
								생성하기
							</Link>
						)}
					</div>
				</div>
			</div>

			<div className="flex-1 p-4 max-w-lg mx-auto w-full">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<Loader2 className="w-8 h-8 text-male animate-spin" />
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center mt-10">
						<p className="text-gray-600 mb-4">
							공지사항을 불러오는데 실패했습니다.
						</p>
						<button
							type="button"
							onClick={() => refetch()}
							className="px-4 py-2 bg-male text-white rounded-lg"
						>
							다시 시도
						</button>
					</div>
				) : allAnnouncements.length === 0 ? (
					<div className="text-center py-10">
						<p className="text-gray-500">
							등록된 공지사항이 없습니다.
						</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm overflow-hidden">
						<div className="divide-y divide-gray-100">
							{allAnnouncements.map((announcement) => (
								<AnnouncementItem
									key={announcement.id}
									announcement={announcement}
									onClick={handleAnnouncementClick}
									className="border-b border-gray-100"
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
