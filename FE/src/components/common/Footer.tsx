import { FaDog, FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { MdHome, MdLogin } from "react-icons/md";
import { useLocation } from "react-router-dom";
import FooterItem from "./FooterItem";
import useAuthStore from "@/lib/store/authStore";

export default function Footer() {
	const location = useLocation();
	const { user } = useAuthStore();

	const lastMenuItem = user.accessToken
		? { path: "/my", icon: FaUser, size: 20, label: "My" }
		: { path: "/login", icon: MdLogin, size: 20, label: "로그인" };

	const footerItems = [
		{ path: "/", icon: MdHome, size: 24, label: "홈" },
		{ path: "/dogs", icon: FaDog, size: 20, label: "아이들" },
		// {
		// 	path: "/bazaar",
		// 	icon: FaHandHoldingHeart,
		// 	size: 20,
		// 	label: "바자회",
		// },
		{
			path: "/volunteer",
			icon: FaHandHoldingHeart,
			size: 20,
			label: "봉사",
		},
		lastMenuItem,
	];

	return (
		<footer className="fixed w-full max-w-[440px] h-16 bottom-0 px-10 z-10 mx-auto flex items-center justify-between bg-white rounded-t-[12px] border-t border-[#F4F4F4]">
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
