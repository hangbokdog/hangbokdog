import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface FooterItemProps {
	path: string;
	icon: IconType;
	size: number;
	label: string;
	isActive: boolean;
	activeColor: string;
}

export default function FooterItem({
	path,
	icon: Icon,
	size,
	label,
	isActive,
	activeColor,
}: FooterItemProps) {
	const inactiveColor = "#ADB5C0";
	const iconColor = isActive ? activeColor : inactiveColor;
	const textColor = isActive ? activeColor : inactiveColor;

	return (
		<Link
			to={path}
			className="relative flex flex-col items-center justify-center w-full h-full pt-2 pb-1"
		>
			{isActive && (
				<motion.div
					className="absolute top-0 w-12 h-1 rounded-full"
					style={{ backgroundColor: activeColor }}
					initial={{ opacity: 0, width: 0 }}
					animate={{ opacity: 1, width: "1.5rem" }}
					transition={{ duration: 0.3 }}
				/>
			)}

			<div className="relative">
				<Icon
					size={size}
					className="transition-all duration-300 ease-in-out"
					style={{ color: iconColor }}
				/>
				{isActive && (
					<motion.div
						className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
						style={{ backgroundColor: activeColor }}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3 }}
					/>
				)}
			</div>

			<p
				className="text-xs font-medium mt-1 transition-all duration-300 ease-in-out"
				style={{ color: textColor }}
			>
				{label}
			</p>
		</Link>
	);
}
