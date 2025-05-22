import type { FosteredDogResponse } from "@/api/foster";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Home, Calendar, MoreHorizontal } from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import type { FosterStatus } from "@/types/foster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decideFosterApplicationAPI } from "@/api/foster";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";

interface FosteredListItemProps {
	data: FosteredDogResponse;
}
export default function FosteredListItem({ data }: FosteredListItemProps) {
	const queryClient = useQueryClient();
	const { selectedCenter } = useCenterStore();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { mutate: cancelFoster, isPending: isCanceling } = useMutation({
		mutationFn: () =>
			decideFosterApplicationAPI(
				data.fosterId,
				"COMPLETED" as FosterStatus,
				Number(selectedCenter?.centerId),
			),
		onSuccess: () => {
			setIsDialogOpen(false);
			queryClient.invalidateQueries({
				queryKey: ["fosteredDogs", selectedCenter?.centerId],
			});
			toast.success("임시보호가 종료되었습니다.");
		},
		onError: () => {
			toast.error("임시보호 종료 중 오류가 발생했습니다.");
		},
	});

	const handleCancelFoster = () => {
		cancelFoster();
	};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>임시보호 종료</DialogTitle>
						<DialogDescription>
							{data.dogName}의 임시보호를 종료하시겠습니까?
							<br />이 작업은 되돌릴 수 없습니다.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							취소
						</Button>
						<Button
							variant="destructive"
							onClick={handleCancelFoster}
							disabled={isCanceling}
						>
							{isCanceling ? "종료 중..." : "임시보호 종료"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="bg-white rounded-lg shadow-custom-sm p-4 pt-2 hover:shadow-md transition-shadow relative">
				<div className="flex justify-between items-center text-sm mb-1">
					<span className="flex items-center gap-2 text-grayText">
						<Calendar className="w-3 h-3" />
						<span className="flex items-center">임보 시작일</span>
						{data.created_at.split("T")[0]}
					</span>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="p-1 hover:bg-gray-100 rounded-full transition-colors"
								aria-haspopup="true" // 명시적 역할 지정
							>
								<MoreHorizontal className="w-5 h-5 text-gray-500" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							onCloseAutoFocus={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							<DropdownMenuItem
								onSelect={(e) => {
									e.preventDefault();
									setIsDialogOpen(true);
								}}
								className="text-red-500 focus:text-red-500 focus:bg-red-50"
							>
								임시보호 종료
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="grid grid-cols-3 w-full items-center justify-between">
					<div className="col-span-1 flex items-center gap-3">
						<img
							src={data.dogImage}
							alt={data.dogName}
							className="w-12 h-12 rounded-full object-cover border-2 border-pink-100"
						/>
						<div className="flex flex-col">
							<span className="text-sm font-semibold text-gray-800">
								{data.dogName}
							</span>
						</div>
					</div>

					<div className="col-span-1 flex flex-col items-center justify-center">
						<div className="relative">
							<div className="absolute inset-0 bg-orange-200 rounded-full blur-sm animate-pulse" />
							<Home className="w-7 h-7 text-orange-500 relative z-10" />
						</div>
					</div>

					<div className="col-span-1 flex items-center justify-end gap-3">
						<div className="flex flex-col items-end">
							<span className="text-sm font-semibold text-gray-800">
								{data.memberName}
							</span>
						</div>
						<Avatar className="w-12 h-12 border-2 border-pink-100">
							<AvatarImage
								src={data.memberImage}
								className="object-cover"
							/>
							<AvatarFallback>
								{data.memberName.charAt(0)}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</div>
		</>
	);
}
