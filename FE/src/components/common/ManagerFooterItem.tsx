import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";

interface ManagerFooterItemProps {
	path: string;
	icon: IconType;
	size: number;
	label: string;
	isActive: boolean;
}

export default function ManagerFooterItem({
	path,
	icon: Icon,
	size,
	label,
	isActive,
}: ManagerFooterItemProps) {
	return (
		<Link to={path} className="flex flex-col items-center justify-center text-grayText">
            <div className={`w-16 rounded-full h-8 ${isActive && "bg-[var(--color-superLightGray)]"} flex justify-center items-center`}>
                <Icon
                    size={size}
                />
            </div>
			<p
				className={"text-sm font-semibold"}
			>
				{label}
			</p>
		</Link>
	);
}
