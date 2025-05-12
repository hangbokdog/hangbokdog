import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	FaPills,
	FaChevronDown,
	FaChevronUp,
	FaPlusCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DogInfoCard from "./DogInfoCard";
import {
	createDogMedicalHistoryAPI,
	fetchDogMedicalHistory,
	type MedicalHistoryResponse,
} from "@/api/dog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import type { MedicalType } from "@/types/dog";
import { toast } from "sonner";

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
	const [isExpanded, setIsExpanded] = useState(false);
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const {
		data: medicalHistories,
		isLoading,
		error,
	} = useQuery<MedicalHistoryResponse[], Error>({
		queryKey: ["dogMedicalHistory", dogId],
		queryFn: () => fetchDogMedicalHistory(Number(dogId)),
		enabled: isExpanded && !!dogId,
	});

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
		operatedDate: new Date().toISOString().split("T")[0], // 오늘 날짜
	});

	const [imageFile, setImageFile] = useState<File | null>(null);

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
			toast.success("의료 기룍이 등록되었습니다");
			setOpen(false);
			setForm({
				content: "",
				medicalPeriod: 1,
				medicalType: "MEDICATION",
				operatedDate: new Date().toISOString().split("T")[0],
			});
			setImageFile(null);
			queryClient.invalidateQueries({
				queryKey: ["dogMedicalHistory", dogId],
			});
		},
		onError: () => {
			toast.error("등록 실패");
		},
	});

	return (
		<DogInfoCard title="의료 기록">
			{isManager && (
				<div className="w-full flex justify-end px-2">
					<button
						type="button"
						className="flex justify-end px-4 items-center gap-2 bg-male text-white rounded-full hover:bg-blue"
						onClick={() => setOpen(true)}
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
							className="overflow-hidden"
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
								medicalHistories.length > 0 ? (
								<div className="flex flex-col gap-2">
									{medicalHistories.map((history) => (
										<div
											key={history.id}
											className="flex items-center gap-3 p-2 border-b border-gray-200"
										>
											<Avatar className="size-10">
												{history.image ? (
													<AvatarImage
														src={history.image}
														alt={history.content}
														className="object-cover"
													/>
												) : (
													<AvatarFallback>
														<FaPills className="text-gray-400 size-5" />
													</AvatarFallback>
												)}
											</Avatar>
											<div className="flex flex-col">
												<span className="text-sm font-medium">
													{history.content}
												</span>
												<span className="text-xs text-gray-500">
													{history.medicalType} |{" "}
													{history.medicalPeriod}일 |{" "}
													{formatDate(
														history.operatedDate,
													)}
												</span>
											</div>
										</div>
									))}
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
								<DrawerTitle>복약정보 추가</DrawerTitle>
							</DrawerHeader>
							<div className="p-4 space-y-4">
								{/* 이미지 업로드 */}
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
								</div>
								{/* Content 입력 */}
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

								{/* Medical Period 입력 */}
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

								{/* Medical Type 선택 */}
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

								{/* Operated Date 선택 */}
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

								{/* 등록 버튼 */}
								<div className="flex justify-end pt-2">
									<button
										type="button"
										className="bg-male text-white px-4 py-2 rounded-md font-semibold"
										onClick={() => mutation.mutate()}
									>
										등록
									</button>
								</div>
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</DogInfoCard>
	);
}
