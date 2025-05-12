import type { CenterJoinRequestResponse } from "@/api/center";
import type { UseMutationResult } from "@tanstack/react-query";

interface ActionSheetModalProps {
	actionRequest: CenterJoinRequestResponse | null;
	onClose: () => void;
	onAccept: () => void;
	onReject: () => void;
	approveMutation: UseMutationResult<unknown, Error, string>;
	rejectMutation: UseMutationResult<unknown, Error, string>;
}

export default function ActionSheetModal({
	actionRequest,
	onClose,
	onAccept,
	onReject,
	approveMutation,
	rejectMutation,
}: ActionSheetModalProps) {
	if (!actionRequest) return null;

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
			<div className="bg-white w-full max-w-md rounded-t-xl sm:rounded-xl overflow-hidden">
				<div className="p-4 border-b">
					<p className="text-center font-bold">
						{actionRequest.name}님의 가입 요청
					</p>
				</div>
				<div className="flex flex-col">
					<button
						type="button"
						onClick={onReject}
						disabled={rejectMutation.isPending}
						className="p-4 text-center hover:bg-gray-100 text-red-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{rejectMutation.isPending ? "처리 중..." : "거절하기"}
					</button>
					<div className="h-px bg-gray-200" />
					<button
						type="button"
						onClick={onAccept}
						disabled={approveMutation.isPending}
						className="p-4 text-center hover:bg-gray-100 text-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{approveMutation.isPending ? "처리 중..." : "수락하기"}
					</button>
				</div>
				<div className="p-2 bg-gray-50">
					<button
						type="button"
						onClick={onClose}
						disabled={
							approveMutation.isPending ||
							rejectMutation.isPending
						}
						className="p-3 text-center w-full rounded-xl bg-white hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					>
						취소
					</button>
				</div>
			</div>
		</div>
	);
}
