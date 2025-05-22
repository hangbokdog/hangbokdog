import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useCenterStore from "@/lib/store/centerStore";
import {
	deleteEmergencyAPI,
	fetchRecruitedEmergenciesAPI,
} from "@/api/emergency";
import { ChevronDown, ChevronUp, Trash2, Users } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export default function RecruiteEmergencyList() {
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const queryClient = useQueryClient();
	const { selectedCenter } = useCenterStore();

	const { data: recruitedData = [], isLoading } = useQuery({
		queryKey: ["recruited-emergency-posts", selectedCenter?.centerId],
		queryFn: () =>
			fetchRecruitedEmergenciesAPI(Number(selectedCenter?.centerId)),
		enabled: !!selectedCenter?.centerId,
		refetchOnMount: true,
		staleTime: 0,
	});

	const { mutate: deletePost } = useMutation({
		mutationFn: (emergencyId: number) =>
			deleteEmergencyAPI(emergencyId, Number(selectedCenter?.centerId)),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["recruited-emergency-posts"],
			});
			toast.success("긴급 요청이 삭제되었습니다.");
		},
		onError: () => {
			toast.error("긴급 요청 삭제 중 오류가 발생했습니다.");
		},
	});

	const handleDelete = (emergencyId: number) => {
		deletePost(emergencyId);
	};

	const handleExpand = (emergencyId: number) => {
		setExpandedId(expandedId === emergencyId ? null : emergencyId);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8 text-gray-400">
				불러오는 중...
			</div>
		);
	}

	return (
		<div className="flex flex-col rounded-xl px-2 shadow-custom-sm bg-white w-full py-4">
			{recruitedData.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-gray-400">
					<p className="text-sm">데이터가 없습니다</p>
				</div>
			) : (
				<div className="space-y-3">
					{recruitedData.map((emergency) => (
						<div
							key={emergency.emergencyId}
							className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
						>
							<button
								type="button"
								className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 text-left transition-colors"
								onClick={() =>
									handleExpand(emergency.emergencyId)
								}
							>
								<div className="flex items-center gap-4">
									<div className="flex flex-col">
										<span className="font-semibold text-gray-900">
											긴급 요청 #{emergency.emergencyId}
										</span>
										<div className="flex items-center gap-2 mt-0.5">
											<span className="text-sm text-gray-500">
												신청자{" "}
												{emergency.applicants.length}명
											</span>
											<span className="text-gray-300">
												•
											</span>
											<span className="text-sm text-gray-500">
												{new Date(
													emergency.emergencyDate,
												).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<DdayTag
										dday={calculateDDay(emergency.dueDate)}
									/>
									{expandedId === emergency.emergencyId ? (
										<ChevronUp className="w-5 h-5 text-gray-400" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-400" />
									)}
								</div>
							</button>
							{expandedId === emergency.emergencyId && (
								<div className="border-t border-gray-200 bg-gray-50">
									<div className="p-4">
										<div className="space-y-2">
											{emergency.applicants.map(
												(applicant) => (
													<div
														key={applicant.memberId}
														className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
													>
														<span>
															<Avatar className="w-6 h-6">
																<AvatarImage
																	src={
																		applicant.profileImage
																	}
																	className="object-cover"
																/>
																<AvatarFallback>
																	{
																		applicant.name
																	}
																</AvatarFallback>
															</Avatar>
														</span>
														<div className="flex flex-col">
															<span className="font-medium text-gray-900">
																{
																	applicant.nickName
																}
															</span>
															<span className="text-sm text-gray-500">
																{
																	applicant.phone
																}
															</span>
														</div>
													</div>
												),
											)}
										</div>
										<div className="mt-4 flex justify-end">
											<button
												type="button"
												onClick={() =>
													handleDelete(
														emergency.emergencyId,
													)
												}
												className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												<Trash2 className="w-4 h-4" />
												삭제
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function calculateDDay(dueDate: string): number {
	const today = new Date();
	const due = new Date(dueDate);
	const diff = due.getTime() - today.getTime();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function DdayTag({ dday }: { dday: number }) {
	const label = `D-${dday}`;
	let colorClass = "bg-gray-100 text-gray-600";

	if (dday <= 1) {
		colorClass = "bg-red-100 text-red-600 animate-pulse";
	} else if (dday <= 3) {
		colorClass = "bg-orange-100 text-orange-600";
	} else if (dday <= 7) {
		colorClass = "bg-yellow-100 text-yellow-600";
	}

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}
		>
			{label}
		</span>
	);
}
