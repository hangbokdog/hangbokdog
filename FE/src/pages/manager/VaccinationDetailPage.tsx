import {
	completeVaccinationAPI,
	fetchVaccinationDetailAPI,
} from "@/api/vaccine";
import PillProgress from "@/components/manager/vaccination/PillProgress";
import {
	useMutation,
	useQuery,
	useQueryClient,
	type InfiniteData,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	CalendarIcon,
	MapPinIcon,
	SyringeIcon,
	ListIcon,
	CheckCircleIcon,
	ClockIcon,
	LoaderIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useCenterStore from "@/lib/store/centerStore";
import VaccinationDrawer from "@/components/manager/vaccination/VaccinationDrawer";
import { toast } from "sonner";

// Define types for the summary list data structure
interface VaccinationSummary {
	vaccinationId: number;
	title: string;
	content?: string;
	operatedDate?: string;
	status: string;
	locationInfos?: Array<{
		locationId: number;
		locationName: string;
	}>;
}

// Define the structure of pages in infinite query
interface SummaryPage {
	data: VaccinationSummary[];
	pageToken?: string;
}

// Type for infinite query data
type VaccinationSummaryList = InfiniteData<SummaryPage>;

// Ripple effect function for button clicks
const createRippleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
	const button = e.currentTarget;

	// Create ripple element
	const ripple = document.createElement("span");
	ripple.classList.add(
		"absolute",
		"inset-0",
		"bg-white",
		"opacity-30",
		"rounded-full",
		"transform",
		"scale-0",
		"ripple-animation",
	);
	ripple.classList.add("ripple-temp");

	const ripples = document.querySelectorAll(".ripple-temp");
	for (const oldRipple of ripples) {
		oldRipple.remove();
	}

	button.appendChild(ripple);
	setTimeout(() => {
		ripple.remove();
	}, 700);
};

