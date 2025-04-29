import { MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router-dom";

export interface NavigatePanelProps {
	title: string;
	navigation: string;
}

export default function NavigatePanel(props: NavigatePanelProps) {
	const { title, navigation } = props;

	return (
		<div className="flex justify-between items-center py-2 px-4 font-semibold shadow-custom-sm text-grayText bg-white rounded-lg">
			<div>{title}</div>
			<Link
				to={navigation}
				className="flex font-light text-sm text-superLightGray items-center gap-1 hover:text-blueGray"
			>
				상세보기
				<MdArrowForwardIos />
			</Link>
		</div>
	);
}
