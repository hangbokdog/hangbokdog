import { Link } from "react-router-dom";

interface PanelTitleProps {
	title: string;
	link: string;
}

export default function PanelTitle({ title, link }: PanelTitleProps) {
	return (
		<div className="flex p-2.5 justify-between items-center text-grayText">
			<span className="font-bold text-lg">{title}</span>
			<Link to={link} className="text-xs border-b-1 border-b-grayText">
				더보기
			</Link>
		</div>
	);
}
