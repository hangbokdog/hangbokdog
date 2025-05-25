import { Skeleton } from "@/components/ui/skeleton";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import useCenterStore from "@/lib/store/centerStore";
import {
	getSlotApplicantsAPI,
	getVolunteerApplicantsAPI,
	updateVolunteerApplicantStatusAPI,
	getVolunteerSlotsAPI,
} from "@/api/volunteer";
import { useState, useRef, useEffect, type RefObject } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type {
	ApplicantsListProps,
	SlotApplicant,
	SlotProps,
	VolunteerApplicantsResponse,
} from "@/types/volunteer";
import { Calendar, Award, CalendarDays, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { DateGroup } from "./DateGroup";
import { ApprovedApplicantsList } from "./ApprovedApplicantsList";

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
	const loadMoreRef = useRef<HTMLDivElement>(
		null,
	) as RefObject<HTMLDivElement>;

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
	const { data: slotApplicants, isLoading: isApplicantsLoading } = useQuery({
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
		loadMoreRef,
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
		queryClient.invalidateQueries({
			queryKey: [
				"approvedApplicants",
				selectedCenter?.centerId,
				eventId,
				"approved",
			],
		});
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

	// 날짜별로 슬롯을 그룹화하는 함수 추가
	const groupSlotsByDate = (slots: SlotProps[]) => {
		return slots.reduce(
			(acc, slot) => {
				const date = slot.volunteerDate;
				if (!acc[date]) {
					acc[date] = {
						date,
						formattedDate: formatDate(date),
						slots: [],
						totalApplicants: 0,
					};
				}
				acc[date].slots.push(slot);
				acc[date].totalApplicants += slot.applicationCount;
				return acc;
			},
			{} as Record<
				string,
				{
					date: string;
					formattedDate: string;
					slots: SlotProps[];
					totalApplicants: number;
				}
			>,
		);
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
					<Calendar
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
				<div>
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
							{Object.values(
								groupSlotsByDate(volunteerSlots),
							).map((dateGroup, dateIndex) => (
								<DateGroup
									key={dateGroup.date}
									date={dateGroup.date}
									formattedDate={dateGroup.formattedDate}
									slots={dateGroup.slots}
									totalApplicants={dateGroup.totalApplicants}
									openSlots={openSlots}
									selectedSlot={selectedSlot}
									slotApplicants={
										slotApplicants as SlotApplicant[]
									}
									isApplicantsLoading={isApplicantsLoading}
									processingApplicants={processingApplicants}
									recentAction={recentAction}
									onToggleSlot={toggleSlot}
									onApprove={handleApprove}
									onReject={handleReject}
									getSlotTypeText={getSlotTypeText}
									getCapacityColorClass={
										getCapacityColorClass
									}
									formatTime={formatTime}
									dateIndex={dateIndex}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{/* 승인된 신청자 보기 */}
			{activeView === "approved" && (
				<ApprovedApplicantsList
					approvedApplicants={approvedApplicants}
					filteredApplicants={filteredApprovedApplicants}
					searchQuery={searchQuery}
					isLoading={isApprovedApplicantsLoading}
					hasNextPage={hasNextApproved}
					isFetchingNextPage={isFetchingNextApproved}
					onSearchChange={setSearchQuery}
					onClearSearch={() => setSearchQuery("")}
					loadMoreRef={loadMoreRef}
					getAgeColor={getAgeColor}
					formatApplicationDate={formatApplicationDate}
				/>
			)}
		</motion.div>
	);
};
