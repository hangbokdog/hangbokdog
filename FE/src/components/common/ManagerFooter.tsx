import { FaDog, FaPlusCircle, FaToiletPaper } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { useLocation } from "react-router-dom";
import ManagerFooterItem from "./ManagerFooterItem";

export default function ManagerFooter() {
	const location = useLocation();

	const footerItems = [
		{ path: "/manager", icon: MdHome, size: 24, label: "메인" },
		{
			path: "/manager/dog-management",
			icon: FaDog,
			size: 20,
			label: "아이들 관리",
		},
		{
			path: "/manager/dog-register",
			icon: FaPlusCircle,
			size: 20,
			label: "등록",
		},
		{
			path: "/manager/volunteer",
			icon: FaToiletPaper,
			size: 20,
			label: "지원",
		},
	];

	return (
		<footer className="fixed w-full max-w-[440px] h-14 bottom-0 z-10 px-8 flex items-center justify-between bg-background">
			{footerItems.map((item) => (
				<ManagerFooterItem
					key={item.path}
					path={item.path}
					icon={item.icon}
					size={item.size}
					label={item.label}
					isActive={location.pathname === item.path}
				/>
			))}
		</footer>
	);
}
