import { BsThreeDots } from "react-icons/bs";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface CommentDropdownProps {
	commentId: number;
	content: string;
	onUpdate: (commentId: number, content: string) => void;
	onDelete: (commentId: number) => void;
}

export default function CommentDropdown({
	commentId,
	content,
	onUpdate,
	onDelete,
}: CommentDropdownProps) {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editValue, setEditValue] = useState(content);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const handleUpdateComment = () => {
		if (!editValue.trim()) {
			toast.error("내용을 입력해주세요.");
			return;
		}

		setIsEditOpen(false);
		onUpdate(commentId, editValue);
	};

	const handleDeleteComment = () => {
		onDelete(commentId);
	};

	const handleOpenEditDialog = () => {
		setDropdownOpen(false); // 드롭다운 먼저 닫기
		setTimeout(() => {
			setIsEditOpen(true);
		}, 10);
	};

	const handleOpenDeleteDialog = () => {
		setDropdownOpen(false); // 드롭다운 먼저 닫기
		setTimeout(() => {
			setIsDeleteOpen(true);
		}, 10);
	};

	return (
		<>
			<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<button
						ref={triggerRef}
						type="button"
						className="p-1 text-gray-600 hover:text-gray-800 dark:hover:text-gray-200"
					>
						<BsThreeDots className="size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" side="bottom">
					<DropdownMenuItem
						className="justify-center"
						onClick={handleOpenEditDialog}
					>
						수정
					</DropdownMenuItem>
					<DropdownMenuItem
						className="justify-center"
						onClick={handleOpenDeleteDialog}
					>
						삭제
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);
					if (!open) {
						// 다이얼로그가 닫힐 때 포커스 복원
						setTimeout(() => {
							if (triggerRef.current) {
								triggerRef.current.focus();
							}
						}, 0);
					}
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>댓글 수정</DialogTitle>
						<DialogDescription>
							댓글 내용을 수정하고 수정하기 버튼을 클릭하세요.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<textarea
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							placeholder="댓글을 작성해주세요"
							className="min-h-[100px] w-full border rounded-md p-2"
						/>
					</div>
					<DialogFooter className="sm:justify-end">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								취소
							</Button>
						</DialogClose>
						<Button type="button" onClick={handleUpdateComment}>
							수정하기
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isDeleteOpen}
				onOpenChange={(open) => {
					setIsDeleteOpen(open);
					if (!open) {
						// 다이얼로그가 닫힐 때 포커스 복원
						setTimeout(() => {
							if (triggerRef.current) {
								triggerRef.current.focus();
							}
						}, 0);
					}
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>댓글 삭제</DialogTitle>
						<DialogDescription>
							이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수
							없습니다.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-end">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								취소
							</Button>
						</DialogClose>
						<Button
							type="button"
							variant="destructive"
							onClick={handleDeleteComment}
						>
							삭제하기
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
