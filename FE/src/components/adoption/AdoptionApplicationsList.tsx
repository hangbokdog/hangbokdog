import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
	Loader2,
	ChevronDown,
	ChevronUp,
	AlertCircle,
	Check,
	X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useCenterStore from "@/lib/store/centerStore";
import {
	fetchAdoptionApplicationsAPI,
	fetchAdoptionApplicationsByDogAPI,
	manageAdoptionApplicationAPI,
} from "@/api/adoption";
import type { AdoptionStatus } from "@/types/adoption";

interface AdoptionApplicationsListProps {
	searchQuery: string;
}

export default function AdoptionApplicationsList({
	searchQuery,
}: AdoptionApplicationsListProps) {
	const { selectedCenter } = useCenterStore();
	const [expandedDogId, setExpandedDogId] = useState<number | null>(null);
	const queryClient = useQueryClient();

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
		enabled: !!selectedCenter?.centerId,
	});

	const {
		data: applicantListByDog,
		isLoading: isApplicantLoading,
		isError: isApplicantsError,
		refetch: refetchApplicantListByDog,
	} = useQuery({
		queryKey: ["adoptionApplicantsByDog", expandedDogId, searchQuery],
		queryFn: () =>
			fetchAdoptionApplicationsByDogAPI(
				expandedDogId || -1,
				Number(selectedCenter?.centerId),
				searchQuery,
			),
		enabled: !!selectedCenter?.centerId && !!expandedDogId,
	});

	const { mutate: manageAdoption, isPending: isManagingAdoption } =
		useMutation({
			mutationFn: (data: {
				adoptionId: number;
				request: AdoptionStatus;
				centerId: number;
			}) =>
				manageAdoptionApplicationAPI(
					data.adoptionId,
					data.request,
					data.centerId,
				),
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: [
						"adoptionApplications",
						selectedCenter?.centerId,
					],
				});

				if (expandedDogId) {
					queryClient.invalidateQueries({
						queryKey: ["adoptionApplicantsByDog", expandedDogId],
					});
				}
			},
			onError: (error) => {
				console.error("입양 신청 처리 중 오류 발생:", error);
				alert("처리 중 오류가 발생했습니다.");
			},
		});

	// 강아지 카드 확장/축소 토글
	const toggleDog = (id: number) => {
		if (expandedDogId === id) {
			setExpandedDogId(null);
		} else {
			setExpandedDogId(id);
		}
	};

	// 입양 신청 수락/거절 처리 함수
	const handleAdoptionAction = (
		adoptionId: number,
		action: AdoptionStatus,
	) => {
		if (!selectedCenter?.centerId) return;

		manageAdoption({
			adoptionId: adoptionId,
			request: action,
			centerId: Number(selectedCenter.centerId),
		});
	};

	if (isLoading) {
		return (
			<div className="py-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
				<Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
				<p className="text-gray-500">데이터를 불러오는 중입니다...</p>
			</div>
		);
	}

	if (isApplicationsError) {
		return (
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
		);
	}

	if (!adoptionApplications || adoptionApplications.length === 0) {
		return (
			<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
				입양 신청 내역이 없습니다
			</p>
		);
	}

	return (
		<div className="space-y-3">
			{adoptionApplications.map((dog) => (
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
														parseISO(dog.createdAt),
														"MM월 dd일",
														{
															locale: ko,
														},
													)
												: "-"}
										</p>
									</div>

									<div className="flex items-center">
										<div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
											신청 {dog.count}건
										</div>
										{expandedDogId === dog.dogId ? (
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
											신청자 정보를 불러올 수 없습니다
										</p>
										<button
											type="button"
											className="mt-2 text-xs text-blue-600 font-medium"
											onClick={() => {
												refetchApplicantListByDog();
											}}
										>
											다시 시도
										</button>
									</div>
								) : !applicantListByDog ||
									applicantListByDog.length === 0 ? (
									<p className="text-center py-4 text-gray-400 text-sm">
										신청자가 없습니다
									</p>
								) : (
									applicantListByDog.map((applicant, i) => (
										<div
											key={`${applicant.memberId}-${i}`}
											className="bg-gray-50 rounded-lg p-3"
										>
											<div className="flex flex-col w-full">
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<img
															src={
																applicant.profileImage
															}
															alt={applicant.name}
															className="w-8 h-8 rounded-full mr-2"
														/>
														<div>
															<div className="flex items-center gap-2">
																<div>
																	<p className="font-medium text-sm">
																		{
																			applicant.name
																		}
																	</p>
																	<p className="text-xs text-gray-500">
																		{
																			applicant.createdAt.split(
																				"T",
																			)[0]
																		}
																	</p>
																</div>
																<p className="text-xs text-gray-500">
																	{
																		applicant.phoneNumber
																	}
																</p>
															</div>
														</div>
													</div>
													<div className="flex gap-2">
														<button
															type="button"
															className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
															onClick={() =>
																handleAdoptionAction(
																	applicant.adoptionId,
																	"ACCEPTED",
																)
															}
															title="입양 신청 수락"
															disabled={
																isManagingAdoption
															}
														>
															{isManagingAdoption ? (
																<Loader2 className="w-4 h-4 animate-spin" />
															) : (
																<Check className="w-4 h-4" />
															)}
														</button>
														<button
															type="button"
															className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
															onClick={() =>
																handleAdoptionAction(
																	applicant.adoptionId,
																	"REJECTED",
																)
															}
															title="입양 신청 거절"
															disabled={
																isManagingAdoption
															}
														>
															{isManagingAdoption ? (
																<Loader2 className="w-4 h-4 animate-spin" />
															) : (
																<X className="w-4 h-4" />
															)}
														</button>
													</div>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
