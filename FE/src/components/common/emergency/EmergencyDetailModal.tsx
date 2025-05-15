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

interface EmergencyDetailModalProps {
	data: EmergencyPost;
	open: boolean;
	onClose: () => void;
}

export default function EmergencyDetailModal({
	data,
	open,
	onClose,
}: EmergencyDetailModalProps) {
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
				</div>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
}
