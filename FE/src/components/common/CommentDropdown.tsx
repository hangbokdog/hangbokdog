import { BsThreeDots } from "react-icons/bs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function CommentDropdown() {
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
				<DropdownMenuItem className="justify-center">
					신고
				</DropdownMenuItem>
				<DropdownMenuItem className="justify-center">
					삭제
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
