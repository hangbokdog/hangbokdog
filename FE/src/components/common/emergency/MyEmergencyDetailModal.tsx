import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogClose,
	DialogTitle,
} from "@/components/ui/dialog";
import type { AllEmergencyApplicationResponse } from "@/api/emergency";

interface MyEmergencyDetailModalProps {
	data: AllEmergencyApplicationResponse;
	open: boolean;
	onClose: () => void;
}

export default function MyEmergencyDetailModal({
	data,
	open,
	onClose,
}: MyEmergencyDetailModalProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogTitle>긴급 요청 상세</DialogTitle>
				<DialogDescription>
					긴급 요청 상세 정보를 확인할 수 있습니다.
				</DialogDescription>
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Avatar className="w-8 h-8">
							<AvatarImage
								src={data.memberImage}
								className="object-cover"
							/>
							<AvatarFallback>
								{data.memberName?.[0] ?? "?"}
							</AvatarFallback>
						</Avatar>
						<div className="font-bold text-lg flex items-center gap-1">
							{data.memberName}
						</div>
					</div>

					<div className="text-base font-semibold text-center">
						{data.emergencyName}
					</div>

					<div className="text-sm text-gray-600 text-center">
						신청 상태:{" "}
						<span className="font-semibold">
							{data.status === "APPROVED"
								? "승인됨"
								: data.status === "REJECTED"
									? "거절됨"
									: "대기중"}
						</span>
					</div>

					<div className="text-sm font-light text-end text-gray-400 border-t mt-2 pt-2">
						신청일: {new Date(data.createdAt).toLocaleDateString()}
					</div>
				</div>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
}
