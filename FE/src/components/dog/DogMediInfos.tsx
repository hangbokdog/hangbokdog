import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaPills, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DogInfoCard from "./DogInfoCard";
import { fetchDogMedicalHistory, type MedicalHistoryResponse } from "@/api/dog";

interface DogMediInfosProps {
	dogId: number;
}

export default function DogMediInfos({ dogId }: DogMediInfosProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const {
		data: medicalHistories,
		isLoading,
		error,
	} = useQuery<MedicalHistoryResponse[], Error>({
		queryKey: ["dogMedicalHistory", dogId],
		queryFn: () => fetchDogMedicalHistory(Number(dogId)),
		enabled: isExpanded && !!dogId,
	});

	const formatDate = (dateStr: string): string => {
		if (!dateStr || Number.isNaN(Date.parse(dateStr))) {
			return "알 수 없음";
		}
		return new Date(dateStr).toISOString().split("T")[0];
	};

	const handleClick = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<DogInfoCard title="복약정보">
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
			</div>
		</DogInfoCard>
	);
}
