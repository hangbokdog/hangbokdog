import { PawPrint, PlusCircle, Pill, Home, Dog } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import MainPanel from "@/components/manager/dogs/MainPanel";
import SmallPanel from "@/components/manager/dogs/SmallPanel";
import useCenterStore from "@/lib/store/centerStore";

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
			className="flex flex-col gap-4"
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
		foster: {
			bg: "bg-white",
			text: "text-orange-600",
			border: "border-orange-100",
			iconBg: "bg-orange-100",
			gradient: ["#ffedd530", "#ea580c"],
		} as ColorScheme,
		adoption: {
			bg: "bg-white",
			text: "text-blue-600",
			border: "border-blue-100",
			iconBg: "bg-blue-100",
			gradient: ["#dbeafe30", "#2563eb"],
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
			title: "임보 현황",
			description: "강아지들의 임보 현황을 확인합니다",
			icon: <PawPrint className="w-8 h-8" />,
			color: colorSchemes.foster.bg,
			iconColor: colorSchemes.foster.text,
			iconBg: colorSchemes.foster.iconBg,
			borderColor: colorSchemes.foster.border,
			gradient: colorSchemes.foster.gradient,
			to: "/manager/foster",
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
	const { selectedCenter } = useCenterStore();

	return (
		<div className="flex flex-col h-full bg-gray-50">
			<div className="bg-white shadow-sm pb-4 pl-4 pr-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="text-xl font-bold gap-2 text-gray-800 mb-1 flex items-center">
						<Dog className="w-5 h-5 text-amber-600" />
						아이들 관리
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 아이들을
						관리하세요
					</p>
				</div>
			</div>
			<div className="flex flex-col p-2.5">
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
		</div>
	);
}
