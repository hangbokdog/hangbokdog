import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FloatingNotificationIcon from "../notification/FloatingNotificationIcon";

interface RouteBackHeaderProps {
	title?: string;
	sub?: string;
	bgColor?: string;
}

export default function RouteBackHeader({
	title,
	sub,
	bgColor,
}: RouteBackHeaderProps) {
	const navigate = useNavigate();

	return (
		<header
			className={`w-full relative h-12 text-grayText flex justify-center items-center gap-1 px-5 ${bgColor && bgColor}`}
		>
			<button
				type="button"
				onClick={() => navigate(-1)}
				className="cursor-pointer absolute left-2.5"
			>
				<MdArrowBackIos size={24} />
			</button>
			{title && (
				<span className="text-lg font-bold leading-6">{title}</span>
			)}
			{sub && (
				<span className="text-sm font-medium text-blueGray">{sub}</span>
			)}
			{/* <div className="absolute right-2.5">
				<FloatingNotificationIcon isHeader={true} />
			</div> */}
		</header>
	);
}
