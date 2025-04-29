import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Header() {
	const navigate = useNavigate();

	return (
		<header className="w-full h-10 text-grayText flex justify-start items-end px-5">
			<button
				type="button"
				onClick={() => navigate(-1)}
				className="cursor-pointer"
			>
				<MdArrowBackIos size={24} />
			</button>
		</header>
	);
}
