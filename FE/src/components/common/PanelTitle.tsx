import { Link } from "react-router-dom";

interface PanelTitleProps {
	title: string;
	link: string;
	subTitle?: string;
	noLink?: boolean;
}

export default function PanelTitle({
	title,
	link,
	subTitle,
	noLink = false,
}: PanelTitleProps) {
	return (
		<div className="flex p-2.5 justify-between items-center text-grayText">
			<div className="flex items-end gap-2.5 text-lg">
				<span className="font-bold text-lg">{title}</span>
				{subTitle && (
					<span className="text-blue font-semibold">{subTitle}</span>
				)}
			</div>
			{noLink && (
				<Link
					to={link}
					className="text-xs border-b-1 border-b-grayText"
				>
					더보기
				</Link>
			)}
		</div>
	);
}
