import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicantItem } from "./ApplicantItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import useCenterStore from "@/lib/store/centerStore";
import { getVolunteerApplicantsAPI } from "@/api/volunteer";
import { useRef, useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type {
	ApplicantsListProps,
	VolunteerApplicantsResponse,
	VolunteerApplicant,
} from "@/types/volunteer";

export const ApplicantsList = ({ eventId }: ApplicantsListProps) => {
	const { selectedCenter } = useCenterStore();
	const centerId = selectedCenter?.centerId;
	const [activeTab, setActiveTab] = useState<string>("pending");

	// 날짜를 포맷팅하는 함수
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "yyyy년 M월 d일 (EEE) HH:mm", { locale: ko });
	};

	const {
		data: pendingApplicants,
		fetchNextPage: fetchNextPending,
		hasNextPage: hasNextPending,
		isFetchingNextPage: isFetchingNextPending,
		isLoading: isPendingApplicantsLoading,
	} = useInfiniteQuery<VolunteerApplicantsResponse>({
		queryKey: ["pendingApplicants", centerId, eventId, "pending"],
		queryFn: async ({ pageParam }) => {
			return getVolunteerApplicantsAPI({
				centerId: centerId ?? "",
				eventId,
				status: "PENDING",
				pageToken: pageParam as string | undefined,
			});
		},
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => {
			if (!lastPage) return undefined;
			return lastPage.hasNext ? lastPage.pageToken : undefined;
		},
		enabled: !!centerId,
	});

	const {
		data: approvedApplicants,
		fetchNextPage: fetchNextApproved,
		hasNextPage: hasNextApproved,
		isFetchingNextPage: isFetchingNextApproved,
		isLoading: isApprovedApplicantsLoading,
	} = useInfiniteQuery<VolunteerApplicantsResponse>({
		queryKey: ["approvedApplicants", centerId, eventId, "approved"],
		queryFn: async ({ pageParam }) => {
			return getVolunteerApplicantsAPI({
				centerId: centerId ?? "",
				eventId,
				status: "APPROVED",
				pageToken: pageParam as string | undefined,
			});
		},
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => {
			if (!lastPage) return undefined;
			return lastPage.hasNext ? lastPage.pageToken : undefined;
		},
		enabled: !!centerId,
	});

	const allPendingApplicants =
		pendingApplicants?.pages?.flatMap((page) => page?.data || []) || [];
	const allApprovedApplicants =
		approvedApplicants?.pages?.flatMap((page) => page?.data || []) || [];

	// Observer for infinite scrolling
	const pendingObserverRef = useRef<IntersectionObserver | null>(null);
	const approvedObserverRef = useRef<IntersectionObserver | null>(null);

	const loadMorePendingRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetchingNextPending) return;
			if (pendingObserverRef.current)
				pendingObserverRef.current.disconnect();

			pendingObserverRef.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPending) {
					fetchNextPending();
				}
			});

			if (node) pendingObserverRef.current.observe(node);
		},
		[isFetchingNextPending, fetchNextPending, hasNextPending],
	);

	const loadMoreApprovedRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetchingNextApproved) return;
			if (approvedObserverRef.current)
				approvedObserverRef.current.disconnect();

			approvedObserverRef.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasNextApproved) {
						fetchNextApproved();
					}
				},
			);

			if (node) approvedObserverRef.current.observe(node);
		},
		[isFetchingNextApproved, fetchNextApproved, hasNextApproved],
	);

	useEffect(() => {
		return () => {
			if (pendingObserverRef.current) {
				pendingObserverRef.current.disconnect();
			}
			if (approvedObserverRef.current) {
				approvedObserverRef.current.disconnect();
			}
		};
	}, []);

	return (
		<Tabs
			defaultValue="pending"
			className="mt-4"
			onValueChange={setActiveTab}
		>
			<TabsList className="grid w-full grid-cols-2 bg-superLightBlueGray">
				<TabsTrigger value="pending">
					대기 중 ({allPendingApplicants?.length || 0})
				</TabsTrigger>
				<TabsTrigger value="approved">
					승인됨 ({allApprovedApplicants?.length || 0})
				</TabsTrigger>
			</TabsList>

			<TabsContent value="pending" className="mt-2 space-y-3">
				{isPendingApplicantsLoading ? (
					<>
						<Skeleton className="h-24 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
					</>
				) : allPendingApplicants.length === 0 ? (
					<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
						대기 중인 봉사 신청이 없습니다.
					</div>
				) : (
					<>
						{allPendingApplicants?.map((applicant) => (
							<ApplicantItem
								key={applicant.id}
								applicant={applicant}
								formatDate={formatDate}
								eventId={eventId}
							/>
						))}
						{hasNextPending && (
							<div ref={loadMorePendingRef}>
								{isFetchingNextPending && (
									<Skeleton className="h-24 w-full rounded-xl" />
								)}
							</div>
						)}
					</>
				)}
			</TabsContent>

			<TabsContent value="approved" className="mt-2 space-y-3">
				{isApprovedApplicantsLoading ? (
					<>
						<Skeleton className="h-24 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
					</>
				) : allApprovedApplicants.length === 0 ? (
					<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
						수락된 봉사자가 없습니다.
					</div>
				) : (
					<>
						{allApprovedApplicants?.map((applicant) => (
							<ApplicantItem
								key={applicant.id}
								applicant={applicant}
								formatDate={formatDate}
								isApproved={true}
								eventId={eventId}
							/>
						))}
						{hasNextApproved && (
							<div ref={loadMoreApprovedRef}>
								{isFetchingNextApproved && (
									<Skeleton className="h-24 w-full rounded-xl" />
								)}
							</div>
						)}
					</>
				)}
			</TabsContent>
		</Tabs>
	);
};
