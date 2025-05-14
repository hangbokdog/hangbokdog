import { PawPrint, PlusCircle, Pill, HeartHandshake, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import MainPanel from "@/components/manager/dogs/MainPanel";
import SmallPanel from "@/components/manager/dogs/SmallPanel";

type ColorScheme = {
	bg: string;
	text: string;
	border: string;
	iconBg: string;
	gradient: [string, string];
};

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

const AnimatedContainer = ({ children }: { children: ReactNode }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<motion.div
			className="flex flex-col gap-4 max-w-md mx-auto"
			variants={containerVariants}
			initial="hidden"
			animate={isLoaded ? "visible" : "hidden"}
		>
			{children}
		</motion.div>
	);
};

const getColorSchemes = () => {
	return {
		main: {
			bg: "bg-white",
			text: "text-blue-600",
			border: "border-blue-100",
			iconBg: "bg-blue-100",
			gradient: ["#60a5fa30", "#2563eb"],
		} as ColorScheme,
		register: {
			bg: "bg-white",
			text: "text-emerald-600",
			border: "border-emerald-100",
			iconBg: "bg-emerald-100",
			gradient: ["#34d39930", "#059669"],
		} as ColorScheme,
		medicine: {
			bg: "bg-white",
			text: "text-purple-600",
			border: "border-purple-100",
			iconBg: "bg-purple-100",
			gradient: ["#c084fc30", "#9333ea"],
		} as ColorScheme,
		sponsorship: {
			bg: "bg-white",
			text: "text-pink-600",
			border: "border-pink-100",
			iconBg: "bg-pink-100",
			gradient: ["#f472b630", "#db2777"],
		} as ColorScheme,
		adoption: {
			bg: "bg-white",
			text: "text-amber-600",
			border: "border-amber-100",
			iconBg: "bg-amber-100",
			gradient: ["#fbbf2430", "#d97706"],
		} as ColorScheme,
	};
};

const usePanelData = () => {
	const colorSchemes = getColorSchemes();

	return [
		{
			title: "아이들 전체보기",
			description: "센터의 모든 강아지들을 확인해보세요",
			icon: <PawPrint className="w-12 h-12" />,
			color: colorSchemes.main.bg,
			iconColor: colorSchemes.main.text,
			iconBg: colorSchemes.main.iconBg,
			borderColor: colorSchemes.main.border,
			gradient: colorSchemes.main.gradient,
			to: "/dogs",
			size: "full",
		},
		{
			title: "아이 등록",
			description: "새 강아지 정보를 등록합니다",
			icon: <PlusCircle className="w-8 h-8" />,
			color: colorSchemes.register.bg,
			iconColor: colorSchemes.register.text,
			iconBg: colorSchemes.register.iconBg,
			borderColor: colorSchemes.register.border,
			gradient: colorSchemes.register.gradient,
			to: "/manager/dog-register",
			size: "half",
		},
		{
			title: "복약 필요한 아이들",
			description: "약을 복용해야 하는 강아지들",
			icon: <Pill className="w-8 h-8" />,
			color: colorSchemes.medicine.bg,
			iconColor: colorSchemes.medicine.text,
			iconBg: colorSchemes.medicine.iconBg,
			borderColor: colorSchemes.medicine.border,
			gradient: colorSchemes.medicine.gradient,
			to: "/manager/dog-management/drugs",
			size: "half",
		},
		{
			title: "결연 현황",
			description: "강아지들의 결연 상태를 확인합니다",
			icon: <HeartHandshake className="w-8 h-8" />,
			color: colorSchemes.sponsorship.bg,
			iconColor: colorSchemes.sponsorship.text,
			iconBg: colorSchemes.sponsorship.iconBg,
			borderColor: colorSchemes.sponsorship.border,
			gradient: colorSchemes.sponsorship.gradient,
			to: "/manager/sponsorship",
			size: "half",
		},
		{
			title: "입양 현황",
			description: "강아지들의 입양 현황을 확인합니다",
			icon: <Home className="w-8 h-8" />,
			color: colorSchemes.adoption.bg,
			iconColor: colorSchemes.adoption.text,
			iconBg: colorSchemes.adoption.iconBg,
			borderColor: colorSchemes.adoption.border,
			gradient: colorSchemes.adoption.gradient,
			to: "/manager/adoption",
			size: "half",
		},
	] as PanelType[];
};

export default function DogManageMainPage() {
	const panels = usePanelData();

	return (
		<div className="p-2.5">
			<AnimatedContainer>
				<MainPanel panel={panels[0]} />

				<div className="grid grid-cols-2 gap-4">
					{panels.slice(1, 5).map((panel, index) => (
						<SmallPanel
							key={panel.title}
							panel={panel}
							index={index}
						/>
					))}
				</div>
			</AnimatedContainer>
		</div>
	);
}
