import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deleteEmergencyApplicationAPI,
	manageEmergencyApplicationAPI,
	fetchAllEmergencyApplicationsAPI,
	type AllEmergencyApplicationResponse,
} from "@/api/emergency";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface EmergencyApplicationListProps {
	centerId: number;
	onCountChange?: (count: number) => void;
}

export default function EmergencyApplicationList({
	centerId,
	onCountChange,
}: EmergencyApplicationListProps) {
	const queryClient = useQueryClient();

	const { data: applications = [], isLoading } = useQuery<
		AllEmergencyApplicationResponse[]
	>({
		queryKey: ["emergency-applications", centerId],
		queryFn: () => fetchAllEmergencyApplicationsAPI(centerId),
		enabled: !!centerId,
		refetchOnMount: true,
		staleTime: 0,
	});

	// Update count whenever applications change
	useEffect(() => {
		onCountChange?.(applications.length);
	}, [applications, onCountChange]);

	const { mutate: approveApplication, isPending: isApproving } = useMutation({
		mutationFn: (applicationId: number) =>
			manageEmergencyApplicationAPI(applicationId, "APPROVE", centerId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["emergency-applications", centerId],
			});
			toast.success("신청이 승인되었습니다.");
		},
		onError: () => {
			toast.error("신청 승인 중 오류가 발생했습니다.");
		},
	});

	const { mutate: rejectApplication, isPending: isRejecting } = useMutation({
		mutationFn: (applicationId: number) =>
			deleteEmergencyApplicationAPI(applicationId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["emergency-applications", centerId],
			});
			toast.success("신청이 거절되었습니다.");
		},
		onError: () => {
			toast.error("신청 거절 중 오류가 발생했습니다.");
		},
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
				<span className="ml-2 text-gray-600">불러오는 중...</span>
			</div>
		);
	}

	if (applications.length === 0) {
		return (
			<div className="text-center text-gray-500 py-8">
				대기 중인 신청이 없습니다.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{applications.map((application) => (
				<div
					key={application.emergencyApplicationId}
					className="bg-white rounded-lg p-4 shadow-sm"
				>
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
								{application.memberImage ? (
									<img
										src={application.memberImage}
										alt={application.memberName}
										className="w-full h-full object-cover"
									/>
								) : (
									<span className="text-gray-500">
										{application.memberName[0]}
									</span>
								)}
							</div>
							<div>
								<div className="font-medium text-gray-900">
									{application.memberName}
								</div>
								<div className="text-sm text-gray-500">
									{application.phone}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() =>
									approveApplication(
										application.emergencyApplicationId,
									)
								}
								disabled={isApproving || isRejecting}
								className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isApproving ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Check className="w-4 h-4" />
								)}
								<span className="text-sm font-medium">
									수락
								</span>
							</button>
							<button
								type="button"
								onClick={() =>
									rejectApplication(
										application.emergencyApplicationId,
									)
								}
								disabled={isApproving || isRejecting}
								className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isRejecting ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<X className="w-4 h-4" />
								)}
								<span className="text-sm font-medium">
									거절
								</span>
							</button>
						</div>
					</div>
					<div className="text-sm text-gray-600">
						<div className="font-medium text-gray-900 mb-1">
							{application.emergencyName}
						</div>
						<div className="text-xs text-gray-500">
							신청일:{" "}
							{new Date(
								application.createdAt,
							).toLocaleDateString()}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
