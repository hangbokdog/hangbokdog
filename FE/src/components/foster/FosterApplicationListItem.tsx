import { useState } from "react";
import type {
	FosterApplicationByDogResponse,
	FosterApplicationResponse,
} from "@/api/foster";
import {
	ChevronUp,
	ChevronDown,
	Loader2,
	AlertCircle,
	Check,
	X,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
	fetchFosterApplicationsByDogAPI,
	decideFosterApplicationAPI,
	cancelFosterApplicationAPI,
} from "@/api/foster";
import useCenterStore from "@/lib/store/centerStore";
import type { FosterStatus } from "@/types/foster";

export interface FosterApplicationListItemProps {
	data: FosterApplicationResponse;
}

export default function FosterApplicationListItem({
	data,
}: FosterApplicationListItemProps) {
	const [expandedDogId, setExpandedDogId] = useState<number | null>(null);
	const { selectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	const {
		data: applicantListByDog,
		isLoading: isApplicantLoading,
		isError: isApplicantsError,
		refetch: refetchApplicantListByDog,
	} = useQuery({
		queryKey: ["fosterApplicantsByDog", expandedDogId],
		queryFn: () =>
			fetchFosterApplicationsByDogAPI(
				expandedDogId || -1,
				Number(selectedCenter?.centerId),
			),
		enabled: !!selectedCenter?.centerId && !!expandedDogId,
	});

	const { mutate: decideFoster, isPending: isDecidingFoster } = useMutation({
		mutationFn: (data: { fosterId: number; request: FosterStatus }) =>
			decideFosterApplicationAPI(
				data.fosterId,
				data.request,
				Number(selectedCenter?.centerId),
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["fosterApplicantsByDog", expandedDogId],
			});
		},
	});

	const { mutate: cancelFoster, isPending: isCancelingFoster } = useMutation({
		mutationFn: (fosterId: number) => cancelFosterApplicationAPI(fosterId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["fosterApplicantsByDog", expandedDogId],
			});
		},
	});

	const handleFosterAction = (
		fosterId: number,
		action: "approve" | "reject",
	) => {
		if (action === "approve") {
			decideFoster({ fosterId, request: "FOSTERING" });
		} else {
			cancelFoster(fosterId);
		}
	};

	const toggleDog = (id: number) => {
		if (expandedDogId === id) {
			setExpandedDogId(null);
		} else {
			setExpandedDogId(id);
		}
	};

	return (
		<div
			key={data.dogId}
			className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
		>
			<button
				type="button"
				className="p-4 cursor-pointer w-full text-left"
				onClick={() => toggleDog(data.dogId)}
			>
				<div className="flex items-center gap-3">
					<div className="relative">
						<img
							src={
								data.dogImage ||
								"https://api.dicebear.com/7.x/lorelei/svg?seed=default"
							}
							alt={data.dogName}
							className="w-14 h-14 rounded-lg object-cover border border-gray-200"
						/>
					</div>

					<div className="flex-1">
						<div className="flex justify-between items-center">
							<div>
								<h3 className="font-medium text-gray-800">
									{data.dogName}
								</h3>
							</div>

							<div className="flex items-center">
								<div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
									신청 {data.count}건
								</div>
								{expandedDogId === data.dogId ? (
									<ChevronUp className="w-5 h-5 text-gray-400" />
								) : (
									<ChevronDown className="w-5 h-5 text-gray-400" />
								)}
							</div>
						</div>
					</div>
				</div>
			</button>
			{expandedDogId === data.dogId && (
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
													src={applicant.profileImage}
													alt={applicant.name}
													className="w-8 h-8 rounded-full mr-2"
												/>
												<div>
													<div className="flex items-center gap-2">
														<div>
															<p className="font-medium text-sm">
																{applicant.name}
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
														handleFosterAction(
															applicant.adoptionId,
															"approve",
														)
													}
													title="임시보호 신청 수락"
													disabled={
														isDecidingFoster ||
														isCancelingFoster
													}
												>
													{isDecidingFoster ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<Check className="w-4 h-4" />
													)}
												</button>
												<button
													type="button"
													className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													onClick={() =>
														handleFosterAction(
															applicant.adoptionId,
															"reject",
														)
													}
													title="임시보호 신청 거절"
													disabled={
														isDecidingFoster ||
														isCancelingFoster
													}
												>
													{isCancelingFoster ? (
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
	);
}
