import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

export default function MainPanel({ panel }: { panel: PanelType }) {
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
				className={`block relative rounded-2xl border ${panel.borderColor} ${panel.color} overflow-hidden transition-transform hover:scale-[1.01] active:scale-[0.99]`}
			>
				<div className="p-5">
					<div className="flex items-start justify-between mb-4">
						<div>
							<h2 className="font-bold text-gray-800 text-lg mb-1">
								{panel.title}
							</h2>
							<p className="text-sm text-gray-600">
								{panel.description}
							</p>
						</div>
						<div
							className={`${panel.iconColor} ${panel.iconBg} p-3 rounded-xl`}
						>
							{panel.icon}
						</div>
					</div>
					<div className="mt-2 flex justify-end">
						<span
							className={`flex items-center text-xs ${panel.iconColor} font-medium`}
						>
							보러가기
							<ArrowRight className="ml-1 w-4 h-4" />
						</span>
					</div>
				</div>
				<div
					className="absolute bottom-0 left-0 right-0 h-1"
					style={{
						background: `linear-gradient(to right, ${panel.gradient[0]}, ${panel.gradient[1]})`,
					}}
				/>
			</Link>
		</motion.div>
	);
}
