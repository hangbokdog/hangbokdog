import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import useCenterStore from "@/lib/store/centerStore";
import {
	fetchCenterMembersAPI,
	updateMemberGradeAPI,
	deleteCenterMemberAPI,
	fetchCenterMemberAPI,
	fetchCenterStatisticsAPI,
	kickOutCenterMemberAPI,
	promoteCenterMemberAPI,
} from "@/api/center";
import type {
	CenterMember,
	CenterMembersResponse,
	CenterMemberThumb,
	CenterStatisticsResponse,
} from "@/types/center";
import {
	MdSearch,
	MdPersonRemove,
	MdArrowUpward,
	MdEmail,
	MdCalendarMonth,
	MdChevronRight,
	MdWarning,
	MdOutlinePhone,
	MdAccessTime,
	MdPerson,
	MdSupervisorAccount,
	MdGroups,
} from "react-icons/md";
import { toast } from "sonner";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

// 디바운스 훅
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default function MembersPanel() {
	const { selectedCenter } = useCenterStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms 디바운스
	const [isLoaded, setIsLoaded] = useState(false);
	const [activeFilter, setActiveFilter] = useState<
		"전체" | "매니저" | "회원"
	>("전체");
	const [selectedMemberThumb, setSelectedMemberThumb] =
		useState<CenterMemberThumb | null>(null);
	const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(
		null,
	);
	const [showConfirmPromote, setShowConfirmPromote] = useState<number | null>(
		null,
	);
	const [showConfirmDemote, setShowConfirmDemote] = useState<number | null>(
		null,
	);
	const queryClient = useQueryClient();

	const { data: centerStatistics } = useQuery<CenterStatisticsResponse>({
		queryKey: ["centerStatistics", selectedCenter?.centerId],
		queryFn: () => fetchCenterStatisticsAPI(selectedCenter?.centerId || ""),
		enabled: !!selectedCenter?.centerId,
	});

	const { mutate: kickOutMember } = useMutation({
		mutationFn: (memberId: number) =>
			kickOutCenterMemberAPI(
				selectedCenter?.centerId || "",
				memberId.toString(),
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["centerMembers", selectedCenter?.centerId],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerStatistics", selectedCenter?.centerId],
			});
			setShowConfirmDelete(null);
			setSelectedMemberThumb(null);
			toast.success("회원이 추방되었습니다.");
		},
		onError: () => {
			setShowConfirmDelete(null);
			toast.error("회원 추방에 실패했습니다.");
		},
	});

	const { mutate: promoteMember, isPending: isPromoting } = useMutation({
		mutationFn: (memberId: number) =>
			promoteCenterMemberAPI(
				selectedCenter?.centerId || "",
				memberId.toString(),
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["centerMembers", selectedCenter?.centerId],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerStatistics", selectedCenter?.centerId],
			});
			setSelectedMemberThumb(null);
			setShowConfirmPromote(null);
			setShowConfirmDemote(null);
			toast.success("회원이 승급되었습니다.");
		},
		onError: () => {
			setSelectedMemberThumb(null);
			setShowConfirmPromote(null);
			setShowConfirmDemote(null);
			toast.error("회원 승급에 실패했습니다.");
		},
	});

	// 선택한 회원의 상세 정보 조회
	const { data: selectedMember, isLoading: isLoadingMember } =
		useQuery<CenterMember>({
			queryKey: [
				"centerMember",
				selectedCenter?.centerId,
				selectedMemberThumb?.id,
			],
			queryFn: async () => {
				if (!selectedCenter?.centerId || !selectedMemberThumb?.id) {
					throw new Error("센터 ID 또는 회원 ID가 없습니다.");
				}
				return await fetchCenterMemberAPI(
					selectedCenter.centerId,
					selectedMemberThumb.id,
				);
			},
			enabled: !!selectedCenter?.centerId && !!selectedMemberThumb?.id,
		});

	// 무한 스크롤을 위한 IntersectionObserver 설정
	const observerRef = useRef<IntersectionObserver | null>(null);

	// useInfiniteQuery를 사용하여 데이터 페이징 처리
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
	} = useInfiniteQuery<CenterMembersResponse>({
		queryKey: [
			"centerMembers",
			selectedCenter?.centerId,
			debouncedSearchQuery,
			activeFilter,
		],
		queryFn: async ({ pageParam }) => {
			if (!selectedCenter?.centerId) {
				return {
					memberResponses: {
						data: [],
						pageToken: null,
						hasNext: false,
					},
					count: 0,
				} as CenterMembersResponse;
			}
			// API에 맞게 필터 변환 (전체는 undefined, 매니저는 MANAGER, 회원은 USER)
			const grade =
				activeFilter === "전체"
					? undefined
					: activeFilter === "매니저"
						? "MANAGER"
						: "USER";

			// 검색어가 있으면 searchWord로 전달
			return await fetchCenterMembersAPI(
				selectedCenter.centerId,
				grade,
				debouncedSearchQuery || undefined,
				pageParam as string | null,
			);
		},
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => {
			if (!lastPage || !lastPage.memberResponses.hasNext)
				return undefined;
			return lastPage.memberResponses.pageToken;
		},
		enabled: !!selectedCenter?.centerId,
	});

	// 모든 회원 목록 플랫하게 가져오기
	const allMembers =
		data?.pages.flatMap((page) => page.memberResponses.data) ?? [];

	// 현재 필터에 대한 총 카운트 값 가져오기
	const currentFilterCount = data?.pages[0]?.count ?? 0;

	// centerStatistics에서 회원 통계 데이터 가져오기
	const totalMemberCount = centerStatistics?.totalMemberCount ?? 0;
	const managerCount = centerStatistics?.managerMemberCount ?? 0;
	const userCount = centerStatistics?.normalMemberCount ?? 0;

	// API에서 이미 필터링된 데이터가 오므로 표시된 회원 수는 바로 계산
	const filteredCount = allMembers.length;

	// 검색 쿼리가 변경될 때 자동으로 API 호출
	useEffect(() => {
		if (debouncedSearchQuery !== searchQuery) {
			setIsSearching(true);
		} else if (debouncedSearchQuery === searchQuery && isSearching) {
			refetch().finally(() => setIsSearching(false));
		}
	}, [debouncedSearchQuery, refetch, searchQuery, isSearching]);

	// 필터 변경 시 데이터 새로 가져오기
	useEffect(() => {
		if (selectedCenter?.centerId) {
			refetch();
			// 필터 변경 시 centerStatistics도 같이 갱신
			queryClient.invalidateQueries({
				queryKey: ["centerStatistics", selectedCenter?.centerId],
			});
		}
	}, [selectedCenter?.centerId, refetch, queryClient]);

	// 로드 더보기 참조 콜백
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

	useEffect(() => {
		const timer = setTimeout(() => setIsLoaded(true), 300);
		return () => clearTimeout(timer);
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// 폼 제출 시에는 디바운스를 기다리지 않고 즉시 검색
		refetch();
	};

	// API에서 이미 필터링된 데이터가 오므로 추가 필터링은 필요 없음
	const filteredMembers = allMembers || [];

	const handleMemberClick = (member: CenterMemberThumb) => {
		setSelectedMemberThumb(member);
	};

	const handlePromoteToManager = (memberId: number) => {
		if (showConfirmPromote === memberId) {
			promoteMember(memberId);
		} else {
			setShowConfirmPromote(memberId);
			// 3초 후에 확인 다이얼로그 자동 닫기
			setTimeout(() => setShowConfirmPromote(null), 3000);
		}
	};

	const handleDeleteRequest = (memberId: number) => {
		if (showConfirmDelete === memberId) {
			kickOutMember(memberId);
		} else {
			setShowConfirmDelete(memberId);
			// 3초 후에 확인 다이얼로그 자동 닫기
			setTimeout(() => setShowConfirmDelete(null), 3000);
		}
	};

	const handleDeleteCancel = () => {
		setShowConfirmDelete(null);
	};

	const handlePromoteCancel = () => {
		setShowConfirmPromote(null);
	};

	const handleDemoteCancel = () => {
		setShowConfirmDemote(null);
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "yyyy년 MM월 dd일", { locale: ko });
	};

	const formatPhoneNumber = (phone: string) => {
		// 010-0000-0000 형식으로 변환
		if (phone.length === 11) {
			return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
		}
		return phone;
	};

	return (
		<div
			className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
		>
			{/* 헤더 영역 */}
			<div className="mb-5">
				<div className="flex items-center justify-between mb-1">
					<h2 className="text-lg font-bold text-gray-800">
						{selectedCenter?.centerName || "센터"} 회원 관리
					</h2>
				</div>

				{/* 멤버 통계 요약 */}
				<div className="bg-white shadow-sm rounded-lg p-2 mb-4 flex justify-around">
					<div className="flex flex-col items-center justify-center p-2">
						<div className="flex items-center text-sm font-medium text-gray-800">
							<MdGroups className="text-blue-500 mr-1" />
							전체
						</div>
						<p className="text-2xl font-bold text-blue-600">
							{totalMemberCount}
						</p>
					</div>
					<div className="w-px h-12 my-auto bg-gray-200" />
					<div className="flex flex-col items-center justify-center p-2">
						<div className="flex items-center text-sm font-medium text-gray-800">
							<MdSupervisorAccount className="text-orange-500 mr-1" />
							매니저
						</div>
						<p className="text-2xl font-bold text-orange-600">
							{managerCount}
						</p>
					</div>
					<div className="w-px h-12 my-auto bg-gray-200" />
					<div className="flex flex-col items-center justify-center p-2">
						<div className="flex items-center text-sm font-medium text-gray-800">
							<MdPerson className="text-green-500 mr-1" />
							회원
						</div>
						<p className="text-2xl font-bold text-green-600">
							{userCount}
						</p>
					</div>
				</div>
			</div>

			{/* 검색 폼 */}
			<div className="mb-4 relative">
				<form onSubmit={handleSearchSubmit} className="relative">
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="회원 이름 또는 닉네임 검색"
						className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
						<MdSearch className="size-5 text-gray-400" />
					</div>
					<button
						type="submit"
						className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-male text-white rounded-lg text-sm"
					>
						검색
					</button>
				</form>

				{/* 검색 중 표시 */}
				{isSearching && (
					<Spinner className="absolute right-24 top-1/2 transform -translate-y-1/2 size-6" />
				)}
			</div>

			{/* 필터 버튼 */}
			<div className="flex gap-2 mb-4 overflow-x-auto pb-1.5">
				<button
					key="전체"
					type="button"
					className={`min-w-[80px] px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex items-center justify-center ${
						activeFilter === "전체"
							? "bg-blue-500 text-white"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					}`}
					onClick={() => setActiveFilter("전체")}
				>
					<MdGroups
						className={`mr-1 ${activeFilter === "전체" ? "text-white" : "text-blue-500"}`}
					/>
					전체
					{activeFilter === "전체" && (
						<span className="ml-1 bg-blue-400 text-white text-xs px-1.5 py-0.5 rounded-full">
							{currentFilterCount}
						</span>
					)}
				</button>
				<button
					key="매니저"
					type="button"
					className={`min-w-[80px] px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex items-center justify-center ${
						activeFilter === "매니저"
							? "bg-orange-500 text-white"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					}`}
					onClick={() => setActiveFilter("매니저")}
				>
					<MdSupervisorAccount
						className={`mr-1 ${activeFilter === "매니저" ? "text-white" : "text-orange-500"}`}
					/>
					매니저
					{activeFilter === "매니저" && (
						<span className="ml-1 bg-orange-400 text-white text-xs px-1.5 py-0.5 rounded-full">
							{currentFilterCount}
						</span>
					)}
				</button>
				<button
					key="회원"
					type="button"
					className={`min-w-[80px] px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex items-center justify-center ${
						activeFilter === "회원"
							? "bg-green-500 text-white"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200"
					}`}
					onClick={() => setActiveFilter("회원")}
				>
					<MdPerson
						className={`mr-1 ${activeFilter === "회원" ? "text-white" : "text-green-500"}`}
					/>
					회원
					{activeFilter === "회원" && (
						<span className="ml-1 bg-green-400 text-white text-xs px-1.5 py-0.5 rounded-full">
							{currentFilterCount}
						</span>
					)}
				</button>
			</div>

			{/* 검색 결과 요약 */}
			{searchQuery && !isSearching && (
				<div className="mb-3 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center justify-center">
					<MdSearch className="mr-1" />"{searchQuery}" 검색 결과:{" "}
					{filteredCount}명
					<span className="ml-1">(전체 {totalMemberCount}명 중)</span>
				</div>
			)}

			{/* 회원 목록 */}
			{isLoading ? (
				<div className="flex justify-center items-center h-40">
					<Spinner className="size-8" />
				</div>
			) : filteredMembers.length === 0 ? (
				<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
					<p className="text-gray-500">회원이 없습니다</p>
				</div>
			) : (
				<div className="space-y-3">
					{filteredMembers.map((member) => (
						<motion.div
							key={member.id}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
							className={cn(
								"bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 active:scale-[0.99]",
								member.centerGrade === "MANAGER"
									? "border-l-4 border-l-orange-500"
									: "border-gray-100",
							)}
							onClick={() => handleMemberClick(member)}
						>
							<div className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="relative">
											<img
												src={
													member.profileImage ||
													"https://via.placeholder.com/40"
												}
												alt={member.name}
												className="size-12 rounded-full object-cover border-2 border-white shadow-sm"
											/>
											<span
												className={cn(
													"absolute bottom-0 right-0 size-3 rounded-full border-2 border-white",
													member.centerGrade ===
														"MANAGER"
														? "bg-orange-500"
														: "bg-male",
												)}
											/>
										</div>
										<div>
											<div className="flex items-center">
												<h3 className="font-medium text-gray-900">
													{member.name}
												</h3>
												<span className="ml-2 text-sm text-gray-500">
													({member.nickname})
												</span>
											</div>
											<span
												className={cn(
													"inline-block mt-1 px-2 py-0.5 rounded-full text-xs",
													member.centerGrade ===
														"MANAGER"
														? "bg-orange-100 text-orange-600"
														: "bg-green-100 text-green-600",
												)}
											>
												{member.centerGrade ===
												"MANAGER"
													? "매니저"
													: "회원"}
											</span>
										</div>
									</div>
									<div className="flex items-center">
										<MdChevronRight className="size-5 text-gray-400" />
									</div>
								</div>
							</div>
						</motion.div>
					))}

					{/* 무한 스크롤 로딩 트리거 */}
					{hasNextPage && (
						<div ref={loadMoreRef} className="py-4">
							{isFetchingNextPage && (
								<div className="flex justify-center">
									<Spinner className="size-8" />
								</div>
							)}
						</div>
					)}

					{/* 표시된 회원 수 정보 */}
					{!hasNextPage && filteredMembers.length > 0 && (
						<div className="py-4 text-center">
							<span className="bg-gray-100 text-gray-700 text-sm px-3 py-2 rounded-full inline-flex items-center">
								<MdPerson className="mr-1" />
								{searchQuery
									? `${filteredCount}명 표시 중 (전체 ${totalMemberCount}명)`
									: `총 ${totalMemberCount}명의 회원이 있습니다`}
							</span>
						</div>
					)}
				</div>
			)}

			{/* 회원 상세 모달 */}
			{selectedMemberThumb && (
				<div
					className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
					onClick={() => setSelectedMemberThumb(null)}
					onKeyDown={(e) => {
						if (e.key === "Escape") setSelectedMemberThumb(null);
					}}
					// biome-ignore lint/a11y/useSemanticElements:
					role="button"
					tabIndex={0}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: "spring", damping: 20 }}
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-auto"
						// biome-ignore lint/a11y/useSemanticElements:
						role="dialog"
						aria-modal="true"
						tabIndex={-1}
					>
						{isLoadingMember ? (
							<div className="flex justify-center items-center h-[300px]">
								<Spinner className="size-8" />
							</div>
						) : selectedMember ? (
							<div className="relative p-5">
								<button
									type="button"
									className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
									onClick={() => setSelectedMemberThumb(null)}
								>
									✕
								</button>

								{/* 회원 기본 정보 섹션 */}
								<div className="flex flex-col items-center">
									<div className="relative">
										<img
											src={
												selectedMember.profileImage ||
												"https://via.placeholder.com/100"
											}
											alt={selectedMember.name}
											className="size-28 rounded-full object-cover border-4 border-white shadow-md mb-4"
										/>
										<span
											className={cn(
												"absolute bottom-4 right-0 size-6 rounded-full border-4 border-white",
												selectedMember.grade ===
													"MANAGER"
													? "bg-orange-500"
													: "bg-green-500",
											)}
										/>
									</div>
									<h2 className="text-xl font-bold text-gray-900">
										{selectedMember.name}
									</h2>
									<p className="text-gray-500 mb-1">
										@{selectedMember.nickname}
									</p>
									<div
										className={cn(
											"mt-1 px-3 py-1 rounded-full text-sm",
											selectedMember.grade === "MANAGER"
												? "bg-orange-100 text-orange-600"
												: "bg-green-100 text-green-600",
										)}
									>
										{selectedMember.grade === "MANAGER"
											? "매니저"
											: "회원"}
									</div>
								</div>

								{/* 회원 상세 정보 카드 */}
								<div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-4">
									<div className="flex items-center gap-3">
										<div className="bg-blue-100 p-2 rounded-lg">
											<MdEmail className="size-5 text-blue-600" />
										</div>
										<div>
											<p className="text-xs text-gray-500 mb-1">
												이메일
											</p>
											<p className="font-medium text-gray-900">
												{selectedMember.email}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="bg-green-100 p-2 rounded-lg">
											<MdOutlinePhone className="size-5 text-green-600" />
										</div>
										<div>
											<p className="text-xs text-gray-500 mb-1">
												전화번호
											</p>
											<p className="font-medium text-gray-900">
												{selectedMember.phone &&
													formatPhoneNumber(
														selectedMember.phone,
													)}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="bg-purple-100 p-2 rounded-lg">
											<MdAccessTime className="size-5 text-purple-600" />
										</div>
										<div>
											<p className="text-xs text-gray-500 mb-1">
												가입일
											</p>
											<p className="font-medium text-gray-900">
												{formatDate(
													selectedMember.joinedAt,
												)}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="bg-amber-100 p-2 rounded-lg">
											<MdCalendarMonth className="size-5 text-amber-600" />
										</div>
										<div>
											<p className="text-xs text-gray-500 mb-1">
												회원 ID
											</p>
											<p className="font-medium text-gray-900">
												{selectedMember.id}
											</p>
										</div>
									</div>
								</div>

								<div className="mt-6 space-y-4">
									{/* 회원 등급 변경 컨펌 */}
									{selectedMember.grade === "USER" ? (
										<>
											{showConfirmPromote ===
											selectedMember.id ? (
												<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
													<div className="flex items-start gap-2">
														<MdWarning className="mt-0.5 size-5 text-yellow-500 flex-shrink-0" />
														<div className="flex-1">
															<p className="text-yellow-800 text-sm font-medium">
																정말 이 회원을
																매니저로
																승급하시겠습니까?
															</p>
															<p className="text-yellow-700 text-xs mt-1">
																매니저는 센터의
																모든 정보에
																접근할 수
																있습니다.
															</p>
															<div className="flex gap-2 mt-3">
																<button
																	type="button"
																	onClick={() =>
																		handlePromoteToManager(
																			selectedMember.id,
																		)
																	}
																	className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600"
																>
																	확인
																</button>
																<button
																	type="button"
																	onClick={
																		handlePromoteCancel
																	}
																	className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
																>
																	취소
																</button>
															</div>
														</div>
													</div>
												</div>
											) : (
												<button
													type="button"
													onClick={() =>
														handlePromoteToManager(
															selectedMember.id,
														)
													}
													className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium mb-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
													disabled={isPromoting}
												>
													<MdArrowUpward className="size-5" />
													매니저로 승급
												</button>
											)}
										</>
									) : (
										<>
											{/* {showConfirmDemote ===
											selectedMember.id ? (
												<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
													<div className="flex items-start gap-2">
														<MdWarning className="mt-0.5 size-5 text-yellow-500 flex-shrink-0" />
														<div className="flex-1">
															<p className="text-yellow-800 text-sm font-medium">
																정말 이 매니저를
																일반 회원으로
																변경하시겠습니까?
															</p>
															<p className="text-yellow-700 text-xs mt-1">
																매니저 권한이
																모두 제거됩니다.
															</p>
															<div className="flex gap-2 mt-3">
																<button
																	type="button"
																	onClick={() =>
																		handleDemoteToUser(
																			selectedMember.id,
																		)
																	}
																	className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
																>
																	확인
																</button>
																<button
																	type="button"
																	onClick={
																		handleDemoteCancel
																	}
																	className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
																>
																	취소
																</button>
															</div>
														</div>
													</div>
												</div>
											) : (
												<button
													type="button"
													onClick={() =>
														handleDemoteToUser(
															selectedMember.id,
														)
													}
													className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium mb-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
													disabled={isUpdating}
												>
													회원으로 변경
												</button>
											)} */}
										</>
									)}

									{/* 회원 삭제 컨펌 */}
									{showConfirmDelete === selectedMember.id ? (
										<div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
											<div className="flex items-start gap-2">
												<MdWarning className="mt-0.5 size-5 text-red-500 flex-shrink-0" />
												<div className="flex-1">
													<p className="text-red-800 text-sm font-medium">
														정말 이 회원을
														삭제하시겠습니까?
													</p>
													<p className="text-red-700 text-xs mt-1">
														이 작업은 되돌릴 수
														없습니다.
													</p>
													<div className="flex gap-2 mt-3">
														<button
															type="button"
															onClick={() =>
																handleDeleteRequest(
																	selectedMember.id,
																)
															}
															className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
														>
															확인
														</button>
														<button
															type="button"
															onClick={
																handleDeleteCancel
															}
															className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
														>
															취소
														</button>
													</div>
												</div>
											</div>
										</div>
									) : (
										<button
											type="button"
											onClick={() => {
												handleDeleteRequest(
													selectedMember.id,
												);
											}}
											className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
										>
											<MdPersonRemove className="size-5" />
											회원 삭제
										</button>
									)}
								</div>
							</div>
						) : (
							<div className="p-5 text-center text-gray-500">
								회원 정보를 불러올 수 없습니다.
							</div>
						)}
					</motion.div>
				</div>
			)}
		</div>
	);
}
