import { useState } from "react";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	FaPills,
	FaChevronDown,
	FaChevronUp,
	FaPlusCircle,
	FaTrashAlt,
	FaEdit,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DogInfoCard from "./DogInfoCard";
import {
	createDogMedicalHistoryAPI,
	fetchDogMedicalHistory,
	removeDogMedicalHistoryAPI,
	updateMedicalHistoryAPI,
} from "@/api/dog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import type { MedicalType } from "@/types/dog";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import useAuthStore from "@/lib/store/authStore";

interface DogMediInfosProps {
	dogId: number;
	isManager: boolean;
	centerId: number;
}

export default function DogMediInfos({
	dogId,
	isManager,
	centerId,
}: DogMediInfosProps) {
	const { user } = useAuthStore();
	const currentMemberId = user.memberId;
	const [isExpanded, setIsExpanded] = useState(false);
	const [open, setOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // New state for AlertDialog
	const queryClient = useQueryClient();
	const [selectedHistory, setSelectedHistory] = useState<{
		id: number;
		content: string;
		image?: string | null;
		operatedDate: string;
		medicalType: string;
		medicalPeriod: number;
		memberId?: number;
	} | null>(null);

	const {
		data: medicalHistories,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["dogMedicalHistory", dogId],
		queryFn: ({ pageParam }: { pageParam?: string }) =>
			fetchDogMedicalHistory(Number(dogId), pageParam),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.pageToken,
		enabled: isExpanded && !!dogId,
	});

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
		const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.2;

		if (isNearBottom && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const toLocalDateTimeString = (date: string): string => {
		return `${date}T00:00:00`;
	};

	const formatDate = (dateStr: string): string => {
		if (!dateStr || Number.isNaN(Date.parse(dateStr))) {
			return "알 수 없음";
		}
		return new Date(dateStr).toISOString().split("T")[0];
	};

	const handleClick = () => {
		setIsExpanded((prev) => !prev);
	};

	const [form, setForm] = useState<{
		content: string;
		medicalPeriod: number;
		medicalType: MedicalType;
		operatedDate: string;
	}>({
		content: "",
		medicalPeriod: 1,
		medicalType: "MEDICATION",
		operatedDate: new Date().toISOString().split("T")[0],
	});

	const [imageFile, setImageFile] = useState<File | null>(null);

	const handleEdit = (history: {
		id: number;
		content: string;
		image?: string | null;
		operatedDate: string;
		medicalType: string;
		medicalPeriod: number;
		memberId: number;
	}) => {
		setIsEditMode(true);
		setForm({
			content: history.content,
			medicalPeriod: history.medicalPeriod,
			medicalType: history.medicalType as MedicalType,
			operatedDate: formatDate(history.operatedDate),
		});
		setSelectedHistory({
			id: history.id,
			content: history.content,
			image: history.image,
			operatedDate: history.operatedDate,
			medicalType: history.medicalType,
			medicalPeriod: history.medicalPeriod,
			memberId: history.memberId,
		});
		setOpen(true);
	};

	const handleOpenDrawer = () => {
		setIsEditMode(false);
		setForm({
			content: "",
			medicalPeriod: 1,
			medicalType: "MEDICATION",
			operatedDate: new Date().toISOString().split("T")[0],
		});
		setImageFile(null);
		setOpen(true);
	};

	const closeDrawer = () => {
		setOpen(false);
		setIsEditMode(false);
		setImageFile(null);
		setSelectedHistory(null);
	};

	const mutation = useMutation({
		mutationFn: async () => {
			const request = {
				...form,
				operatedDate: toLocalDateTimeString(form.operatedDate),
			};
			return await createDogMedicalHistoryAPI(
				dogId,
				centerId,
				request,
				imageFile,
			);
		},
		onSuccess: () => {
			toast.success("의료 기록이 등록되었습니다");
			closeDrawer();
			queryClient.invalidateQueries({
				queryKey: ["dogMedicalHistory", dogId],
			});
		},
		onError: () => {
			toast.error("등록 실패");
		},
	});

	const updateMutation = useMutation({
		mutationFn: async () => {
			if (!selectedHistory) return null;
			const request = {
				content: form.content,
				medicalPeriod: form.medicalPeriod,
				medicalType: form.medicalType,
				operatedDate: toLocalDateTimeString(form.operatedDate),
			};
			return await updateMedicalHistoryAPI(
				selectedHistory.id,
				request,
				imageFile,
				centerId,
			);
		},
		onSuccess: () => {
			toast.success("의료 기록이 수정되었습니다");
			closeDrawer();
			queryClient.invalidateQueries({
				queryKey: ["dogMedicalHistory", dogId],
			});
		},
		onError: () => {
			toast.error("수정 실패");
		},
	});

	const deleteMedication = useMutation({
		mutationFn: (id: number) =>
			removeDogMedicalHistoryAPI(id, centerId, dogId),
		onSuccess: (_, deletedId) => {
			toast.success("의료 정보가 삭제되었습니다.");
			queryClient.setQueryData(
				["dogMedicalHistory", dogId],
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(prev: any) => {
					if (!prev) return prev;
					return {
						...prev,
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						pages: prev.pages.map((page: any) => ({
							...page,
							data: page.data.filter(
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								(item: any) => item.id !== deletedId,
							),
						})),
					};
				},
			);
		},
		onError: () => {
			toast.error("의료 정보 삭제에 실패했습니다.");
		},
	});

	return (
		<DogInfoCard title="의료 기록">
			{isManager && (
				<div className="w-full flex justify-end px-2">
					<button
						type="button"
						className="flex justify-end px-4 items-center gap-2 bg-male text-white rounded-full hover:bg-blue"
						onClick={handleOpenDrawer}
					>
						추가하기 <FaPlusCircle />
					</button>
				</div>
			)}
			<div className="flex flex-col gap-2">
				<button
					type="button"
					onClick={handleClick}
					className="flex justify-between items-center text-lg px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
				>
					<span className="text-gray-500">복약기록 확인하기</span>
					{isExpanded ? (
						<FaChevronUp className="text-gray-500" />
					) : (
						<FaChevronDown className="text-gray-500" />
					)}
				</button>
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="max-h-[500px] overflow-y-scroll"
							onScroll={handleScroll}
						>
							{isLoading ? (
								<div className="flex items-center justify-center py-2 w-full">
									<svg
										className="animate-spin h-5 w-5 text-gray-500"
										viewBox="0 0 24 24"
									>
										<title>Loading...</title>
										<circle
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
									</svg>
								</div>
							) : error ? (
								<div className="text-center py-2 text-red-500 w-full">
									복약기록을 불러오지 못했습니다.
								</div>
							) : medicalHistories &&
								medicalHistories.pages.flatMap(
									(page) => page.data,
								).length > 0 ? (
								<div className="flex flex-col gap-2">
									{medicalHistories.pages
										.flatMap((page) => page.data)
										.map((history) => (
											<div
												key={history.id}
												className="flex items-center gap-3 p-2 border-b border-gray-200"
											>
												<Avatar className="size-24 rounded-none">
													{history.image ? (
														<AvatarImage
															src={history.image}
															alt={
																history.content
															}
															className="object-cover"
														/>
													) : (
														<AvatarFallback className="rounded-none">
															<FaPills className="text-gray-400 size-5" />
														</AvatarFallback>
													)}
												</Avatar>
												<div className="flex flex-col w-full h-24 justify-between">
													<span className="text-sm font-medium overflow-ellipsis">
														{history.content}
													</span>
													<span className="flex w-full justify-between items-center">
														<span className="text-xs text-gray-500">
															{
																history.medicalType
															}{" "}
															|{" "}
															{
																history.medicalPeriod
															}
															일 |{" "}
															{formatDate(
																history.operatedDate,
															)}
														</span>
														{isManager &&
															history.memberId ===
																currentMemberId && (
																<div className="flex gap-2">
																	<button
																		type="button"
																		className="text-blue-500 text-sm px-2"
																		onClick={() =>
																			handleEdit(
																				history,
																			)
																		}
																	>
																		<FaEdit />
																	</button>
																	<button
																		type="button"
																		className="text-red-500 text-sm px-2"
																		onClick={() => {
																			setSelectedHistory(
																				{
																					id: history.id,
																					content:
																						history.content,
																					image: history.image,
																					operatedDate:
																						history.operatedDate,
																					medicalType:
																						history.medicalType,
																					medicalPeriod:
																						history.medicalPeriod,
																					memberId:
																						history.memberId,
																				},
																			);
																			setIsDeleteDialogOpen(
																				true,
																			); // Open AlertDialog
																		}}
																	>
																		<FaTrashAlt />
																	</button>
																</div>
															)}
													</span>
												</div>
											</div>
										))}
									{isFetchingNextPage && (
										<div className="flex items-center justify-center py-2 w-full">
											<svg
												className="animate-spin h-5 w-5 text-gray-500"
												viewBox="0 0 24 24"
											>
												<title>Loading more...</title>
												<circle
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
													fill="none"
												/>
											</svg>
										</div>
									)}
								</div>
							) : (
								<div className="text-center py-2 text-gray-500 w-full">
									복약기록이 없습니다.
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerContent>
						<div className="mx-auto w-full max-w-sm">
							<DrawerHeader>
								<DrawerTitle>
									{isEditMode
										? "복약정보 수정"
										: "복약정보 추가"}
								</DrawerTitle>
							</DrawerHeader>
							<div className="p-4 space-y-4">
								<div className="flex flex-col gap-1">
									<label
										htmlFor="image"
										className="text-sm font-medium text-gray-700"
									>
										이미지 (선택)
									</label>
									<input
										id="image"
										type="file"
										accept="image/*"
										className="border px-3 py-2 rounded-md"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												setImageFile(file);
											}
										}}
									/>
									{isEditMode && selectedHistory?.image && (
										<div className="mt-2">
											<p className="text-xs text-gray-500 mb-1">
												현재 이미지:
											</p>
											<img
												src={selectedHistory.image}
												alt="현재 이미지"
												className="w-24 h-24 object-cover border rounded"
											/>
										</div>
									)}
								</div>
								<div className="flex flex-col gap-1">
									<label
										htmlFor="content"
										className="text-sm font-medium text-gray-700"
									>
										내용
									</label>
									<input
										id="content"
										type="text"
										className="border px-3 py-2 rounded-md"
										value={form.content}
										onChange={(e) =>
											setForm({
												...form,
												content: e.target.value,
											})
										}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label
										htmlFor="period"
										className="text-sm font-medium text-gray-700"
									>
										복약 주기 (일)
									</label>
									<input
										id="period"
										type="number"
										className="border px-3 py-2 rounded-md"
										value={form.medicalPeriod}
										onChange={(e) =>
											setForm({
												...form,
												medicalPeriod: Number(
													e.target.value,
												),
											})
										}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label
										htmlFor="type"
										className="text-sm font-medium text-gray-700"
									>
										종류
									</label>
									<select
										id="type"
										className="border px-3 py-2 rounded-md"
										value={form.medicalType}
										onChange={(e) =>
											setForm({
												...form,
												medicalType: e.target
													.value as MedicalType,
											})
										}
									>
										<option value="SURGERY">수술</option>
										<option value="MEDICATION">복약</option>
									</select>
								</div>
								<div className="flex flex-col gap-1">
									<label
										htmlFor="date"
										className="text-sm font-medium text-gray-700"
									>
										시행일
									</label>
									<input
										id="date"
										type="date"
										className="border px-3 py-2 rounded-md"
										value={form.operatedDate}
										onChange={(e) =>
											setForm({
												...form,
												operatedDate: e.target.value,
											})
										}
									/>
								</div>
								<div className="flex justify-end pt-2">
									<button
										type="button"
										className="bg-male text-white px-4 py-2 rounded-md font-semibold"
										onClick={() =>
											isEditMode
												? updateMutation.mutate()
												: mutation.mutate()
										}
									>
										{isEditMode ? "수정" : "등록"}
									</button>
								</div>
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							정말 삭제하시겠습니까?
						</AlertDialogTitle>
						<AlertDialogDescription>
							삭제된 의료 기록은 복구할 수 없습니다.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex items-start gap-4 py-2">
						{selectedHistory?.image ? (
							<img
								src={selectedHistory.image}
								alt="의료기록 이미지"
								className="w-20 h-20 object-cover rounded border"
							/>
						) : (
							<div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded border text-gray-400">
								<FaPills className="text-xl" />
							</div>
						)}
						<div className="text-sm space-y-1">
							<div>
								<strong>내용:</strong>{" "}
								{selectedHistory?.content}
							</div>
							<div>
								<strong>시행일:</strong>{" "}
								{formatDate(
									selectedHistory?.operatedDate || "",
								)}
							</div>
							<div>
								<strong>종류:</strong>{" "}
								{selectedHistory?.medicalType === "SURGERY"
									? "수술"
									: "복약"}
							</div>
							<div>
								<strong>복약 주기:</strong>{" "}
								{selectedHistory?.medicalPeriod}일
							</div>
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>취소</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (selectedHistory) {
									deleteMedication.mutate(selectedHistory.id);
									setIsDeleteDialogOpen(false);
									setSelectedHistory(null);
								}
							}}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							삭제하기
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</DogInfoCard>
	);
}
