import { getClosedVolunteerAPI } from "@/api/volunteer";
import AllClosedVolunteer from "@/components/volunteer/AllClosedVolunteer";
import useCenterStore from "@/lib/store/centerStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback, useEffect } from "react";
import type { ClosedVolunteerResponse, Volunteer } from "@/types/volunteer";
import {
	ClosedVolunteerListSkeleton,
	LoadingMoreSkeleton,
	NoMoreDataMessage,
} from "@/components/volunteer/SkeletonComponents";
import EmptyState from "@/components/common/EmptyState";

export default function ClosedVolunteerListPage() {
	const centerId = useCenterStore.getState().selectedCenter?.centerId;

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery<ClosedVolunteerResponse>({
			queryKey: ["volunteers", "all", "closed", centerId],
			queryFn: async ({ pageParam }) => {
				if (!centerId) {
					return await Promise.resolve({
						data: [] as Volunteer[],
						hasNext: false,
						pageToken: "",
					});
				}
				return await getClosedVolunteerAPI({
					centerId,
					pageToken: pageParam as string | null,
				});
			},
			initialPageParam: null as string | null,
			getNextPageParam: (lastPage) => {
				if (!lastPage || !lastPage.hasNext) return undefined;
				return lastPage.pageToken;
			},
			enabled: !!centerId,
		});

	const allVolunteers = data?.pages.flatMap((page) => page.data) ?? [];

	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetchingNextPage) return;
			if (observerRef.current) observerRef.current.disconnect();

			observerRef.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			});

			if (node) observerRef.current.observe(node);
		},
		[isFetchingNextPage, fetchNextPage, hasNextPage],
	);

	useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	return (
		<div className="flex flex-col mx-2.5 mt-2.5">
			{isLoading ? (
				<ClosedVolunteerListSkeleton />
			) : allVolunteers.length > 0 ? (
				<>
					<AllClosedVolunteer volunteers={allVolunteers} />
					{hasNextPage ? (
						<div ref={loadMoreRef}>
							{isFetchingNextPage && <LoadingMoreSkeleton />}
						</div>
					) : (
						<NoMoreDataMessage message="더 이상 마감된 봉사활동이 없습니다." />
					)}
				</>
			) : (
				<div className="flex flex-col">
					<span className="text-xl font-bold mb-2.5">
						전체 마감된 봉사활동
					</span>
					<EmptyState message="마감된 봉사활동이 없습니다." />
				</div>
			)}
		</div>
	);
}
