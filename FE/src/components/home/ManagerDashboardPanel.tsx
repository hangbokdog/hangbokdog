import { useNavigate } from "react-router-dom";
import {
	Settings,
	AlertTriangle,
	Calendar,
	Dog,
	ChevronDown,
	ChevronUp,
	Home,
	PawPrint,
	Heart,
} from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import { useState } from "react";

export default function ManagerDashboardPanel() {
	const navigate = useNavigate();
	const { selectedCenter } = useCenterStore();
	const [showMoreMenu, setShowMoreMenu] = useState(false);

	const menuItems = [
		{
			id: 1,
			title: "긴급관리",
			icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
			color: "bg-gradient-to-br from-red-100 to-red-200",
			hover: "hover:bg-red-100",
			path: "/manager/emergency",
		},
		{
			id: 2,
			title: "봉사관리",
			icon: <Calendar className="w-5 h-5 text-green-600" />,
			color: "bg-gradient-to-br from-green-100 to-green-200",
			hover: "hover:bg-green-100",
			path: "/manager/volunteer",
		},
		{
			id: 3,
			title: "아이관리",
			icon: <Dog className="w-5 h-5 text-amber-600" />,
			color: "bg-gradient-to-br from-amber-100 to-amber-200",
			hover: "hover:bg-amber-100",
			path: "/manager/dog-management",
		},
		{
			id: 4,
			title: "센터관리",
			icon: <Settings className="w-5 h-5 text-purple-600" />,
			color: "bg-gradient-to-br from-purple-100 to-purple-200",
			hover: "hover:bg-purple-100",
			path: "/manager/center",
		},
	];

	const additionalMenuItems = [
		{
			id: 5,
			title: "입양관리",
			icon: <Home className="w-5 h-5 text-blue-600" />,
			color: "bg-gradient-to-br from-blue-100 to-blue-200",
			hover: "hover:bg-blue-100",
			path: "/manager/adoption",
		},
		{
			id: 6,
			title: "임보관리",
			icon: <PawPrint className="w-5 h-5 text-orange-600" />,
			color: "bg-gradient-to-br from-orange-100 to-orange-200",
			hover: "hover:bg-orange-100",
			path: "/manager/foster",
		},
		{
			id: 7,
			title: "결연관리",
			icon: <Heart className="w-5 h-5 text-pink-600" />,
			color: "bg-gradient-to-br from-pink-100 to-pink-200",
			hover: "hover:bg-pink-100",
			path: "/manager/sponsorship",
		},
	];

	const toggleMoreMenu = () => {
		setShowMoreMenu(!showMoreMenu);
	};

	return (
		<div className="mx-2.5 py-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center">
					<div className="bg-main h-5 w-1 rounded-full mr-2" />
					<h3 className="text-lg font-bold">관리자 대시보드</h3>
				</div>
				<div className="px-4 py-0.5 bg-gray-100 rounded-full text-sm text-grayText">
					{selectedCenter?.centerName}
				</div>
			</div>

			{/* 첫 번째 줄 메뉴 */}
			<div className="grid grid-cols-4 gap-3 mb-3">
				{menuItems.map((item) => (
					<button
						type="button"
						key={item.id}
						onClick={() => navigate(item.path)}
						className={`flex flex-col items-center justify-center p-2.5 rounded-xl ${item.hover} transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:shadow-md active:-translate-y-1 touch-action-manipulation`}
					>
						<div
							className={`${item.color} rounded-full p-2.5 mb-1.5 shadow-sm`}
						>
							{item.icon}
						</div>
						<span className="text-xs font-medium text-gray-700">
							{item.title}
						</span>
					</button>
				))}
			</div>

			{/* 애니메이션 적용된 컨테이너 */}
			<div className="relative">
				<div
					className={`transition-all duration-500 ease-in-out ${
						showMoreMenu
							? "max-h-60 opacity-100 mb-3"
							: "max-h-0 opacity-0 mb-0 overflow-hidden"
					}`}
				>
					<div className="flex gap-3 pt-2">
						{additionalMenuItems.map((item) => (
							<button
								type="button"
								key={item.id}
								onClick={() => navigate(item.path)}
								className={`flex flex-col items-center justify-center p-2.5 rounded-xl ${item.hover} transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:shadow-md active:-translate-y-1 touch-action-manipulation w-[calc(25%-9px)]`}
							>
								<div
									className={`${item.color} rounded-full p-2.5 mb-1.5 shadow-sm`}
								>
									{item.icon}
								</div>
								<span className="text-xs font-medium text-gray-700">
									{item.title}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* 줄과 버튼 (함께 움직임) */}
				<div
					className={`flex justify-center transition-all duration-500 ease-in-out ${showMoreMenu ? "mt-0" : "mt-1 mb-2"}`}
				>
					<div className="relative w-full flex items-center justify-center">
						{/* 가로선 */}
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200" />
						</div>

						{/* 버튼 */}
						<button
							type="button"
							onClick={toggleMoreMenu}
							className="relative z-10 flex items-center justify-center py-1 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
							aria-label={showMoreMenu ? "접기" : "더 보기"}
						>
							{showMoreMenu ? (
								<ChevronUp className="w-5 h-5 text-gray-600" />
							) : (
								<ChevronDown className="w-5 h-5 text-gray-600" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
