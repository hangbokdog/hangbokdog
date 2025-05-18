import { Skeleton } from "@/components/ui/skeleton";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import useCenterStore from "@/lib/store/centerStore";
import {
	getVolunteerDetailAPI,
	getSlotApplicantsAPI,
	getVolunteerApplicantsAPI,
	updateVolunteerApplicantStatusAPI,
	getVolunteerSlotsAPI,
} from "@/api/volunteer";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type {
	ApplicantsListProps,
	SlotApplicant,
	VolunteerApplicantsResponse,
} from "@/types/volunteer";
import {
	ChevronDown,
	ChevronUp,
	Clock,
	Calendar,
	User,
	Phone,
	Mail,
	CheckCircle,
	XCircle,
	BadgeCheck,
	BadgeX,
	Loader2,
	Award,
	Calendar as CalendarIcon,
	Users,
	AlertCircle,
	CheckCircle2,
	Clock3,
	ViewIcon,
	Search,
	CalendarDays,
	LayoutList,
	Check,
	Activity,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SlotProps {
	id: number;
	date: string;
	slotType: "MORNING" | "AFTERNOON";
	startTime: string;
	endTime: string;
	volunteerDate: string;
	capacity: number;
	applicationCount: number;
}

export const ApplicantsList = ({
	eventId,
	refetchVolunteers,
	refetchAddresses,
}: ApplicantsListProps) => {
	const { selectedCenter } = useCenterStore();
	const queryClient = useQueryClient();
	const [openSlots, setOpenSlots] = useState<Record<number, boolean>>({});
	const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
	const [processingApplicants, setProcessingApplicants] = useState<
		Record<number, boolean>
	>({});
	const [recentAction, setRecentAction] = useState<{
		id: number;
		action: "approve" | "reject";
	} | null>(null);
	const [activeView, setActiveView] = useState<"slots" | "approved">("slots");
	const [searchQuery, setSearchQuery] = useState("");
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	// 날짜를 포맷팅하는 함수
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "yyyy년 M월 d일 (EEE)", { locale: ko });
	};

	// 시간을 포맷팅하는 함수
	const formatTime = (timeString: string) => {
		return timeString.substring(0, 5);
	};

	// 봉사활동 상세 정보 조회
	const { data: volunteerSlots, isLoading: isDetailLoading } = useQuery({
		queryKey: ["volunteerDetail", eventId],
		queryFn: () => getVolunteerSlotsAPI({ eventId: eventId.toString() }),
		enabled: !!eventId,
		refetchOnMount: "always",
		refetchOnWindowFocus: "always",
	});

	// 슬롯별 신청자 목록 조회 - 선택된 슬롯이 있을 때만 활성화
	const {
		data: slotApplicants,
		isLoading: isApplicantsLoading,
		error: applicantsError,
		refetch: refetchApplicants,
	} = useQuery({
		queryKey: ["slotApplicants", selectedCenter?.centerId, selectedSlot],
		queryFn: () =>
			getSlotApplicantsAPI({
				slotId: selectedSlot as number,
				centerId: selectedCenter?.centerId as string,
			}),
		enabled:
			!!selectedSlot &&
			!!selectedCenter?.centerId &&
			!!openSlots[selectedSlot],
		refetchOnMount: "always",
		refetchOnWindowFocus: "always",
	});

	// 승인 대기중인 모든 신청자 (필요한 경우만 활성화)
	const {
		data: _pendingApplicants,
		fetchNextPage: _fetchNextPending,
		hasNextPage: _hasNextPending,
		isFetchingNextPage: _isFetchingNextPending,
		isLoading: _isPendingApplicantsLoading,
	} = useInfiniteQuery<VolunteerApplicantsResponse>({
		queryKey: [
			"pendingApplicants",
			selectedCenter?.centerId,
			eventId,
			"pending",
		],
		queryFn: async ({ pageParam }) => {
			return getVolunteerApplicantsAPI({
				centerId: selectedCenter?.centerId ?? "",
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
		enabled: false, // 기본적으로 비활성화, 필요할 때만 활성화
	});

	// 승인된 모든 신청자 (필요한 경우만 활성화)
	const {
		data: approvedApplicantsData,
		fetchNextPage: fetchNextApproved,
		hasNextPage: hasNextApproved,
		isFetchingNextPage: isFetchingNextApproved,
		isLoading: isApprovedApplicantsLoading,
		refetch: refetchApproved,
	} = useInfiniteQuery<VolunteerApplicantsResponse>({
		queryKey: [
			"approvedApplicants",
			selectedCenter?.centerId,
			eventId,
			"approved",
		],
		queryFn: async ({ pageParam }) => {
			return getVolunteerApplicantsAPI({
				centerId: selectedCenter?.centerId ?? "",
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
		enabled: activeView === "approved", // 'approved' 탭이 활성화되었을 때만 쿼리 실행
		refetchOnWindowFocus: "always",
		refetchOnMount: "always",
	});

	// 승인된 신청자 데이터 추출 및 플랫화
	const approvedApplicants =
		approvedApplicantsData?.pages
			.flatMap((page) => page?.data || [])
			.filter(Boolean) || [];

	// 검색 필터링
	const filteredApprovedApplicants = approvedApplicants.filter(
		(applicant) => {
			if (!searchQuery) return true;

			const searchLower = searchQuery.toLowerCase();
			return (
				applicant.name?.toLowerCase().includes(searchLower) ||
				applicant.nickname?.toLowerCase().includes(searchLower) ||
				applicant.email?.toLowerCase().includes(searchLower)
			);
		},
	);

	// 무한 스크롤 구현을 위한 인터섹션 옵저버 설정
	useEffect(() => {
		if (activeView !== "approved") return;

		// 기존 옵저버 해제
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		// 새 옵저버 생성
		observerRef.current = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (
					entry.isIntersecting &&
					hasNextApproved &&
					!isFetchingNextApproved
				) {
					fetchNextApproved();
				}
			},
			{ threshold: 0.1 },
		);

		// 옵저버 연결
		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [
		activeView,
		hasNextApproved,
		isFetchingNextApproved,
		fetchNextApproved,
	]);

	// 승인 mutation
	const { mutate: approveApplication } = useMutation({
		mutationFn: ({ applicationId }: { applicationId: number }) =>
			updateVolunteerApplicantStatusAPI({
				centerId: selectedCenter?.centerId as string,
				applicationId,
				status: "APPROVED",
			}),
		onSuccess: (_, variables) => {
			toast.success("봉사 신청이 승인되었습니다.", {
				position: "top-center",
				className: "bg-green-50 border border-green-100",
			});

			// 최근 액션 설정
			setRecentAction({
				id: variables.applicationId,
				action: "approve",
			});

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: [
					"slotApplicants",
					selectedCenter?.centerId,
					selectedSlot,
				],
			});

			// 봉사활동 슬롯 정보 갱신 (신청자 수 변경 가능성)
			queryClient.invalidateQueries({
				queryKey: ["volunteerDetail", eventId],
			});

			refetchVolunteers();
			refetchAddresses();
		},
		onError: () => {
			toast.error("봉사 신청 승인에 실패했습니다.", {
				position: "top-center",
			});
		},
		onSettled: (_, __, variables) => {
			// 처리 상태 업데이트
			setProcessingApplicants((prev) => ({
				...prev,
				[variables.applicationId]: false,
			}));

			// 3초 후 최근 액션 초기화
			setTimeout(() => {
				setRecentAction(null);
			}, 3000);
		},
	});

	// 거절 mutation
	const { mutate: rejectApplication } = useMutation({
		mutationFn: ({ applicationId }: { applicationId: number }) =>
			updateVolunteerApplicantStatusAPI({
				centerId: selectedCenter?.centerId as string,
				applicationId,
				status: "REJECTED",
			}),
		onSuccess: (_, variables) => {
			toast.success("봉사 신청이 거절되었습니다.", {
				position: "top-center",
				className: "bg-red-50 border border-red-100",
			});

			// 최근 액션 설정
			setRecentAction({
				id: variables.applicationId,
				action: "reject",
			});

			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: [
					"slotApplicants",
					selectedCenter?.centerId,
					selectedSlot,
				],
			});

			// 봉사활동 슬롯 정보 갱신 (신청자 수 변경 가능성)
			queryClient.invalidateQueries({
				queryKey: ["volunteerDetail", eventId],
			});

			refetchVolunteers();
			refetchAddresses();
		},
		onError: () => {
			toast.error("봉사 신청 거절에 실패했습니다.", {
				position: "top-center",
			});
		},
		onSettled: (_, __, variables) => {
			// 처리 상태 업데이트
			setProcessingApplicants((prev) => ({
				...prev,
				[variables.applicationId]: false,
			}));

			// 3초 후 최근 액션 초기화
			setTimeout(() => {
				setRecentAction(null);
			}, 3000);
		},
	});

	// 승인 처리 핸들러
	const handleApprove = (applicantId: number) => {
		// 처리 중 상태로 설정
		setProcessingApplicants((prev) => ({
			...prev,
			[applicantId]: true,
		}));
		approveApplication({ applicationId: applicantId });
		refetchApproved();
	};

	// 거절 처리 핸들러
	const handleReject = (applicantId: number) => {
		// 처리 중 상태로 설정
		setProcessingApplicants((prev) => ({
			...prev,
			[applicantId]: true,
		}));
		rejectApplication({ applicationId: applicantId });
	};

	// 슬롯 토글 핸들러 - 한 번에 하나만 열리도록 구현
	const toggleSlot = (slotId: number) => {
		// 현재 슬롯이 이미 열려있으면 닫기
		if (openSlots[slotId]) {
			setOpenSlots({});
			setSelectedSlot(null);
			return;
		}

		// 새 슬롯을 열 때는 기존 슬롯들을 모두 닫고 이 슬롯만 열기
		setOpenSlots({ [slotId]: true });
		setSelectedSlot(slotId);
	};

	// 슬롯 타입 표시
	const getSlotTypeText = (slotType: string) => {
		return slotType === "MORNING" ? "오전" : "오후";
	};

	// 용량 상태에 따른 색상 클래스 결정
	const getCapacityColorClass = (
		applicationCount: number,
		capacity: number,
	) => {
		if (applicationCount === 0) return "bg-slate-100 text-slate-500";
		const ratio = applicationCount / capacity;
		if (ratio >= 1) return "bg-rose-100 text-rose-700";
		if (ratio >= 0.75) return "bg-amber-100 text-amber-700";
		if (ratio >= 0.5) return "bg-yellow-100 text-yellow-700";
		return "bg-emerald-100 text-emerald-700";
	};

	// 나이대별 색상 지정
	const getAgeColor = (age: number) => {
		if (!age) return "bg-gray-100 text-gray-600";
		if (age < 20) return "bg-emerald-100 text-emerald-700";
		if (age < 30) return "bg-blue-100 text-blue-700";
		if (age < 40) return "bg-violet-100 text-violet-700";
		if (age < 50) return "bg-amber-100 text-amber-700";
		return "bg-rose-100 text-rose-700";
	};

	// 신청 날짜 포매팅
	const formatApplicationDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffDays = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 3600 * 24),
		);

		if (diffDays < 1) {
			return "오늘";
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (diffDays < 2) {
			return "어제";
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (diffDays < 7) {
			return `${diffDays}일 전`;
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else {
			return format(date, "MM.dd", { locale: ko });
		}
	};

	if (isDetailLoading) {
		return (
			<div className="max-w-md mx-auto space-y-4 p-4">
				<div className="flex items-center space-x-3">
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-8 w-48" />
				</div>
				<Skeleton className="h-40 w-full rounded-lg animate-pulse" />
				<Skeleton className="h-40 w-full rounded-lg animate-pulse" />
			</div>
		);
	}

	if (!volunteerSlots) {
		return (
			<div className="text-center p-8 text-gray-500 max-w-md mx-auto">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
					className="p-6 bg-gray-50 rounded-xl shadow-sm"
				>
					<CalendarIcon
						className="mx-auto mb-3 text-gray-300"
						size={32}
					/>
					<p className="font-medium">
						봉사활동 정보를 찾을 수 없습니다
					</p>
				</motion.div>
			</div>
		);
	}

	// 슬롯이 없는 경우 처리
	const hasSlots = volunteerSlots?.length > 0;

	return (
		<motion.div
			className="max-w-md mx-auto space-y-5 p-2 sm:p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<motion.div
				className="text-lg font-semibold text-indigo-600 border-b pb-2 flex items-center gap-2"
				initial={{ y: -10 }}
				animate={{ y: 0 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
			>
				<Award className="text-indigo-600" size={20} />
				{volunteerSlots?.title || "봉사 활동"} - 신청자 관리
			</motion.div>

			{/* 탭 인터페이스 추가 */}
			<div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-1 mb-4">
				<motion.button
					type="button"
					className={`flex-1 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
						activeView === "slots"
							? "bg-indigo-50 text-indigo-600"
							: "text-gray-600 hover:bg-gray-50"
					}`}
					onClick={() => setActiveView("slots")}
					whileTap={{ scale: 0.97 }}
				>
					<CalendarDays size={16} />
					<span>일정별 보기</span>
					{activeView === "slots" && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className="bg-indigo-600 w-1.5 h-1.5 rounded-full ml-1"
						/>
					)}
				</motion.button>

				<motion.button
					type="button"
					className={`flex-1 py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
						activeView === "approved"
							? "bg-indigo-50 text-indigo-600"
							: "text-gray-600 hover:bg-gray-50"
					}`}
					onClick={() => setActiveView("approved")}
					whileTap={{ scale: 0.97 }}
				>
					<LayoutList size={16} />
					<span>전체 승인자</span>
					{activeView === "approved" && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className="bg-indigo-600 w-1.5 h-1.5 rounded-full ml-1"
						/>
					)}
				</motion.button>
			</div>

			{/* 기존 슬롯 UI */}
			{activeView === "slots" && (
				<>
					{/* biome-ignore lint/style/noUselessElse: <explanation> */}
					{!hasSlots ? (
						<motion.div
							className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<Calendar
								size={32}
								className="mx-auto text-slate-300 mb-2"
							/>
							등록된 봉사 일정이 없습니다.
						</motion.div>
					) : (
						<div className="space-y-4">
							{volunteerSlots.map(
								(slot: SlotProps, index: number) => (
									<motion.div
										key={slot.id}
										className="bg-white rounded-xl overflow-hidden shadow-md"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.4,
											delay: index * 0.05,
											ease: "easeOut",
										}}
										whileHover={{
											boxShadow:
												"0 4px 12px rgba(0, 0, 0, 0.08)",
										}}
									>
										<div className="bg-indigo-50 p-3">
											<h3 className="font-semibold flex items-center gap-2 text-indigo-700">
												<Calendar
													size={16}
													className="text-indigo-500"
												/>
												{formatDate(slot.volunteerDate)}
											</h3>
										</div>

										{/* 슬롯 정보 및 신청자 요약 */}
										<div className="p-3">
											<div className="flex items-center justify-between mb-3">
												<div className="flex items-center gap-2">
													<Clock
														size={16}
														className="text-indigo-500"
													/>
													<span className="font-medium">
														{getSlotTypeText(
															slot.slotType,
														)}{" "}
														{formatTime(
															slot.startTime,
														)}{" "}
														-{" "}
														{formatTime(
															slot.endTime,
														)}
													</span>
												</div>

												<div
													className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1
												${getCapacityColorClass(slot.applicationCount, slot.capacity)}`}
												>
													<Users size={12} />
													{slot.applicationCount}/
													{slot.capacity}
												</div>
											</div>

											{/* 신청자 미리보기 */}
											<div
												className={`rounded-lg border p-3 ${
													slot.applicationCount > 0
														? "bg-white border-slate-200"
														: "bg-slate-50 border-slate-100"
												}`}
											>
												{slot.applicationCount > 0 ? (
													<div className="space-y-2">
														<div className="flex justify-between items-center">
															<span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
																<Users
																	size={14}
																	className="text-indigo-500"
																/>
																신청자 현황
															</span>

															{/* 간소화된 신청자 상태 - 슬롯의 기본 정보만 표시 */}
															<div className="flex items-center gap-2">
																<div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
																	<Users
																		size={
																			10
																		}
																	/>
																	<span>
																		{
																			slot.applicationCount
																		}
																		명
																	</span>
																</div>
															</div>
														</div>

														{/* 슬롯 확장/축소 버튼 */}
														<button
															className="flex justify-center items-center w-full py-1.5 bg-slate-50 rounded-md cursor-pointer hover:bg-slate-100 transition-colors"
															onClick={() =>
																toggleSlot(
																	slot.id,
																)
															}
															aria-expanded={
																openSlots[
																	slot.id
																] || false
															}
															type="button"
														>
															<div className="flex items-center gap-1.5 text-slate-500 text-sm">
																{openSlots[
																	slot.id
																]
																	? "접기"
																	: "상세보기"}
																{openSlots[
																	slot.id
																] ? (
																	<ChevronUp
																		size={
																			16
																		}
																	/>
																) : (
																	<ChevronDown
																		size={
																			16
																		}
																	/>
																)}
															</div>
														</button>
													</div>
												) : (
													<div className="flex flex-col items-center justify-center py-2 text-slate-400 gap-1">
														<User size={16} />
														<span className="text-xs">
															신청자 없음
														</span>
													</div>
												)}
											</div>
										</div>

										{/* 확장 패널 */}
										<AnimatePresence>
											{openSlots[slot.id] && (
												<motion.div
													className="bg-slate-50 overflow-hidden border-t border-slate-100"
													initial={{
														height: 0,
														opacity: 0,
													}}
													animate={{
														height: "auto",
														opacity: 1,
													}}
													exit={{
														height: 0,
														opacity: 0,
													}}
													transition={{
														duration: 0.3,
														ease: "easeInOut",
													}}
												>
													<div className="p-4">
														{isApplicantsLoading ? (
															<div>
																신청자 정보를
																불러오는 중...
															</div>
														) : (
															<div>
																{slotApplicants &&
																slotApplicants.length >
																	0 ? (
																	<div className="space-y-3">
																		{slotApplicants.map(
																			(
																				applicant,
																				index,
																			) => (
																				<motion.div
																					key={
																						applicant.id
																					}
																					className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors"
																					initial={{
																						opacity: 0,
																						y: 20,
																					}}
																					animate={{
																						opacity: 1,
																						y: 0,
																						scale:
																							recentAction?.id ===
																							applicant.id
																								? [
																										1,
																										1.03,
																										1,
																									]
																								: 1,
																					}}
																					transition={{
																						duration: 0.3,
																						delay:
																							index *
																							0.05,
																						scale: {
																							duration: 0.5,
																						},
																					}}
																					layout
																				>
																					<div className="flex justify-between items-start">
																						<div className="flex items-center gap-3">
																							<motion.div
																								className="relative"
																								whileHover={{
																									scale: 1.1,
																								}}
																								transition={{
																									duration: 0.2,
																								}}
																							>
																								{applicant.profileImage ? (
																									<img
																										src={
																											applicant.profileImage
																										}
																										alt={
																											applicant.name
																										}
																										className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
																									/>
																								) : (
																									<div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-violet-50 flex items-center justify-center border-2 border-white shadow-sm">
																										<User
																											size={
																												18
																											}
																											className="text-indigo-500"
																										/>
																									</div>
																								)}
																								{applicant.status !==
																									"PENDING" && (
																									<motion.div
																										className={`absolute -bottom-1 -right-1 rounded-full p-1 ${
																											applicant.status ===
																											"APPROVED"
																												? "bg-emerald-500"
																												: "bg-rose-500"
																										}`}
																										initial={{
																											scale: 0,
																										}}
																										animate={{
																											scale: 1,
																										}}
																										transition={{
																											delay: 0.2,
																										}}
																									>
																										{applicant.status ===
																										"APPROVED" ? (
																											<BadgeCheck
																												size={
																													12
																												}
																												className="text-white"
																											/>
																										) : (
																											<BadgeX
																												size={
																													12
																												}
																												className="text-white"
																											/>
																										)}
																									</motion.div>
																								)}
																							</motion.div>
																							<div>
																								<div className="font-medium flex items-center gap-1.5">
																									{
																										applicant.name
																									}
																									<span className="text-sm text-slate-500">
																										(
																										{
																											applicant.nickname
																										}
																										)
																									</span>
																								</div>
																								<div className="text-sm text-slate-500">
																									{
																										applicant.age
																									}
																									세
																									|{" "}
																									{
																										applicant.grade
																									}
																								</div>
																							</div>
																						</div>

																						<div className="flex items-center gap-2">
																							{applicant.status ===
																							"PENDING" ? (
																								<>
																									{processingApplicants[
																										applicant
																											.id
																									] ? (
																										<motion.div
																											animate={{
																												rotate: 360,
																												transition:
																													{
																														duration: 1,
																														repeat: Number.POSITIVE_INFINITY,
																														ease: "linear",
																													},
																											}}
																										>
																											<Loader2
																												size={
																													18
																												}
																												className="text-indigo-600 mr-2"
																											/>
																										</motion.div>
																									) : (
																										<>
																											<motion.button
																												className="rounded-full p-1.5 text-emerald-500 hover:bg-emerald-50 transition-colors"
																												aria-label="승인"
																												title="승인"
																												type="button"
																												onClick={() =>
																													handleApprove(
																														applicant.id,
																													)
																												}
																												disabled={
																													processingApplicants[
																														applicant
																															.id
																													]
																												}
																												whileHover={{
																													scale: 1.15,
																													backgroundColor:
																														"rgb(240 253 244)",
																												}}
																												whileTap={{
																													scale: 0.9,
																												}}
																											>
																												<CheckCircle
																													size={
																														20
																													}
																												/>
																											</motion.button>
																											<motion.button
																												className="rounded-full p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
																												aria-label="거절"
																												title="거절"
																												type="button"
																												onClick={() =>
																													handleReject(
																														applicant.id,
																													)
																												}
																												disabled={
																													processingApplicants[
																														applicant
																															.id
																													]
																												}
																												whileHover={{
																													scale: 1.15,
																													backgroundColor:
																														"rgb(254 242 242)",
																												}}
																												whileTap={{
																													scale: 0.9,
																												}}
																											>
																												<XCircle
																													size={
																														20
																													}
																												/>
																											</motion.button>
																										</>
																									)}
																								</>
																							) : (
																								<motion.span
																									className={`px-2.5 py-1 rounded-full text-xs font-medium ${
																										applicant.status ===
																										"APPROVED"
																											? "bg-emerald-100 text-emerald-800"
																											: "bg-rose-100 text-rose-800"
																									}`}
																									initial={{
																										opacity: 0,
																										scale: 0.8,
																									}}
																									animate={{
																										opacity: 1,
																										scale: 1,
																									}}
																									transition={{
																										duration: 0.3,
																									}}
																								>
																									{applicant.status ===
																									"APPROVED"
																										? "승인됨"
																										: "거절됨"}
																								</motion.span>
																							)}
																						</div>
																					</div>

																					<motion.div
																						className="mt-3 grid grid-cols-1 gap-2 text-sm bg-slate-50 p-2.5 rounded-lg"
																						initial={{
																							opacity: 0,
																						}}
																						animate={{
																							opacity: 1,
																						}}
																						transition={{
																							delay: 0.2,
																						}}
																					>
																						<div className="flex items-center gap-2">
																							<Phone
																								size={
																									14
																								}
																								className="text-indigo-400"
																							/>
																							<span className="font-medium">
																								{applicant.phone ||
																									"-"}
																							</span>
																						</div>
																						<div className="flex items-center gap-2">
																							<Mail
																								size={
																									14
																								}
																								className="text-indigo-400"
																							/>
																							<span>
																								{applicant.email ||
																									"-"}
																							</span>
																						</div>
																						<div className="text-xs text-slate-400 mt-1">
																							신청일:{" "}
																							{format(
																								new Date(
																									applicant.createdAt,
																								),
																								"yyyy.MM.dd HH:mm",
																							)}
																						</div>
																					</motion.div>
																				</motion.div>
																			),
																		)}
																	</div>
																) : (
																	<div>
																		신청자가
																		없습니다
																	</div>
																)}
															</div>
														)}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								),
							)}
						</div>
					)}
				</>
			)}

			{/* 승인된 신청자 보기 */}
			{activeView === "approved" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-4"
				>
					{/* 검색 필드 */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search size={16} className="text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="이름, 닉네임으로 검색..."
							className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
								onClick={() => setSearchQuery("")}
							>
								<XCircle size={16} />
							</button>
						)}
					</div>

					{/* 요약 정보 */}
					<motion.div
						className="bg-white rounded-lg p-3 shadow-sm border border-indigo-50"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="bg-indigo-100 p-2 rounded-full">
									<Users
										size={16}
										className="text-indigo-600"
									/>
								</div>
								<span className="font-medium text-gray-700">
									총 승인된 신청자
								</span>
							</div>
							<div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium text-sm">
								{approvedApplicants.length}명
							</div>
						</div>

						{searchQuery && (
							<div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
								<Search size={14} />
								<span>
									검색 결과:{" "}
									<strong>
										{filteredApprovedApplicants.length}명
									</strong>
								</span>
							</div>
						)}
					</motion.div>

					{isApprovedApplicantsLoading ? (
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
								>
									<div className="flex items-center gap-3">
										<Skeleton className="h-12 w-12 rounded-full" />
										<div className="space-y-2 flex-1">
											<Skeleton className="h-4 w-1/3" />
											<Skeleton className="h-3 w-1/2" />
										</div>
									</div>
									<div className="mt-3 space-y-2">
										<Skeleton className="h-3 w-full" />
										<Skeleton className="h-3 w-2/3" />
									</div>
								</div>
							))}
						</div>
					) : filteredApprovedApplicants.length === 0 ? (
						<motion.div
							className="flex flex-col items-center justify-center bg-white rounded-lg p-6 shadow-sm text-gray-500"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							{searchQuery ? (
								<>
									<Search
										size={32}
										className="text-gray-300 mb-2"
									/>
									<p className="font-medium mb-1">
										검색 결과가 없습니다
									</p>
									<p className="text-sm text-gray-400">
										다른 검색어로 시도해보세요
									</p>
								</>
							) : (
								<>
									<Users
										size={32}
										className="text-gray-300 mb-2"
									/>
									<p className="font-medium">
										승인된 신청자가 없습니다
									</p>
								</>
							)}
						</motion.div>
					) : (
						<>
							<div className="grid gap-4">
								{filteredApprovedApplicants.map(
									(applicant, index) => (
										<motion.div
											key={applicant.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.3,
												delay: index * 0.05,
											}}
											className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors"
										>
											<div className="flex items-start">
												<div className="relative mr-3">
													{applicant.profileImage ? (
														<img
															src={
																applicant.profileImage
															}
															alt={
																applicant.name ||
																"신청자"
															}
															className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
														/>
													) : (
														<div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border-2 border-white shadow-sm">
															<User
																size={20}
																className="text-indigo-300"
															/>
														</div>
													)}
													<div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
														<Check
															size={10}
															className="text-white"
														/>
													</div>
												</div>

												<div className="flex-1">
													<div className="flex justify-between items-start">
														<div>
															<h3 className="font-medium text-gray-900 flex items-center gap-2">
																{applicant.name ||
																	"이름 미제공"}
																{applicant.name && (
																	<span className="text-sm text-gray-500">
																		(
																		{applicant.nickname ||
																			"닉네임 없음"}
																		)
																	</span>
																)}
															</h3>
															<div className="flex items-center gap-2 mt-1">
																{applicant.age >
																	0 && (
																	<span
																		className={`px-1.5 py-0.5 rounded text-xs font-medium ${getAgeColor(applicant.age)}`}
																	>
																		{
																			applicant.age
																		}
																		세
																	</span>
																)}
																{applicant.grade && (
																	<span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
																		{
																			applicant.grade
																		}
																	</span>
																)}
															</div>
														</div>

														<span className="text-xs text-gray-400">
															{formatApplicationDate(
																applicant.createdAt,
															)}
														</span>
													</div>

													<div className="mt-3 space-y-2 text-sm">
														{applicant.email && (
															<div className="flex items-center gap-2 text-gray-600">
																<Mail
																	size={14}
																	className="text-indigo-400"
																/>
																<span>
																	{
																		applicant.email
																	}
																</span>
															</div>
														)}
														{applicant.phone && (
															<div className="flex items-center gap-2 text-gray-600">
																<Phone
																	size={14}
																	className="text-indigo-400"
																/>
																<span>
																	{
																		applicant.phone
																	}
																</span>
															</div>
														)}
													</div>
												</div>
											</div>

											{/* 승인 배지 */}
											<div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
												<span className="text-xs text-gray-500">
													승인일:{" "}
													{format(
														new Date(
															applicant.createdAt,
														),
														"yyyy.MM.dd",
													)}
												</span>
												<span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
													<CheckCircle2 size={12} />
													승인됨
												</span>
											</div>
										</motion.div>
									),
								)}
							</div>

							{/* 무한 스크롤 로딩 지점 */}
							{hasNextApproved && (
								<div
									ref={loadMoreRef}
									className="py-4 flex justify-center"
								>
									{isFetchingNextApproved ? (
										<motion.div
											animate={{
												rotate: 360,
												transition: {
													duration: 1,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												},
											}}
										>
											<Loader2
												size={20}
												className="text-indigo-500"
											/>
										</motion.div>
									) : (
										<div className="h-8" />
									)}
								</div>
							)}
						</>
					)}
				</motion.div>
			)}
		</motion.div>
	);
};
