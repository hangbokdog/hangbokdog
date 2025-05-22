import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	SearchIcon,
	XIcon,
	LoaderIcon,
	CheckSquareIcon,
	SquareIcon,
	SyringeIcon,
	LockIcon,
} from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
	fetchNotYetVaccinatedDogsAPI,
	fetchVaccinatedDogsAPI,
	saveVaccinationAPI,
	type VaccinationDoneResponse,
} from "@/api/vaccine";

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

// Get age in years and months
const formatAge = (ageInMonths: number) => {
	const years = Math.floor(ageInMonths / 12);
	const months = ageInMonths % 12;

	if (years > 0) {
		return `${years}년 ${months > 0 ? `${months}개월` : ""}`;
	}
	return `${months}개월`;
};

interface VaccinationDrawerProps {
	drawerOpen: boolean;
	setDrawerOpen: (open: boolean) => void;
	vaccinationId: number;
	pendingCount: number;
	completedCount: number;
	centerId: string;
	onUpdateSuccess: () => void;
	isOngoing: boolean;
}

export default function VaccinationDrawer({
	drawerOpen,
	setDrawerOpen,
	vaccinationId,
	pendingCount,
	completedCount,
	centerId,
	onUpdateSuccess,
	isOngoing,
}: VaccinationDrawerProps) {
	const [activeTab, setActiveTab] = useState<"pending" | "completed">(
		"pending",
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();

	// Clear selected dogs when changing tabs or closing drawer
	useEffect(() => {
		if (!drawerOpen) {
			setSelectedDogs([]);
			setSearchQuery("");
		}
	}, [drawerOpen]);

	// Fetch all pending dogs data
	const {
		data: pendingDogs = [],
		isLoading: isLoadingPending,
		isError: isPendingError,
		refetch: refetchPending,
	} = useQuery({
		queryKey: ["pendingDogs", vaccinationId],
		queryFn: async () => {
			const response = await fetchNotYetVaccinatedDogsAPI(vaccinationId);
			return response;
		},
		enabled: !!vaccinationId && drawerOpen && activeTab === "pending",
	});

	// Fetch all completed dogs data
	const {
		data: completedDogs = [],
		isLoading: isLoadingCompleted,
		isError: isCompletedError,
		refetch: refetchCompleted,
	} = useQuery({
		queryKey: ["completedDogs", vaccinationId],
		queryFn: async () => {
			const response = await fetchVaccinatedDogsAPI(vaccinationId);
			return response;
		},
		enabled: !!vaccinationId && drawerOpen && activeTab === "completed",
	});

	// Filter dogs locally based on search query
	const getFilteredDogs = useCallback(() => {
		let dogs: VaccinationDoneResponse[] = [];

		if (activeTab === "pending") {
			dogs = pendingDogs;
		} else {
			dogs = completedDogs;
		}

		// If no search query, return all dogs
		if (!searchQuery.trim()) {
			return dogs;
		}

		// Filter dogs by name (case insensitive)
		return dogs.filter((dog) =>
			dog.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [activeTab, pendingDogs, completedDogs, searchQuery]);

	const filteredDogs = getFilteredDogs();

	// Toggle selection of a dog
	const toggleDogSelection = (dogId: number) => {
		if (!isOngoing) return; // Prevent selection if not ongoing

		setSelectedDogs((prev) => {
			if (prev.includes(dogId)) {
				return prev.filter((id) => id !== dogId);
			}
			return [...prev, dogId];
		});
	};

	// Select all filtered dogs
	const selectAllDogs = () => {
		if (!isOngoing) return; // Prevent selection if not ongoing

		const allDogIds = filteredDogs.map((dog) => dog.dogId);
		setSelectedDogs(allDogIds);
	};

	// Deselect all dogs
	const deselectAllDogs = () => {
		setSelectedDogs([]);
	};

	// Complete selected dogs vaccinations
	const saveSelectedVaccinations = async () => {
		if (!isOngoing) {
			toast.error("이미 완료된 접종은 수정할 수 없습니다");
			return;
		}

		if (selectedDogs.length === 0) {
			toast.error("강아지를 선택해주세요");
			return;
		}

		if (!vaccinationId || !centerId) {
			toast.error("데이터가 올바르지 않습니다");
			return;
		}

		try {
			setIsSubmitting(true);
			await saveVaccinationAPI(vaccinationId, centerId, {
				dogIds: selectedDogs,
			});

			// Reset selection and refresh data
			setSelectedDogs([]);

			// Show success message
			toast.success(
				`${selectedDogs.length}마리 접종 완료 처리되었습니다`,
			);

			// Invalidate and refetch queries
			await queryClient.invalidateQueries({ queryKey: ["pendingDogs"] });
			await queryClient.invalidateQueries({
				queryKey: ["completedDogs"],
			});
			await queryClient.invalidateQueries({
				queryKey: ["vaccinationDetail"],
			});

			// Refetch data
			refetchPending();
			refetchCompleted();
			onUpdateSuccess();
		} catch (error) {
			console.error("Failed to complete vaccinations:", error);
			toast.error("접종 완료 처리에 실패했습니다");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{/* Drawer overlay */}
			<AnimatePresence>
				{drawerOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
						onClick={() => setDrawerOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Drawer panel */}
			<AnimatePresence>
				{drawerOpen && (
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{
							type: "spring",
							damping: 25,
							stiffness: 300,
						}}
						className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-40 flex flex-col"
						drag={activeTab === "pending" ? "x" : false}
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={0.1}
						onDragEnd={(_e, info) => {
							if (info.offset.x > 100) {
								setDrawerOpen(false);
							}
						}}
					>
						<div className="flex items-center justify-between p-4 border-b">
							<div className="flex items-center gap-2">
								<h2 className="text-lg font-semibold">
									강아지 접종 관리
								</h2>
								{!isOngoing && (
									<div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
										<LockIcon
											size={14}
											className="text-gray-500"
										/>
										<span className="text-xs text-gray-500 font-medium">
											읽기 전용
										</span>
									</div>
								)}
							</div>
							<button
								type="button"
								onClick={() => setDrawerOpen(false)}
								className="p-1 rounded-full hover:bg-gray-100"
							>
								<XIcon size={20} />
							</button>
						</div>

						{/* Search and selection controls */}
						<div className="p-4 border-b">
							<div className="relative mb-3">
								<SearchIcon
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<input
									type="text"
									placeholder="이름 검색"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-male"
								/>
								{searchQuery && (
									<button
										type="button"
										onClick={() => setSearchQuery("")}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									>
										<XIcon size={16} />
									</button>
								)}
							</div>

							{activeTab === "pending" && isOngoing && (
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-4">
										<button
											type="button"
											onClick={selectAllDogs}
											className="flex items-center text-sm text-male font-medium hover:text-male-dark"
										>
											<CheckSquareIcon
												size={16}
												className="mr-1"
											/>
											전체 선택
										</button>
										<button
											type="button"
											onClick={deselectAllDogs}
											className="flex items-center text-sm text-gray-600 font-medium hover:text-gray-900"
										>
											<SquareIcon
												size={16}
												className="mr-1"
											/>
											전체 취소
										</button>
									</div>
									<span className="text-sm text-gray-500">
										{selectedDogs.length}마리 선택됨
									</span>
								</div>
							)}
						</div>

						{/* Tabs */}
						<div className="flex border-b">
							<button
								type="button"
								className={`flex-1 py-3 font-medium text-center ${
									activeTab === "pending"
										? "text-male border-b-2 border-male"
										: "text-gray-500"
								}`}
								onClick={() => {
									setActiveTab("pending");
									setSelectedDogs([]);
									setSearchQuery("");
								}}
							>
								미완료 ({pendingCount})
							</button>
							<button
								type="button"
								className={`flex-1 py-3 font-medium text-center ${
									activeTab === "completed"
										? "text-male border-b-2 border-male"
										: "text-gray-500"
								}`}
								onClick={() => {
									setActiveTab("completed");
									setSelectedDogs([]);
									setSearchQuery("");
								}}
							>
								완료 ({completedCount})
							</button>
						</div>

						{/* Dog list */}
						<div className="flex-1 overflow-y-auto p-2">
							{/* Loading state */}
							{(activeTab === "pending" && isLoadingPending) ||
							(activeTab === "completed" &&
								isLoadingCompleted) ? (
								<div className="flex flex-col items-center justify-center h-full text-gray-500">
									<LoaderIcon
										size={48}
										className="mb-3 text-gray-300 animate-spin"
									/>
									<p>데이터를 불러오는 중입니다...</p>
								</div>
							) : activeTab === "pending" && isPendingError ? (
								// Error state for pending tab
								<div className="flex flex-col items-center justify-center h-full text-gray-500">
									<XIcon
										size={48}
										className="mb-3 text-red-500"
									/>
									<p>
										미완료 강아지 데이터를 불러오는데
										실패했습니다
									</p>
									<button
										type="button"
										className="mt-3 px-4 py-2 bg-male text-white rounded-lg"
										onClick={() => {
											queryClient.invalidateQueries({
												queryKey: ["pendingDogs"],
											});
										}}
									>
										다시 시도
									</button>
								</div>
							) : activeTab === "completed" &&
								isCompletedError ? (
								// Error state for completed tab
								<div className="flex flex-col items-center justify-center h-full text-gray-500">
									<XIcon
										size={48}
										className="mb-3 text-red-500"
									/>
									<p>
										완료된 강아지 데이터를 불러오는데
										실패했습니다
									</p>
									<button
										type="button"
										className="mt-3 px-4 py-2 bg-male text-white rounded-lg"
										onClick={() => {
											queryClient.invalidateQueries({
												queryKey: ["completedDogs"],
											});
										}}
									>
										다시 시도
									</button>
								</div>
							) : filteredDogs.length === 0 ? (
								// Empty state
								<div className="flex flex-col items-center justify-center h-full text-gray-500">
									<SyringeIcon
										size={48}
										className="mb-3 text-gray-300"
									/>
									<p>
										{activeTab === "pending"
											? "미완료된"
											: "완료된"}
										강아지가 없습니다
										{searchQuery &&
											` (검색어: ${searchQuery})`}
									</p>
								</div>
							) : (
								// Dogs list
								<ul className="space-y-2">
									{filteredDogs.map(
										(dog: VaccinationDoneResponse) => (
											<motion.li
												key={dog.dogId}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.2 }}
												className={`bg-white rounded-xl overflow-hidden border shadow-sm transition-colors ${
													selectedDogs.includes(
														dog.dogId,
													) &&
													activeTab === "pending" &&
													isOngoing
														? "border-male bg-male/5"
														: ""
												} ${
													activeTab === "pending" &&
													isOngoing
														? "cursor-pointer"
														: ""
												}`}
												onClick={() => {
													if (
														activeTab ===
															"pending" &&
														isOngoing
													) {
														toggleDogSelection(
															dog.dogId,
														);
													}
												}}
											>
												<div className="flex items-center p-3">
													{activeTab === "pending" &&
														isOngoing && (
															<div className="mr-2 flex-shrink-0">
																<input
																	type="checkbox"
																	className="hidden"
																	checked={selectedDogs.includes(
																		dog.dogId,
																	)}
																	onChange={(
																		e,
																	) => {
																		e.stopPropagation();
																		if (
																			isOngoing
																		) {
																			toggleDogSelection(
																				dog.dogId,
																			);
																		}
																	}}
																	id={`dog-checkbox-${dog.dogId}`}
																	disabled={
																		!isOngoing
																	}
																/>
																<label
																	htmlFor={`dog-checkbox-${dog.dogId}`}
																	className={`cursor-pointer inline-flex ${!isOngoing ? "opacity-50 cursor-not-allowed" : ""}`}
																	onClick={(
																		e,
																	) => {
																		e.stopPropagation();
																		if (
																			isOngoing
																		) {
																			toggleDogSelection(
																				dog.dogId,
																			);
																		}
																	}}
																	onKeyDown={(
																		e,
																	) => {
																		if (
																			(e.key ===
																				"Enter" ||
																				e.key ===
																					" ") &&
																			isOngoing
																		) {
																			e.stopPropagation();
																			toggleDogSelection(
																				dog.dogId,
																			);
																		}
																	}}
																>
																	{selectedDogs.includes(
																		dog.dogId,
																	) ? (
																		<CheckSquareIcon
																			size={
																				20
																			}
																			className="text-male"
																		/>
																	) : (
																		<SquareIcon
																			size={
																				20
																			}
																			className="text-gray-400"
																		/>
																	)}
																</label>
															</div>
														)}
													<div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
														{dog.imageUrl ? (
															<img
																src={
																	dog.imageUrl
																}
																alt={dog.name}
																className="w-full h-full object-cover"
															/>
														) : (
															<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
																🐶
															</div>
														)}
													</div>
													<div className="ml-3 flex-1">
														<div className="flex items-center">
															<h3 className="text-base font-medium text-gray-900">
																{dog.name}
															</h3>
															<span
																className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
																	activeTab ===
																	"completed"
																		? "bg-blue-100 text-blue-800"
																		: "bg-amber-100 text-amber-800"
																}`}
															>
																{activeTab ===
																"completed"
																	? "완료"
																	: "미완료"}
															</span>
														</div>
														<p className="text-sm text-gray-500">
															{formatAge(
																dog.ageMonth,
															)}
														</p>
													</div>
												</div>
											</motion.li>
										),
									)}
								</ul>
							)}
						</div>

						{/* Action bar */}
						<div className="p-4 border-t bg-gray-50">
							{activeTab === "pending" && isOngoing ? (
								<button
									type="button"
									className={`w-full py-3 ${
										selectedDogs.length > 0
											? "bg-male text-white"
											: "bg-gray-300 text-gray-500"
									} font-medium rounded-lg shadow-sm hover:brightness-95 transition-colors relative overflow-hidden`}
									onClick={saveSelectedVaccinations}
									disabled={
										selectedDogs.length === 0 ||
										isSubmitting ||
										!isOngoing
									}
									onMouseDown={
										selectedDogs.length > 0 && isOngoing
											? createRippleEffect
											: undefined
									}
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center">
											<LoaderIcon
												size={20}
												className="animate-spin mr-2"
											/>
											처리 중...
										</span>
									) : (
										<span>
											{selectedDogs.length > 0
												? `${selectedDogs.length}마리 접종 완료 처리`
												: "강아지를 선택해주세요"}
										</span>
									)}
								</button>
							) : (
								<button
									type="button"
									className="w-full py-3 bg-male text-white font-medium rounded-lg shadow-sm hover:bg-male/90 transition-colors relative overflow-hidden"
									onClick={() => setDrawerOpen(false)}
									onMouseDown={createRippleEffect}
								>
									닫기
								</button>
							)}
						</div>

						{/* Swipe indicator for mobile */}
						{activeTab === "pending" && (
							<div className="absolute left-1/2 transform -translate-x-1/2 top-1 w-10 h-1 bg-gray-300 rounded-full opacity-50" />
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
