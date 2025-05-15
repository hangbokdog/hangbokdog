import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
	Search,
	Home,
	Loader2,
	ChevronDown,
	ChevronUp,
	AlertCircle,
} from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	fetchAdoptionApplicationsAPI,
	fetchAdoptionApplicationsByDogAPI,
} from "@/api/adoption";

export default function AdoptionManagerMainPage() {
	const { selectedCenter } = useCenterStore();
	const [tab, setTab] = useState<"pending" | "adopted">("pending");
	const [expandedDogId, setExpandedDogId] = useState<number | null>(null);
	const [expandedApplicantId, setExpandedApplicantId] = useState<
		number | null
	>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const {
		data: adoptionApplications,
		isLoading,
		refetch,
		isError: isApplicationsError,
		error: applicationsError,
	} = useQuery({
		queryKey: [
			"adoptionApplications",
			selectedCenter?.centerId,
			searchQuery,
		],
		queryFn: () =>
			fetchAdoptionApplicationsAPI(Number(selectedCenter?.centerId)),
		enabled: !!selectedCenter?.centerId && tab === "pending",
	});

	const {
		data: applicantListByDog,
		isLoading: isApplicantLoading,
		isError: isApplicantsError,
	} = useQuery({
		queryKey: ["adoptionApplicantsByDog", expandedDogId],
		queryFn: () =>
			fetchAdoptionApplicationsByDogAPI(
				expandedDogId || -1,
				Number(selectedCenter?.centerId),
				searchQuery,
			),
		enabled:
			!!selectedCenter?.centerId && !!expandedDogId && tab === "pending",
	});

	// 강아지 카드 확장/축소 토글
	const toggleDog = (id: number) => {
		if (expandedDogId === id) {
			setExpandedDogId(null);
		} else {
			setExpandedDogId(id);
			setExpandedApplicantId(null);
		}
	};

	// 신청자 상세정보 확장/축소 토글
	const toggleApplicant = (id: number) => {
		if (expandedApplicantId === id) {
			setExpandedApplicantId(null);
		} else {
			setExpandedApplicantId(id);
		}
	};

	return (
		<div className="flex flex-col h-full bg-gray-50 pb-16">
			{/* 헤더 */}
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="text-xl font-bold text-gray-800 mb-1 flex items-center">
						<Home className="w-5 h-5 mr-2 text-blue-600" />
						입양 관리
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 입양 신청
						내역을 관리하세요
					</p>
				</div>
			</div>

			<div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
				{/* 탭 */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="flex border-b">
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center ${
								tab === "pending"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500"
							}`}
							onClick={() => setTab("pending")}
						>
							대기 중
						</button>
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center ${
								tab === "adopted"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500"
							}`}
							onClick={() => setTab("adopted")}
						>
							입양 중
						</button>
					</div>
				</div>

				{/* 검색 필드 */}
				<div className="relative">
					<input
						type="text"
						className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
						placeholder="강아지 이름으로 검색"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				</div>

				{/* 입양 신청 목록 */}
				<div>
					<h2 className="text-lg font-bold text-gray-800 mb-3">
						{tab === "pending"
							? "입양 신청 목록"
							: "입양 중인 목록"}
					</h2>

					{/* 대기 중 탭 */}
					{tab === "pending" && isLoading ? (
						// 로딩 상태
						<div className="py-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
							<Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
							<p className="text-gray-500">
								데이터를 불러오는 중입니다...
							</p>
						</div>
					) : isApplicationsError ? (
						// 에러 상태
						<div className="py-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
							<AlertCircle className="w-10 h-10 text-red-500 mb-2" />
							<p className="text-gray-700 font-medium">
								데이터를 불러오는 데 실패했습니다
							</p>
							<p className="text-gray-500 text-sm mt-1">
								{applicationsError instanceof Error
									? applicationsError.message
									: "네트워크 연결을 확인하고 다시 시도해주세요"}
							</p>
							<button
								type="button"
								className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
								onClick={() => refetch()}
							>
								새로고침
							</button>
						</div>
					) : adoptionApplications?.length === 0 ? (
						// 빈 상태
						<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
							입양 신청 내역이 없습니다
						</p>
					) : (
						// 입양 신청 목록 (강아지별 그룹화)
						<div className="space-y-3">
							{adoptionApplications?.map((dog) => (
								<div
									key={dog.dogId}
									className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
								>
									<button
										type="button"
										className="p-4 cursor-pointer w-full text-left"
										onClick={() => toggleDog(dog.dogId)}
									>
										<div className="flex items-center gap-3">
											<div className="relative">
												<img
													src={
														dog.dogImage ||
														"https://api.dicebear.com/7.x/lorelei/svg?seed=default"
													}
													alt={dog.dogName}
													className="w-14 h-14 rounded-lg object-cover border border-gray-200"
												/>
											</div>

											<div className="flex-1">
												<div className="flex justify-between items-center">
													<div>
														<h3 className="font-medium text-gray-800">
															{dog.dogName}
														</h3>
														<p className="text-xs text-gray-500 mt-0.5">
															신청일:
															{dog.createdAt
																? format(
																		parseISO(
																			dog.createdAt,
																		),
																		"MM월 dd일",
																		{
																			locale: ko,
																		},
																	)
																: "-"}
															{/* {format(
																parseISO(
																	dog.createdAt,
																),
																"MM월 dd일",
																{
																	locale: ko,
																},
															)} */}
														</p>
													</div>

													<div className="flex items-center">
														<div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
															신청 {dog.count}건
														</div>
														{expandedDogId ===
														dog.dogId ? (
															<ChevronUp className="w-5 h-5 text-gray-400" />
														) : (
															<ChevronDown className="w-5 h-5 text-gray-400" />
														)}
													</div>
												</div>
											</div>
										</div>
									</button>
									{expandedDogId === dog.dogId && (
										<div className="pt-2 px-4 pb-4 border-t border-gray-100 animate-fadeIn">
											<h4 className="text-sm font-medium text-gray-700 mb-2">
												신청자 목록
											</h4>
											<div className="space-y-2">
												{/* 더미 데이터로 신청자 목록 표시 (실제로는 API에서 가져와야 함) */}
												{isApplicantLoading ? (
													<div className="flex items-center justify-center py-4">
														<Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
														<span className="ml-2 text-sm text-gray-500">
															로딩 중...
														</span>
													</div>
												) : isApplicantsError ? (
													<div className="flex flex-col items-center py-4 text-center">
														<AlertCircle className="w-5 h-5 text-red-500 mb-1" />
														<p className="text-gray-700 text-sm">
															신청자 정보를 불러올
															수 없습니다
														</p>
														<button
															type="button"
															className="mt-2 text-xs text-blue-600 font-medium"
															onClick={() => {
																// Refetch the query
																const queryClient =
																	useQueryClient();
																queryClient.invalidateQueries(
																	{
																		queryKey:
																			[
																				"adoptionApplicantsByDog",
																				expandedDogId,
																			],
																	},
																);
															}}
														>
															다시 시도
														</button>
													</div>
												) : applicantListByDog?.length ===
													0 ? (
													<p className="text-center py-4 text-gray-400 text-sm">
														신청자가 없습니다
													</p>
												) : (
													applicantListByDog?.map(
														(applicant) => (
															<div
																key={
																	applicant.memberId
																}
																className="bg-gray-50 rounded-lg p-3"
															>
																<button
																	type="button"
																	className="flex items-center justify-between cursor-pointer w-full text-left"
																	onClick={() =>
																		toggleApplicant(
																			applicant.memberId,
																		)
																	}
																>
																	<div className="flex items-center">
																		<img
																			src={
																				applicant.profileImage
																			}
																			alt={
																				applicant.name
																			}
																			className="w-8 h-8 rounded-full mr-2"
																		/>
																		<div>
																			<div className="flex items-center">
																				<p className="font-medium text-sm">
																					{
																						applicant.name
																					}
																				</p>
																			</div>
																		</div>
																	</div>
																</button>

																{/* 신청자 상세 정보 */}
																{expandedApplicantId ===
																	applicant.memberId && (
																	<div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
																		<div className="grid grid-cols-2 gap-2 text-xs">
																			<div>
																				<p className="text-gray-500">
																					연락처
																				</p>
																				<p className="font-medium">
																					{
																						applicant.phoneNumber
																					}
																				</p>
																			</div>
																		</div>
																	</div>
																)}
															</div>
														),
													)
												)}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* 입양 중 탭 */}
					{/*}
					{tab === "adopted" && (
						<div className="grid grid-cols-2 gap-3">
							{dummyDogs.map((dog) => (
								<div
									key={dog.id}
									className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
								>
									<div className="relative">
										<img
											src={dog.image}
											alt={dog.name}
											className="w-full h-32 object-cover"
										/>
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
											<h3 className="font-medium text-white">
												{dog.name}
											</h3>
										</div>
									</div>
									<div className="p-3">
										<div className="flex items-center justify-between mb-1">
											<span className="text-sm font-medium">
												{dog.breed}
											</span>
											<div
												className={`text-xs px-2 py-0.5 rounded-full ${dog.gender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
											>
												{dog.gender === "male"
													? "남아"
													: "여아"}{" "}
												• {dog.age}
											</div>
										</div>
										<p className="text-xs text-gray-500 line-clamp-2">
											{dog.description}
										</p>
										<button
											type="button"
											className="mt-2 text-xs text-blue-600 font-medium"
										>
											상세 정보
										</button>
									</div>
								</div>
							))}
						</div>
					)} */}
				</div>
			</div>
		</div>
	);
}
