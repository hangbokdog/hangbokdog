import { useNavigate } from "react-router-dom";
import { BuildingIcon, UserPlus, UserMinus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelJoinRequestAPI, registerCenterAPI } from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";
import { useState } from "react";

export default function CenterJoinPrompt() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { selectedCenter, setSelectedCenter } = useCenterStore();
	const [isProcessing, setIsProcessing] = useState(false);
	const isApplied = selectedCenter?.status === "APPLIED";

	const { mutate: registerCenter } = useMutation({
		mutationFn: () => registerCenterAPI(selectedCenter?.centerId as string),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			setSelectedCenter({
				centerId: selectedCenter?.centerId as string,
				centerName: selectedCenter?.centerName as string,
				status: "APPLIED",
				centerJoinRequestId: data.centerJoinRequestId,
			});
			toast.success("가입 신청이 완료되었습니다.");
			setIsProcessing(false);
		},
		onError: () => {
			toast.error("가입 신청에 실패했습니다.");
			setIsProcessing(false);
		},
	});

	const { mutate: cancelJoinRequest } = useMutation({
		mutationFn: () =>
			cancelJoinRequestAPI(selectedCenter?.centerJoinRequestId as string),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			setSelectedCenter({
				centerId: selectedCenter?.centerId as string,
				centerName: selectedCenter?.centerName as string,
				status: "NONE",
				centerJoinRequestId: "",
			});
			toast.success("가입 신청이 취소되었습니다.");
			setIsProcessing(false);
		},
		onError: () => {
			toast.error("가입 신청 취소에 실패했습니다.");
			setIsProcessing(false);
		},
	});

	const handleJoinOrCancel = () => {
		if (!selectedCenter?.centerId) {
			navigate("/center");
			return;
		}
		queryClient.invalidateQueries({
			queryKey: ["centerJoinRequests"],
		});
		setIsProcessing(true);

		if (isApplied) {
			cancelJoinRequest();
		} else {
			registerCenter();
		}
	};

	return (
		<div className="mx-2.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-custom-sm overflow-hidden">
			<div className="p-4">
				<div className="flex items-center mb-2">
					<div
						className={`${isApplied ? "bg-red-500" : "bg-amber-500"} p-1.5 rounded-md mr-2`}
					>
						<BuildingIcon className="w-4 h-4 text-white" />
					</div>
					<h3 className="text-lg font-bold text-gray-800">
						{isApplied
							? "센터 가입 신청 완료"
							: "센터에 가입하세요"}
					</h3>
				</div>

				<p className="text-sm text-gray-600 mb-3">
					{isApplied
						? `${selectedCenter?.centerName}에 가입 신청을 완료했습니다. 센터 관리자의 승인을 기다려 주세요.`
						: "센터에 가입하여 더 많은 기능과 정보를 이용해 보세요. 가까운 센터를 찾아 봉사활동 참여와 입양 정보를 확인할 수 있습니다."}
				</p>

				<button
					type="button"
					onClick={handleJoinOrCancel}
					disabled={isProcessing}
					className={`flex items-center justify-center w-full py-2.5 px-4 rounded-full transition-all duration-200 shadow-sm ${
						isApplied
							? "bg-white border border-red-300 text-red-500 hover:bg-red-50"
							: "bg-amber-500 text-white hover:bg-amber-600"
					}`}
				>
					{isApplied ? (
						<UserMinus className="w-4 h-4 mr-1.5" />
					) : (
						<UserPlus className="w-4 h-4 mr-1.5" />
					)}
					<span className="font-medium">
						{!selectedCenter?.centerId
							? "센터 찾아보기"
							: isProcessing
								? "처리 중..."
								: isApplied
									? "신청 취소하기"
									: "센터 가입하기"}
					</span>
				</button>
			</div>

			<div
				className={`flex justify-between items-center px-4 py-2 ${isApplied ? "bg-red-100/50" : "bg-amber-100/50"}`}
			>
				<p
					className={`text-xs ${isApplied ? "text-red-700" : "text-amber-700"}`}
				>
					{isApplied
						? "가입 승인 후 더 많은 기능을 이용할 수 있어요"
						: "보호소 봉사와 입양을 위해 필요해요"}
				</p>
				<div className="flex items-center">
					<div
						className={`w-1.5 h-1.5 rounded-full mr-1 ${isApplied ? "bg-red-300" : "bg-amber-300"}`}
					/>
					<div
						className={`w-1.5 h-1.5 rounded-full mr-1 ${isApplied ? "bg-red-400" : "bg-amber-400"}`}
					/>
					<div
						className={`w-1.5 h-1.5 rounded-full ${isApplied ? "bg-red-500" : "bg-amber-500"}`}
					/>
				</div>
			</div>
		</div>
	);
}
