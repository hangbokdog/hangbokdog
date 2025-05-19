import { useNavigate } from "react-router-dom";

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
				className="flex px-2.5 py-0.5 font-semibold text-white bg-main rounded-full"
			>
				게시글 보러가기
			</button>
		</div>
	);
}
