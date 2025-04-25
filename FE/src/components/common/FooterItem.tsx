import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

interface FooterItemProps {
	path: string;
	icon: IconType;
	size: number;
	label: string;
	isActive: boolean;
}

export default function FooterItem({
	path,
	icon: Icon,
	size,
	label,
	isActive,
}: FooterItemProps) {
	return (
		<Link to={path} className="flex flex-col items-center justify-center">
			<Icon
				size={size}
				className={isActive ? "text-primary" : "text-[#ADB5C0]"}
			/>
			<p
				className={`text-sm font-semibold ${isActive ? "text-primary" : "text-[#ADB5C0]"}`}
			>
				{label}
			</p>
		</Link>
	);
}
