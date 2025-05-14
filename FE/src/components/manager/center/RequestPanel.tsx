import { useState, useRef, useCallback, useEffect } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import useCenterStore from "@/lib/store/centerStore";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	fetchCenterJoinRequestAPI,
	approveCenterJoinRequestAPI,
	rejectCenterJoinRequestAPI,
	type CenterJoinRequestResponse,
} from "@/api/center";
import { toast } from "sonner";
import EmptyState from "@/components/common/EmptyState";

// 내부에서 사용할 확장된 요청 타입 (UI에 필요한 옵션 필드 추가)
interface ExtendedJoinRequest extends CenterJoinRequestResponse {
	requestDate?: string;
	message?: string;
}

export default function RequestPanel() {
	const { selectedCenter } = useCenterStore();
	const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
		null,
	);
	const queryClient = useQueryClient();

	// 무한 스크롤 관련 설정
	const observerRef = useRef<IntersectionObserver | null>(null);

	// API를 사용하여 가입 요청 목록 가져오기
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery({
			queryKey: ["centerJoinRequests", selectedCenter?.centerId],
			queryFn: async ({ pageParam }) => {
				if (!selectedCenter?.centerId) {
					return {
						data: [] as CenterJoinRequestResponse[],
						hasNext: false,
						pageToken: null,
					};
				}
				return await fetchCenterJoinRequestAPI(
					selectedCenter.centerId,
					pageParam as string | undefined,
				);
			},
			initialPageParam: null as string | null,
			getNextPageParam: (lastPage) => {
				if (!lastPage || !lastPage.hasNext) return undefined;
				return lastPage.pageToken;
			},
			enabled: !!selectedCenter?.centerId,
		});

	// 모든 요청 목록을 하나의 배열로 합치기
	const allRequests = data?.pages.flatMap((page) => page.data) ?? [];

	// 요청 수락 뮤테이션
	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId: string) =>
			approveCenterJoinRequestAPI(requestId),
		onSuccess: () => {
			toast.success("가입 요청이 승인되었습니다.");
			queryClient.invalidateQueries({
				queryKey: ["centerJoinRequests", selectedCenter?.centerId],
			});
		},
		onError: () => {
			toast.error("요청 승인 중 오류가 발생했습니다.");
		},
	});

	// 요청 거절 뮤테이션
	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId: string) =>
			rejectCenterJoinRequestAPI(requestId),
		onSuccess: () => {
			toast.success("가입 요청이 거절되었습니다.");
			queryClient.invalidateQueries({
				queryKey: ["centerJoinRequests", selectedCenter?.centerId],
			});
		},
		onError: () => {
			toast.error("요청 거절 중 오류가 발생했습니다.");
		},
	});

	// 무한 스크롤 구현을 위한 Intersection Observer
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

	// 컴포넌트 언마운트 시 observer 정리
	useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	// 요청 상세 내용 토글
	const toggleExpandRequest = (id: string) => {
		if (expandedRequestId === id) {
			setExpandedRequestId(null);
		} else {
			setExpandedRequestId(id);
		}
	};

	// 로딩 상태 UI
	if (isLoading) {
		return (
			<div className="flex flex-col">
				<div className="mb-4">
					<h2 className="text-lg font-bold text-gray-800">
						{selectedCenter?.centerName || "센터"} 가입 요청
					</h2>
					<p className="text-sm text-gray-500">
						새로운 봉사자 및 후원자 가입 요청을 관리하세요
					</p>
				</div>
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse"
						>
							<div className="flex items-start gap-3">
								<div className="w-10 h-10 rounded-full bg-gray-200" />
								<div className="flex-1">
									<div className="h-5 bg-gray-200 rounded w-1/4 mb-2" />
									<div className="h-3 bg-gray-100 rounded w-1/3" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<div className="mb-4">
				<h2 className="text-lg font-bold text-gray-800">
					{selectedCenter?.centerName || "센터"} 가입 요청
				</h2>
				<p className="text-sm text-gray-500">
					새로운 봉사자 및 후원자 가입 요청을 관리하세요
				</p>
			</div>

			{/* 요청 목록 */}
			<div className="space-y-3">
				{allRequests.length === 0 ? (
					<EmptyState message="새로운 가입 요청이 없습니다." />
				) : (
					<>
						{allRequests.map((request) => (
							<div
								key={request.centerJoinRequestId}
								className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
							>
								<div className="p-4">
									<div className="flex items-start gap-3">
										<Avatar className="w-10 h-10 border">
											<img
												src={
													request.profileImage ||
													"https://api.dicebear.com/7.x/notionists/svg?seed=default&backgroundColor=b6e3f4"
												}
												alt={request.name}
											/>
										</Avatar>

										<div className="flex-1">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="font-medium text-gray-800">
														{request.name}
													</h3>
													{(
														request as ExtendedJoinRequest
													).requestDate && (
														<p className="text-xs text-gray-500">
															{format(
																new Date(
																	(
																		request as ExtendedJoinRequest
																	)
																		.requestDate ||
																		"",
																),
																"yyyy년 MM월 dd일",
																{ locale: ko },
															)}
															에 요청
														</p>
													)}
												</div>

												<div className="flex items-center space-x-1">
													<button
														type="button"
														className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
														onClick={() =>
															acceptRequest(
																String(
																	request.centerJoinRequestId,
																),
															)
														}
														aria-label="수락"
													>
														<HiCheck className="size-5" />
													</button>
													<button
														type="button"
														className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
														onClick={() =>
															rejectRequest(
																String(
																	request.centerJoinRequestId,
																),
															)
														}
														aria-label="거절"
													>
														<HiX className="size-5" />
													</button>
												</div>
											</div>

											{(request as ExtendedJoinRequest)
												.message && (
												<div className="mt-2">
													<button
														type="button"
														onClick={() =>
															toggleExpandRequest(
																String(
																	request.centerJoinRequestId,
																),
															)
														}
														className="text-sm text-main font-medium"
													>
														{expandedRequestId ===
														String(
															request.centerJoinRequestId,
														)
															? "접기"
															: "메시지 보기"}
													</button>

													{expandedRequestId ===
														String(
															request.centerJoinRequestId,
														) && (
														<p className="mt-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
															{
																(
																	request as ExtendedJoinRequest
																).message
															}
														</p>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						))}

						{/* 무한 스크롤용 요소 */}
						{hasNextPage && (
							<div ref={loadMoreRef} className="py-4">
								{isFetchingNextPage && (
									<div className="flex justify-center">
										<div className="w-8 h-8 border-4 border-t-main border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
									</div>
								)}
							</div>
						)}

						{!hasNextPage && allRequests.length > 0 && (
							<p className="text-center text-sm text-gray-500 py-4">
								더 이상 요청이 없습니다.
							</p>
						)}
					</>
				)}
			</div>
		</div>
	);
}