export default function VaccinationDetailPage() {
	const { id } = useParams<{ id: string }>();
	const vaccinationId = id ? Number.parseInt(id, 10) : 0;
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { selectedCenter } = useCenterStore();
	const queryClient = useQueryClient();
	const [isCompleting, setIsCompleting] = useState(false);

	// Add ripple animation style
	useEffect(() => {
		// Check if style already exists
		if (!document.getElementById("ripple-style")) {
			const style = document.createElement("style");
			style.id = "ripple-style";
			style.innerHTML = `
				@keyframes rippleAnimation {
					0% {
						transform: scale(0);
						opacity: 0.3;
					}
					100% {
						transform: scale(4);
						opacity: 0;
					}
				}
				.ripple-animation {
					animation: rippleAnimation 0.6s linear forwards;
				}
			`;
			document.head.appendChild(style);
		}

		return () => {
			// Clean up style on unmount
			const styleEl = document.getElementById("ripple-style");
			if (styleEl) {
				styleEl.remove();
			}
		};
	}, []);

	// Fetch vaccination details
	const {
		data: vaccinationDetail,
		isLoading: isLoadingDetail,
		refetch,
	} = useQuery({
		queryKey: ["vaccinationDetail", vaccinationId],
		queryFn: () => fetchVaccinationDetailAPI(vaccinationId),
		enabled: !!vaccinationId,
	});

	// Move the mutation hook here - before any conditional returns
	const { mutate: completeVaccination } = useMutation({
		mutationFn: () =>
			completeVaccinationAPI(
				vaccinationId,
				Number(selectedCenter?.centerId) || -1,
				{
					dogIds: [],
				},
			),
		onMutate: async () => {
			setIsCompleting(true);

			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: ["vaccinationDetail", vaccinationId],
			});

			// Also cancel any vaccinationSummaries queries
			await queryClient.cancelQueries({
				queryKey: ["vaccinationSummaries", selectedCenter?.centerId],
			});

			// Get snapshot of current data
			const previousData = queryClient.getQueryData([
				"vaccinationDetail",
				vaccinationId,
			]);

			// Get summaries data for optimistic update
			const previousSummaries =
				queryClient.getQueryData<VaccinationSummaryList>([
					"vaccinationSummaries",
					selectedCenter?.centerId,
				]);

			// Optimistically update the UI for detail view
			if (vaccinationDetail) {
				queryClient.setQueryData(["vaccinationDetail", vaccinationId], {
					...vaccinationDetail,
					status: "COMPLETED",
					completedDogCount: vaccinationDetail.totalCount,
				});

				// Also update the vaccination summaries list if it exists
				if (previousSummaries) {
					queryClient.setQueryData<VaccinationSummaryList>(
						["vaccinationSummaries", selectedCenter?.centerId],
						(old) => {
							if (!old) return old;

							// Update the vaccination status in all pages
							return {
								...old,
								pages: old.pages.map((page) => ({
									...page,
									data: page.data.map((item) =>
										item.vaccinationId === vaccinationId
											? { ...item, status: "COMPLETED" }
											: item,
									),
								})),
							};
						},
					);
				}
			}

			return { previousData, previousSummaries };
		},
		onSuccess: () => {
			toast.success("접종이 완료되었습니다", {
				duration: 2000,
			});

			// Update all related queries to ensure consistency
			queryClient.invalidateQueries({
				queryKey: ["vaccinationDetail", vaccinationId],
			});
			queryClient.invalidateQueries({
				queryKey: ["pendingDogs"],
			});
			queryClient.invalidateQueries({
				queryKey: ["completedDogs"],
			});
			queryClient.invalidateQueries({
				queryKey: ["vaccinationSummaries", selectedCenter?.centerId],
			});
		},
		onError: (error, _, context) => {
			console.error("error:", error);
			if (context?.previousData) {
				queryClient.setQueryData(
					["vaccinationDetail", vaccinationId],
					context.previousData,
				);
			}

			// Revert the vaccination summaries if there was an error
			if (context?.previousSummaries) {
				queryClient.setQueryData(
					["vaccinationSummaries", selectedCenter?.centerId],
					context.previousSummaries,
				);
			}

			toast.error("접종 완료 처리에 실패했습니다", {
				duration: 3000,
			});
		},
		onSettled: () => {
			setIsCompleting(false);
		},
	});

	const handleCompleteVaccination = () => {
		completeVaccination();
	};

	// Get counts for drawer tabs
	const pendingCount =
		!isLoadingDetail && vaccinationDetail
			? vaccinationDetail.totalCount - vaccinationDetail.completedDogCount
			: 0;

	const completedCount =
		!isLoadingDetail && vaccinationDetail
			? vaccinationDetail.completedDogCount
			: 0;

	// Check if vaccination is ongoing or completed
	const isOngoing =
		!isLoadingDetail &&
		vaccinationDetail &&
		String(vaccinationDetail.status) === "ONGOING";

	if (isLoadingDetail) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-pulse flex flex-col items-center">
					<div className="h-12 w-3/4 bg-gray-200 rounded-lg mb-4" />
					<div className="h-40 w-full bg-gray-200 rounded-lg mb-4" />
					<div className="h-40 w-full bg-gray-200 rounded-lg mb-4" />
					<div className="h-60 w-full bg-gray-200 rounded-lg" />
				</div>
			</div>
		);
	}

	if (!vaccinationDetail) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<div className="text-xl font-semibold text-gray-700">
					데이터를 불러올 수 없습니다
				</div>
				<p className="text-gray-500 mt-2">잠시 후 다시 시도해주세요</p>
			</div>
		);
	}

	// Only format date if vaccinationDetail is available
	const formattedDate = vaccinationDetail?.operatedDate
		? new Date(vaccinationDetail.operatedDate).toLocaleDateString("ko-KR", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-5 w-full px-4 pb-8 max-w-md mx-auto relative"
		>
			{/* Status Badge */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div
					className={`flex w-24 justify-center items-center gap-1.5 px-3 py-1.5 rounded-full ${
						isOngoing
							? "bg-amber-100 text-amber-700"
							: "bg-green-100 text-green-700"
					}`}
				>
					{isOngoing ? (
						<>
							<ClockIcon size={16} />
							<span className="font-medium text-sm">진행중</span>
						</>
					) : (
						<>
							<CheckCircleIcon size={16} />
							<span className="font-medium text-sm">완료</span>
						</>
					)}
				</div>
			</motion.div>

			<motion.div
				initial={{ y: -20 }}
				animate={{ y: 0 }}
				className="text-3xl font-bold text-center text-primary"
			>
				{vaccinationDetail?.title || ""}
			</motion.div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1 }}
				className="w-full rounded-xl bg-white p-5 shadow-custom-sm"
			>
				<div className="flex flex-col space-y-4">
					<div className="flex items-center gap-3">
						<div className="bg-blue-100 p-2 rounded-full">
							<MapPinIcon className="h-5 w-5 text-blue-600" />
						</div>
						<div className="flex-1">
							<p className="text-sm text-gray-500">대상</p>
							<div className="flex flex-wrap gap-1.5 mt-0.5">
								{vaccinationDetail &&
								Array.isArray(
									vaccinationDetail.locationNames,
								) &&
								vaccinationDetail.locationNames.length > 0 ? (
									vaccinationDetail.locationNames.map(
										(location: string) => (
											<span
												key={`location-${location}`}
												className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border shadow-sm transition-all"
											>
												{location}
											</span>
										),
									)
								) : (
									<span className="font-medium">
										{vaccinationDetail?.locationNames ||
											"지정되지 않음"}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="bg-green-100 p-2 rounded-full">
							<CalendarIcon className="h-5 w-5 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">일시</p>
							<p className="font-medium">{formattedDate}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="bg-purple-100 p-2 rounded-full">
							<SyringeIcon className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">접종 내용</p>
							<p className="font-medium">
								{vaccinationDetail?.content || ""}
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="w-full rounded-xl bg-white p-5 shadow-custom-sm"
			>
				<div className="flex justify-between">
					<div className="mb-3">
						<h2 className="text-lg font-semibold text-gray-800">
							진행 현황
						</h2>
						<p className="text-sm text-gray-500">
							총{" "}
							{!isLoadingDetail && vaccinationDetail
								? vaccinationDetail.totalCount
								: "-"}
							마리 접종 예정
						</p>
					</div>
					{/* Floating action button for mobile */}
					<button
						type="button"
						onClick={() => setDrawerOpen(true)}
						className="bg-male shadow-custom-sm rounded-full w-12 h-12 flex items-center justify-center text-white z-10 relative overflow-hidden transition duration-200 active:scale-95"
						onMouseDown={createRippleEffect}
					>
						<ListIcon size={24} />
					</button>
				</div>

				<div className="flex flex-col md:flex-row items-center justify-between gap-5">
					<div className="flex-shrink-0">
						{!isLoadingDetail && vaccinationDetail && (
							<PillProgress
								completed={vaccinationDetail.completedDogCount}
								pending={
									vaccinationDetail.totalCount -
									vaccinationDetail.completedDogCount
								}
							/>
						)}
					</div>

					<div className="grid grid-cols-2 gap-3 w-full">
						<div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3">
							<p className="text-xs text-blue-600 font-medium">
								완료
							</p>
							<p className="text-xl font-bold text-blue-700">
								{!isLoadingDetail && vaccinationDetail
									? vaccinationDetail.completedDogCount
									: "-"}
							</p>
						</div>

						<div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-3">
							<p className="text-xs text-amber-600 font-medium">
								미완료
							</p>
							<p className="text-xl font-bold text-amber-700">
								{!isLoadingDetail && vaccinationDetail
									? vaccinationDetail.totalCount -
										vaccinationDetail.completedDogCount
									: "-"}
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Complete button - only show if status is ONGOING */}
			{isOngoing && (
				<div className="flex justify-center w-full">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="fixed bottom-4"
					>
						<AnimatePresence mode="wait">
							{!isCompleting ? (
								<motion.button
									key="complete-button"
									type="button"
									className="bg-male rounded-full text-white font-semibold w-48 py-2 px-4 relative overflow-hidden transition-all duration-200 active:scale-95 active:brightness-90 focus:outline-none group"
									onClick={(e) => {
										createRippleEffect(e);
										handleCompleteVaccination();
									}}
									whileTap={{ scale: 0.95 }}
								>
									<span className="relative z-10">완료</span>
								</motion.button>
							) : (
								<motion.div
									key="loading-button"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									className="bg-male/80 rounded-full text-white font-semibold w-48 py-2 px-4 flex items-center justify-center"
								>
									<LoaderIcon
										className="animate-spin mr-2"
										size={18}
									/>
									<span>처리 중...</span>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			)}

			{/* Use the VaccinationDrawer component */}
			<VaccinationDrawer
				drawerOpen={drawerOpen}
				setDrawerOpen={setDrawerOpen}
				vaccinationId={vaccinationId}
				pendingCount={pendingCount}
				completedCount={completedCount}
				centerId={selectedCenter?.centerId || ""}
				onUpdateSuccess={refetch}
				isOngoing={isOngoing}
			/>
		</motion.div>
	);
}
