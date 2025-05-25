import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useCenterStore from "@/lib/store/centerStore";
import {
	deleteEmergencyAPI,
	type EmergencyApplicant,
	fetchRecruitedEmergenciesAPI,
} from "@/api/emergency";
import { ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { memo } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const ApplicantItem = memo(
	({ applicant }: { applicant: EmergencyApplicant }) => (
		<div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
			<span>
				<Avatar className="w-6 h-6">
					<AvatarImage
						src={applicant.profileImage}
						className="object-cover"
					/>
					<AvatarFallback>{applicant.name}</AvatarFallback>
				</Avatar>
			</span>
			<div className="flex flex-col">
				<span className="font-medium text-gray-900">
					{applicant.nickName}
				</span>
				<span className="text-sm text-gray-500">{applicant.phone}</span>
			</div>
		</div>
	),
);

export default function RecruiteEmergencyList() {
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [emergencyToDelete, setEmergencyToDelete] = useState<number | null>(
		null,
	);
	const queryClient = useQueryClient();
	const { selectedCenter } = useCenterStore();

	const { data: recruitedData = [], isLoading } = useQuery({
		queryKey: ["recruited-emergency-posts", selectedCenter?.centerId],
		queryFn: () =>
			fetchRecruitedEmergenciesAPI(Number(selectedCenter?.centerId)),
		enabled: !!selectedCenter?.centerId,
		refetchOnWindowFocus: true,
	});
	useEffect(() => {
		for (const emergency of recruitedData) {
			for (const applicant of emergency.applicants) {
				const img = new Image();
				img.src = applicant.profileImage;
			}
		}
	}, [recruitedData]);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: (emergencyId: number) =>
			deleteEmergencyAPI(emergencyId, Number(selectedCenter?.centerId)),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["recruited-emergency-posts"],
			});
			toast.success("긴급 요청이 삭제되었습니다.");
			setShowDeleteDialog(false);
			setEmergencyToDelete(null);
		},
		onError: () => {
			toast.error("긴급 요청 삭제 중 오류가 발생했습니다.");
		},
	});

	const handleDelete = (emergencyId: number) => {
		setEmergencyToDelete(emergencyId);
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (emergencyToDelete) {
			deletePost(emergencyToDelete);
		}
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
		<>
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
												{emergency.title}
											</span>
											<div className="flex items-center gap-2 mt-0.5">
												<span className="text-sm text-gray-500">
													신청자{" "}
													{
														emergency.applicants
															.length
													}
													명
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
											dday={calculateDDay(
												emergency.dueDate,
											)}
										/>
										{expandedId ===
										emergency.emergencyId ? (
											<ChevronUp className="w-5 h-5 text-gray-400" />
										) : (
											<ChevronDown className="w-5 h-5 text-gray-400" />
										)}
									</div>
								</button>
								<div
									className={`border-t border-gray-200 bg-white overflow-hidden transition-all duration-300 ${
										expandedId === emergency.emergencyId
											? "max-h-[1000px]"
											: "max-h-0"
									}`}
								>
									<div className="p-4">
										<div className="flex min-h-20 border-b pb-2 mb-2">
											<div className="flex-1 text-base text-grayText border-gray-200">
												{emergency.content}
											</div>
											<div className="flex items-start justify-end">
												<button
													type="button"
													onClick={() =>
														handleDelete(
															emergency.emergencyId,
														)
													}
													className="flex items-center text-sm font-medium text-blueGray hover:bg-red-50 rounded-lg transition-colors"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</div>
										<div className="space-y-2">
											{emergency.applicants.map(
												(applicant) => (
													<ApplicantItem
														key={applicant.memberId}
														applicant={applicant}
													/>
												),
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>긴급 요청 삭제</DialogTitle>
						<DialogDescription>
							정말로 이 긴급 요청을 삭제하시겠습니까?
							<br />
							삭제된 긴급 요청은 복구할 수 없습니다.
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
							onClick={confirmDelete}
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
