import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, ChevronDown, ChevronUp } from "lucide-react";
import { SlotHeader } from "./SlotHeader";
import { ApplicantCard } from "./ApplicantCard";
import type { SlotApplicant, SlotProps } from "@/types/volunteer";
import { useState } from "react";

interface DateGroupProps {
	date: string;
	formattedDate: string;
	slots: SlotProps[];
	totalApplicants: number;
	openSlots: Record<number, boolean>;
	selectedSlot: number | null;
	slotApplicants: SlotApplicant[] | undefined;
	isApplicantsLoading: boolean;
	processingApplicants: Record<number, boolean>;
	recentAction: { id: number; action: "approve" | "reject" } | null;
	onToggleSlot: (slotId: number) => void;
	onApprove: (id: number) => void;
	onReject: (id: number) => void;
	getSlotTypeText: (type: string) => string;
	getCapacityColorClass: (count: number, capacity: number) => string;
	formatTime: (time: string) => string;
	dateIndex: number;
}

export const DateGroup = ({
	date,
	formattedDate,
	slots,
	totalApplicants,
	openSlots,
	selectedSlot,
	slotApplicants,
	isApplicantsLoading,
	processingApplicants,
	recentAction,
	onToggleSlot,
	onApprove,
	onReject,
	getSlotTypeText,
	getCapacityColorClass,
	formatTime,
	dateIndex,
}: DateGroupProps) => {
	const [isDateOpen, setIsDateOpen] = useState(totalApplicants > 0);

	return (
		<motion.div
			key={date}
			className="bg-white rounded-xl overflow-hidden shadow-md"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.4,
				delay: dateIndex * 0.05,
				ease: "easeOut",
			}}
			whileHover={{
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
			}}
		>
			{/* 날짜 헤더 */}
			<button
				type="button"
				className="w-full bg-indigo-50 p-3 cursor-pointer hover:bg-indigo-100 transition-colors text-left"
				onClick={() => setIsDateOpen(!isDateOpen)}
			>
				<div className="flex items-center justify-between">
					<h3 className="font-semibold flex items-center gap-2 text-indigo-700">
						<Calendar size={16} className="text-indigo-500" />
						{formattedDate}
						{isDateOpen ? (
							<ChevronUp size={16} className="text-indigo-500" />
						) : (
							<ChevronDown
								size={16}
								className="text-indigo-500"
							/>
						)}
					</h3>
					{totalApplicants > 0 && (
						<div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-sm font-medium">
							<Users size={14} />
							<span>{totalApplicants}명</span>
						</div>
					)}
				</div>
			</button>

			{/* 오전/오후 슬롯 목록 */}
			<AnimatePresence>
				{isDateOpen && (
					<motion.div
						className="p-3 space-y-2"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						{slots.map((slot) => (
							<div
								key={slot.id}
								className={`rounded-lg border ${
									slot.applicationCount > 0
										? "bg-white border-slate-200"
										: "bg-slate-50 border-slate-100"
								}`}
							>
								<SlotHeader
									slotType={slot.slotType}
									startTime={slot.startTime}
									endTime={slot.endTime}
									applicationCount={slot.applicationCount}
									capacity={slot.capacity}
									isOpen={openSlots[slot.id] || false}
									onToggle={() => onToggleSlot(slot.id)}
									getSlotTypeText={getSlotTypeText}
									getCapacityColorClass={
										getCapacityColorClass
									}
									formatTime={formatTime}
								/>

								{/* 신청자 목록 */}
								{openSlots[slot.id] && (
									<motion.div
										className="bg-slate-50 overflow-hidden border-t border-slate-100"
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{
											duration: 0.3,
											ease: "easeInOut",
										}}
									>
										<div className="p-4">
											{isApplicantsLoading ? (
												<div className="text-center py-4 text-slate-500">
													신청자 정보를 불러오는 중...
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
																	<ApplicantCard
																		key={
																			applicant.id
																		}
																		applicant={
																			applicant
																		}
																		processingApplicants={
																			processingApplicants
																		}
																		recentAction={
																			recentAction
																		}
																		onApprove={
																			onApprove
																		}
																		onReject={
																			onReject
																		}
																		index={
																			index
																		}
																	/>
																),
															)}
														</div>
													) : (
														<div className="text-center py-4 text-slate-500">
															신청자가 없습니다
														</div>
													)}
												</div>
											)}
										</div>
									</motion.div>
								)}
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};
