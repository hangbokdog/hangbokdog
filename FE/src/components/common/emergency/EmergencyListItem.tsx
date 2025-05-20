import { useState } from "react";
import {
	ChevronUp,
	ChevronDown,
	Loader2,
	AlertCircle,
	Check,
	X,
	Trash2,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
	fetchEmergencyApplicationsAPI,
	manageEmergencyApplicationAPI,
	deleteEmergencyApplicationAPI,
	deleteEmergencyAPI,
} from "@/api/emergency";
import useCenterStore from "@/lib/store/centerStore";
import { EmergencyType } from "@/types/emergencyRegister";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface EmergencyListItemProps {
	emergencyId: number;
	title: string;
	name: string;
	img?: string;
	type: EmergencyType;
	date: React.ReactNode;
	target?: number;
	current?: number;
	index: number;
	content: string;
	onClick: (emergencyId: number) => void;
	expanded: boolean;
	onExpand: (emergencyId: number) => void;
}

export default function EmergencyListItem({
	emergencyId,
	title,
	type,
	date,
	target,
	current,
	index,
	content,
	expanded,
	onExpand,
}: EmergencyListItemProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const { selectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	const {
		data: applications = [],
		isLoading: isLoadingApplications,
		isError: isApplicationsError,
		refetch: refetchApplications,
	} = useQuery({
		queryKey: ["emergency-applications", emergencyId],
		queryFn: () =>
			fetchEmergencyApplicationsAPI(
				emergencyId,
				Number(selectedCenter?.centerId),
			),
		enabled: expanded && !!selectedCenter?.centerId,
	});

	const { mutate: approveApplication, isPending: isApproving } = useMutation({
		mutationFn: (applicationId: number) =>
			manageEmergencyApplicationAPI(
				applicationId,
				"APPROVED",
				Number(selectedCenter?.centerId),
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["emergency-applications", emergencyId],
			});
		},
	});

	const { mutate: rejectApplication, isPending: isRejecting } = useMutation({
		mutationFn: (applicationId: number) =>
			deleteEmergencyApplicationAPI(applicationId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["emergency-applications", emergencyId],
			});
		},
	});

	const { mutate: deleteEmergency, isPending: isDeleting } = useMutation({
		mutationFn: () =>
			deleteEmergencyAPI(emergencyId, Number(selectedCenter?.centerId)),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["emergency-posts"],
			});
			toast.success("긴급 상황이 삭제되었습니다.");
			setShowDeleteDialog(false);
			onExpand(emergencyId);
		},
		onError: () => {
			toast.error("긴급 상황 삭제 중 오류가 발생했습니다.");
		},
	});

	const handleApplicationAction = (
		applicationId: number,
		action: "approve" | "reject",
	) => {
		if (action === "approve") {
			approveApplication(applicationId);
		} else {
			rejectApplication(applicationId);
		}
	};

	const toggleExpand = () => {
		onExpand(emergencyId);
		if (!expanded) {
			refetchApplications();
		}
	};

	const renderProgress = () => {
		if (type === EmergencyType.VOLUNTEER && target) {
			return <div className="flex-1 text-center">{target} 명</div>;
		}
		return null;
	};

	return (
		<>
			<div className="m-1.5 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
				<button
					type="button"
					className={`w-full text-left flex items-center justify-between rounded-lg px-5 py-3 ${
						index % 2 === 1 ? "bg-background" : ""
					} text-grayText text-base font-medium`}
					onClick={toggleExpand}
				>
					<div className="flex-1 truncate">{title}</div>
					{renderProgress()}
					<div className="flex items-center gap-2">
						<div className="w-16 text-right font-light text-[var(--color-blueGray)]">
							{date}
						</div>
						{expanded ? (
							<ChevronUp className="w-5 h-5 text-gray-400" />
						) : (
							<ChevronDown className="w-5 h-5 text-gray-400" />
						)}
					</div>
				</button>

				{expanded && (
					<div className="pt-2 px-4 pb-4 border-t border-gray-100 animate-fadeIn">
						<div className="flex items-center justify-between mb-4">
							<h4 className="text-sm font-medium text-gray-700 bg-superLightBlueGray px-2 py-1 rounded-full">
								상세 내용
							</h4>
							<button
								type="button"
								className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={() => setShowDeleteDialog(true)}
								disabled={isDeleting}
							>
								{isDeleting && (
									<Loader2 className="w-4 h-4 animate-spin" />
								)}
								<span className="text-sm font-medium">
									삭제
								</span>
							</button>
						</div>
						<div className="p-1 mb-4 min-h-[150px] border-b-1">
							<p className="text-sm text-gray-700 whitespace-pre-wrap">
								{content}
							</p>
						</div>

						<h4 className="text-sm font-medium text-gray-700 bg-superLightBlueGray px-2 py-1 rounded-full mb-2">
							신청자 목록
						</h4>
						<div className="space-y-2">
							{isLoadingApplications ? (
								<div className="flex items-center justify-center py-4">
									<Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
									<span className="ml-2 text-sm text-gray-500">
										로딩 중...
									</span>
								</div>
							) : isApplicationsError ? (
								<div className="flex flex-col items-center py-4 text-center">
									<AlertCircle className="w-5 h-5 text-red-500 mb-1" />
									<p className="text-gray-700 text-sm">
										신청자 정보를 불러올 수 없습니다
									</p>
									<button
										type="button"
										className="mt-2 text-xs text-blue-600 font-medium"
										onClick={() => refetchApplications()}
									>
										다시 시도
									</button>
								</div>
							) : applications.length === 0 ? (
								<p className="text-center py-4 text-gray-400 text-sm">
									신청자가 없습니다
								</p>
							) : (
								applications.map((application) => (
									<div
										key={application.emergencyApplicationId}
										className="bg-gray-50 rounded-lg p-3"
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center">
												<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-2">
													{application.memberImage ? (
														<img
															src={
																application.memberImage
															}
															alt={
																application.memberName
															}
															className="w-full h-full object-cover"
														/>
													) : (
														<span className="text-gray-500">
															{
																application
																	.memberName[0]
															}
														</span>
													)}
												</div>
												<div>
													<p className="font-medium text-sm">
														{application.memberName}
													</p>
													<p className="text-xs text-gray-500">
														{application.phone}
													</p>
												</div>
											</div>
											<div className="flex gap-2">
												<button
													type="button"
													className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													onClick={() =>
														handleApplicationAction(
															application.emergencyApplicationId,
															"approve",
														)
													}
													title="신청 수락"
													disabled={
														isApproving ||
														isRejecting
													}
												>
													{isApproving ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<Check className="w-4 h-4" />
													)}
												</button>
												<button
													type="button"
													className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													onClick={() =>
														handleApplicationAction(
															application.emergencyApplicationId,
															"reject",
														)
													}
													title="신청 거절"
													disabled={
														isApproving ||
														isRejecting
													}
												>
													{isRejecting ? (
														<Loader2 className="w-4 h-4 animate-spin" />
													) : (
														<X className="w-4 h-4" />
													)}
												</button>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				)}
			</div>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>긴급 상황 삭제</DialogTitle>
						<DialogDescription>
							정말로 이 긴급 상황을 삭제하시겠습니까?
							<br />
							삭제된 긴급 상황은 복구할 수 없습니다.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<button
							type="button"
							className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
							onClick={() => setShowDeleteDialog(false)}
						>
							취소
						</button>
						<button
							type="button"
							className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => deleteEmergency()}
							disabled={isDeleting}
						>
							{isDeleting ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								"삭제"
							)}
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
