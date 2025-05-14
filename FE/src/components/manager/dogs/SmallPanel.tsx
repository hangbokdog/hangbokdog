import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type PanelType = {
	title: string;
	description: string;
	icon: ReactNode;
	color: string;
	iconColor: string;
	iconBg: string;
	borderColor: string;
	gradient: [string, string];
	to: string;
	size: "full" | "half";
};

export default function SmallPanel({
	panel,
	index,
}: { panel: PanelType; index: number }) {
	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24,
			},
		},
	};

	return (
		<motion.div className="overflow-hidden" variants={itemVariants}>
			<Link
				to={panel.to}
				className={`block h-full relative rounded-2xl border ${panel.borderColor} ${panel.color} overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]`}
				aria-label={`${panel.title} 페이지로 이동`}
			>
				<div className="p-4 h-full flex flex-col">
					<div className="flex-1">
						<div
							className={`${panel.iconColor} mb-3 flex justify-center`}
						>
							<div className={`${panel.iconBg} p-2 rounded-lg`}>
								{panel.icon}
							</div>
						</div>
						<h2 className="font-bold text-sm text-gray-800 mb-1 text-center">
							{panel.title}
						</h2>
						<p className="text-xs text-gray-600 line-clamp-2 text-center">
							{panel.description}
						</p>
					</div>
				</div>
				<div
					className="absolute bottom-0 left-0 right-0 h-1"
					style={{
						background: `linear-gradient(to right, ${panel.gradient[0]}, ${panel.gradient[1]})`,
						opacity: 0.9,
					}}
				/>
			</Link>
		</motion.div>
	);
}
