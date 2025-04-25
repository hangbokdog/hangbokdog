import { MdHome } from "react-icons/md";
import { FaDog, FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import FooterItem from "./FooterItem";
import { useLocation } from "react-router-dom";

export default function Footer() {
	const location = useLocation();

	const footerItems = [
		{ path: "/", icon: MdHome, size: 24, label: "홈" },
		{ path: "/dogs", icon: FaDog, size: 20, label: "아이들" },
		{ path: "/donations", icon: IoMdHeart, size: 20, label: "후원" },
		{
			path: "/volunteer",
			icon: FaHandHoldingHeart,
			size: 20,
			label: "봉사",
		},
		{ path: "/my", icon: FaUser, size: 20, label: "My" },
	];

	return (
		<footer className="fixed min-w-[402px] h-14 bottom-0 z-10 px-10 flex items-center justify-between bg-white rounded-t-[12px] border-t border-[#F4F4F4]">
			{footerItems.map((item) => (
				<FooterItem
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
