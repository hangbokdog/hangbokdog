import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPaw } from "react-icons/fa";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogClose,
	DialogTitle,
} from "@/components/ui/dialog";
import type { EmergencyPost } from "@/types/emergencyRegister";
import useCenterStore from "@/lib/store/centerStore";
import { applyEmergencyAPI } from "@/api/emergency";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface EmergencyDetailModalProps {
	data: EmergencyPost;
	open: boolean;
	onClose: () => void;
	onDelete?: (emergencyId: number) => void;
}

export default function EmergencyDetailModal({
	data,
	open,
	onClose,
	onDelete,
}: EmergencyDetailModalProps) {
	const { selectedCenter } = useCenterStore();

	const { mutate: applyEmergency } = useMutation({
		mutationFn: () =>
			applyEmergencyAPI(
				data.emergencyId,
				Number(selectedCenter?.centerId) || -1,
			),
		onSuccess: () => {
			toast.success("긴급 요청 신청이 완료되었습니다.");
			onClose();
		},
		onError: () => {
			toast.error("긴급 요청 신청에 실패했습니다.");
		},
	});

	const handleDelete = () => {
		if (onDelete) {
			onDelete(data.emergencyId);
			onClose();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogTitle>긴급 요청 상세</DialogTitle>
				<DialogDescription>
					긴급 요청 상세 정보를 확인할 수 있습니다.
				</DialogDescription>
				<div className="flex flex-col gap-4 text-grayText">
					<div className="flex items-center gap-3">
						<Avatar className="w-8 h-8">
							<AvatarImage src={data.memberImage} />
							<AvatarFallback>
								{data.name?.[0] ?? "?"}
							</AvatarFallback>
						</Avatar>
						<div className="font-bold text-lg flex items-center gap-1">
							{data.name} <FaPaw className="text-blue-500" />
						</div>
					</div>

					<div className="text-base font-semibold text-center">
						{data.title}
					</div>

					{data.type === "VOLUNTEER" &&
						data.capacity !== undefined && (
							<div className="text-sm text-gray-600 text-center">
								모집 인원:{" "}
								<span className="font-semibold">
									{data.capacity}명
								</span>
							</div>
						)}

					{data.type === "DONATION" &&
						data.targetAmount !== undefined && (
							<div className="text-sm text-gray-600 text-center">
								목표 금액:{" "}
								<span className="font-semibold">
									{data.targetAmount.toLocaleString()}원
								</span>
							</div>
						)}
					<div className="text-sm text-gray-700 whitespace-pre-wrap">
						{data.content || "내용이 없습니다."}
					</div>
					<div className="text-sm font-light text-end text-gray-400 border-t mt-2 pt-2">
						마감일: {new Date(data.dueDate).toLocaleDateString()}
					</div>
					<button
						type="button"
						className={`w-full rounded-lg text-white py-2 mb-2.5 ${
							onDelete
								? "bg-red-500 hover:bg-red-600"
								: "bg-blue-500 hover:bg-blue-600"
						}`}
						onClick={
							onDelete ? handleDelete : () => applyEmergency()
						}
					>
						{onDelete ? "삭제하기" : "신청하기"}
					</button>
				</div>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
}
