import { BsThreeDots } from "react-icons/bs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
	const [isEditOpen, setIsEditOpen] = useState(false);

	const updateMutation = useMutation({
		mutationFn: (newContent: string) =>
			updateDogCommentAPI(Number(dogId), commentId, newContent),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dogComments", dogId] });
			toast.success("댓글이 수정되었습니다.");
			setIsEditOpen(false);
		},
		onError: () => {
			toast.error("댓글 수정에 실패했습니다.");
		},
	});
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="p-1 text-gray-600 hover:text-gray-800 dark:hover:text-gray-200 bg-white dark:bg-gray-800"
				>
					<BsThreeDots className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" side="bottom">
					<DropdownMenuItem
						className="justify-center"
						onClick={() => setIsEditOpen(true)}
					>
						수정
				</DropdownMenuItem>
				<DropdownMenuItem className="justify-center">
					삭제
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
