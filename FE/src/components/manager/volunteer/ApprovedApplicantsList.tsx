import { motion } from "framer-motion";
import {
	Users,
	Search,
	CheckCircle2,
	Check,
	User,
	Mail,
	Phone,
	Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "./SearchBar";
import type { VolunteerApplicantThumb } from "@/types/volunteer";

interface ApprovedApplicantsListProps {
	approvedApplicants: VolunteerApplicantThumb[];
	filteredApplicants: VolunteerApplicantThumb[];
	searchQuery: string;
	isLoading: boolean;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
	loadMoreRef: React.RefObject<HTMLDivElement>;
	getAgeColor: (age: number) => string;
	formatApplicationDate: (date: string) => string;
}

export const ApprovedApplicantsList = ({
	approvedApplicants,
	filteredApplicants,
	searchQuery,
	isLoading,
	hasNextPage,
	isFetchingNextPage,
	onSearchChange,
	onClearSearch,
	loadMoreRef,
	getAgeColor,
	formatApplicationDate,
}: ApprovedApplicantsListProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="space-y-4"
		>
			<SearchBar
				searchQuery={searchQuery}
				onSearchChange={onSearchChange}
				onClearSearch={onClearSearch}
			/>

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
							<Users size={16} className="text-indigo-600" />
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
							<strong>{filteredApplicants.length}명</strong>
						</span>
					</div>
				)}
			</motion.div>

			{isLoading ? (
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
			) : filteredApplicants.length === 0 ? (
				<motion.div
					className="flex flex-col items-center justify-center bg-white rounded-lg p-6 shadow-sm text-gray-500"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
				>
					{searchQuery ? (
						<>
							<Search size={32} className="text-gray-300 mb-2" />
							<p className="font-medium mb-1">
								검색 결과가 없습니다
							</p>
							<p className="text-sm text-gray-400">
								다른 검색어로 시도해보세요
							</p>
						</>
					) : (
						<>
							<Users size={32} className="text-gray-300 mb-2" />
							<p className="font-medium">
								승인된 신청자가 없습니다
							</p>
						</>
					)}
				</motion.div>
			) : (
				<>
					<div className="grid gap-4">
						{filteredApplicants.map((applicant, index) => (
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
												src={applicant.profileImage}
												alt={applicant.name || "신청자"}
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
													{applicant.age > 0 && (
														<span
															className={`px-1.5 py-0.5 rounded text-xs font-medium ${getAgeColor(
																applicant.age,
															)}`}
														>
															{applicant.age}세
														</span>
													)}
													{applicant.grade && (
														<span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
															{applicant.grade}
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
														{applicant.email}
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
														{applicant.phone}
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
											new Date(applicant.createdAt),
											"yyyy.MM.dd",
										)}
									</span>
									<span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
										<CheckCircle2 size={12} />
										승인됨
									</span>
								</div>
							</motion.div>
						))}
					</div>

					{/* 무한 스크롤 로딩 지점 */}
					{hasNextPage && (
						<div
							ref={loadMoreRef}
							className="py-4 flex justify-center"
						>
							{isFetchingNextPage ? (
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
	);
};
