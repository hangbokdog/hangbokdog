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
			title: "아이들관리",
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
	];

	const toggleMoreMenu = () => {
		setShowMoreMenu(!showMoreMenu);
	};

	return (
		<div className="mx-2.5 p-4 bg-white rounded-lg shadow-custom-sm border border-gray-100">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center">
					<div className="bg-main h-5 w-1 rounded-full mr-2" />
					<h3 className="text-lg font-bold">관리자 대시보드</h3>
				</div>
				<div className="px-2 py-0.5 bg-gray-100 rounded-full">
					<span className="text-xs text-gray-600">
						{selectedCenter?.centerName}
					</span>
				</div>
			</div>

			{/* 첫 번째 줄 메뉴 */}
			<div className="grid grid-cols-4 gap-3 mb-3">
				{menuItems.map((item) => (
					<button
						type="button"
						key={item.id}
						onClick={() => navigate(item.path)}
						className={`flex flex-col items-center justify-center p-2.5 rounded-xl ${item.hover} transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:shadow-none`}
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

			{/* 더 보기 버튼 (추가 메뉴가 표시되지 않을 때만) */}
			{!showMoreMenu && (
				<div className="flex justify-center mt-1 mb-2">
					<button
						type="button"
						onClick={toggleMoreMenu}
						className="flex items-center justify-center p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
						aria-label="더 보기"
					>
						<ChevronDown className="w-5 h-5 text-gray-600" />
					</button>
				</div>
			)}

			{/* 두 번째 줄 메뉴 (펼쳐졌을 때만 표시) */}
			{showMoreMenu && (
				<div className="animate-fadeIn">
					<div className="flex gap-3 mb-3">
						{additionalMenuItems.map((item) => (
							<button
								type="button"
								key={item.id}
								onClick={() => navigate(item.path)}
								className={`flex flex-col items-center justify-center p-2.5 rounded-xl ${item.hover} transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:shadow-none w-[calc(25%-9px)]`}
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

					{/* 접기 버튼 */}
					<div className="flex justify-center mt-1">
						<button
							type="button"
							onClick={toggleMoreMenu}
							className="flex items-center justify-center p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
							aria-label="접기"
						>
							<ChevronUp className="w-5 h-5 text-gray-600" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
