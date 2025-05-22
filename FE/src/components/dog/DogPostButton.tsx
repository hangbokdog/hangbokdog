import { useNavigate } from "react-router-dom";
import { IoMdDocument } from "react-icons/io";

interface DogPostButtonProps {
	dogId: number;
}

export default function DogPostButton({ dogId }: DogPostButtonProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/dogs/${dogId}/posts`);
	};

	return (
		<div className="flex gap-2">
			<button
				type="button"
				onClick={handleClick}
				className="flex items-center gap-1 px-2.5 py-0.5 font-semibold text-white bg-primary rounded-full"
			>
				게시글 <IoMdDocument className="w-4 h-4" />
			</button>
		</div>
	);
}
