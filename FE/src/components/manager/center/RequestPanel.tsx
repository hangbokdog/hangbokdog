import {
	type CenterJoinRequestResponse,
	fetchCenterJoinRequestAPI,
	approveCenterJoinRequestAPI,
	rejectCenterJoinRequestAPI,
} from "@/api/center";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { toast } from "sonner";
import ActionSheetModal from "./ActionSheetModal";

export default function RequestPanel() {
	const { selectedCenter } = useCenterStore();
	const [pageToken, setPageToken] = useState<string>();
	const [actionRequest, setActionRequest] =
		useState<CenterJoinRequestResponse | null>(null);
	const [showActionSheet, setShowActionSheet] = useState(false);

	const queryClient = useQueryClient();

	const {
		data,
		isLoading: isQueryLoading,
		isError,
	} = useQuery({
		queryKey: ["centerJoinRequest", selectedCenter?.centerId, pageToken],
		queryFn: () =>
			fetchCenterJoinRequestAPI(
				selectedCenter?.centerId as string,
				pageToken,
			),
		enabled: !!selectedCenter?.centerId,
	});

	const approveMutation = useMutation({
		mutationFn: (centerJoinRequestId: string) =>
			approveCenterJoinRequestAPI(centerJoinRequestId),
		onSuccess: () => {
			if (actionRequest) {
				toast.success(
					`${actionRequest.name}님의 가입 요청이 승인되었습니다.`,
				);
			}

			queryClient.invalidateQueries({
				queryKey: ["centerJoinRequest", selectedCenter?.centerId],
			});

			setShowActionSheet(false);
			setActionRequest(null);
		},
		onError: () => {
			toast.error("가입 승인에 실패했습니다. 다시 시도해주세요.");
		},
	});

	const rejectMutation = useMutation({
		mutationFn: (centerJoinRequestId: string) =>
			rejectCenterJoinRequestAPI(centerJoinRequestId),
		onSuccess: () => {
			if (actionRequest) {
				toast.success(
					`${actionRequest.name}님의 가입 요청이 거절되었습니다.`,
				);
			}

			queryClient.invalidateQueries({
				queryKey: ["centerJoinRequest", selectedCenter?.centerId],
			});

			setShowActionSheet(false);
			setActionRequest(null);
		},
		onError: () => {
			toast.error("가입 거절에 실패했습니다. 다시 시도해주세요.");
		},
	});

	const handleAction = (req: CenterJoinRequestResponse) => {
		setActionRequest(req);
		setShowActionSheet(true);
	};

	const handleAccept = () => {
		if (!actionRequest) return;
		approveMutation.mutate(actionRequest.centerJoinRequestId);
	};

	const handleReject = () => {
		if (!actionRequest) return;
		rejectMutation.mutate(actionRequest.centerJoinRequestId);
	};

	const handleClose = () => {
		setShowActionSheet(false);
		setActionRequest(null);
	};

	return (
		<div className="flex flex-col bg-white rounded-lg shadow-custom-sm p-4 text-grayText font-semibold gap-2 relative">
			<div className="text-lg font-bold">센터 가입 요청</div>
			{isQueryLoading && (
				<p className="text-sm text-gray-400">불러오는 중...</p>
			)}
			{isError && <p className="text-sm text-red-500">불러오기 실패</p>}

			{data?.data.length === 0 && (
				<p className="text-sm text-center py-4 text-gray-400">
					가입 요청이 없습니다.
				</p>
			)}

			<ul className="mt-2 flex flex-col gap-2">
				{data?.data.map(
					(req: CenterJoinRequestResponse, index: number) => (
						<li
							key={req.centerJoinRequestId}
							className={`flex gap-2 items-center text-sm p-2 ${index % 2 === 0 && "bg-superLightBlueGray"} rounded-full`}
						>
							<div className="flex justify-between items-center w-full">
								<div className="flex items-center gap-2">
									<Avatar className="w-8 h-8 flex justify-center items-center rounded-full">
										<AvatarImage src={req.profileImage} />
										<AvatarFallback className="text-center bg-superLightGray text-grayText">
											{req.name}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm font-medium">
										{req.name}
									</span>
								</div>
								<button
									type="button"
									className="text-sm p-2 rounded-full hover:bg-gray-100"
									onClick={() => handleAction(req)}
									aria-label="메뉴"
								>
									<FiMoreVertical className="text-grayText" />
								</button>
							</div>
						</li>
					),
				)}
			</ul>

			{data?.pageToken && (
				<button
					type="button"
					className="mt-2 self-end text-sm text-blue-500"
					onClick={() => setPageToken(data.pageToken || "")}
				>
					다음 페이지 →
				</button>
			)}

			{showActionSheet && (
				<ActionSheetModal
					actionRequest={actionRequest}
					onClose={handleClose}
					onAccept={handleAccept}
					onReject={handleReject}
					approveMutation={approveMutation}
					rejectMutation={rejectMutation}
				/>
			)}
		</div>
	);
}
